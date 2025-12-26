import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Get all notifications for an organization
router.get("/organization/:orgId", async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { rows } = await pool.query(
      `SELECT id, title, message, type, is_read, created_at, created_by, display_time, remove_time
       FROM notifications
       WHERE org_id = $1
       ORDER BY created_at DESC`,
      [orgId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get active notifications for display on dashboard
router.get("/organization/:orgId/active", async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { rows } = await pool.query(
      `SELECT id, title, message, type, display_time, remove_time
       FROM notifications
       WHERE org_id = $1
       AND (display_time IS NULL OR display_time <= NOW())
       AND (remove_time IS NULL OR remove_time > NOW())
       ORDER BY display_time DESC NULLS LAST, created_at DESC`,
      [orgId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get unread notification count for an organization
router.get("/organization/:orgId/unread-count", async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { rows } = await pool.query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE org_id = $1 AND is_read = FALSE`,
      [orgId]
    );
    res.json({ count: parseInt(rows[0].count) });
  } catch (e) {
    next(e);
  }
});

// Create a new notification
router.post("/", async (req, res, next) => {
  try {
    const { org_id, title, message, type, created_by, display_time, remove_time } = req.body;

    if (!org_id || !title || !message) {
      return res.status(400).json({ error: "org_id, title, and message are required" });
    }

    const { rows } = await pool.query(
      `INSERT INTO notifications (org_id, title, message, type, created_by, display_time, remove_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [org_id, title, message, type || 'info', created_by || null, display_time || null, remove_time || null]
    );

    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Mark notification as read
router.patch("/:id/read", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Mark all notifications as read for an organization
router.patch("/organization/:orgId/read-all", async (req, res, next) => {
  try {
    const { orgId } = req.params;
    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE org_id = $1 AND is_read = FALSE`,
      [orgId]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (e) {
    next(e);
  }
});

// Delete a notification
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM notifications
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification deleted", notification: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Get welcome message for an organization
router.get("/organization/:orgId/welcome-message", async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { rows } = await pool.query(
      `SELECT welcome_message
       FROM organizations
       WHERE id = $1`,
      [orgId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json({
      welcome_message: rows[0].welcome_message || null
    });
  } catch (e) {
    next(e);
  }
});

// Update welcome message for an organization
router.patch("/organization/:orgId/welcome-message", async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const { welcome_message } = req.body;

    if (welcome_message === undefined) {
      return res.status(400).json({ error: "welcome_message is required" });
    }

    const { rows } = await pool.query(
      `UPDATE organizations
       SET welcome_message = $1
       WHERE id = $2
       RETURNING welcome_message`,
      [welcome_message, orgId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

export default router;
