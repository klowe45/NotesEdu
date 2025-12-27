import { Router } from "express";
import { pool } from "../db.js";
import { sendPushNotifications } from "../services/pushNotificationService.js";

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
    const { staff_id } = req.query; // Staff ID to filter notifications

    let query;
    let params;

    if (staff_id) {
      // Filter notifications for specific staff member
      // Show notifications that either have no targets (visible to all) or target this specific staff member
      query = `
        SELECT DISTINCT n.id, n.title, n.message, n.type, n.display_time, n.remove_time
        FROM notifications n
        LEFT JOIN notification_targets nt ON n.id = nt.notification_id
        WHERE n.org_id = $1
        AND (n.display_time IS NULL OR n.display_time <= NOW())
        AND (n.remove_time IS NULL OR n.remove_time > NOW())
        AND (
          NOT EXISTS (SELECT 1 FROM notification_targets WHERE notification_id = n.id)
          OR nt.staff_id = $2
        )
        ORDER BY n.display_time DESC NULLS LAST, n.created_at DESC
      `;
      params = [orgId, staff_id];
    } else {
      // No staff_id provided, show all active notifications
      query = `
        SELECT id, title, message, type, display_time, remove_time
        FROM notifications
        WHERE org_id = $1
        AND (display_time IS NULL OR display_time <= NOW())
        AND (remove_time IS NULL OR remove_time > NOW())
        ORDER BY display_time DESC NULLS LAST, created_at DESC
      `;
      params = [orgId];
    }

    const { rows } = await pool.query(query, params);
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
    const { org_id, title, message, type, created_by, display_time, remove_time, target_staff_ids, push_notification_staff_ids } = req.body;

    if (!org_id || !title || !message) {
      return res.status(400).json({ error: "org_id, title, and message are required" });
    }

    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert the notification
      const { rows } = await client.query(
        `INSERT INTO notifications (org_id, title, message, type, created_by, display_time, remove_time)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [org_id, title, message, type || 'info', created_by || null, display_time || null, remove_time || null]
      );

      const notification = rows[0];

      // If target_staff_ids is provided and not empty, insert notification targets
      if (target_staff_ids && Array.isArray(target_staff_ids) && target_staff_ids.length > 0) {
        // Insert notification targets for each staff member
        for (const staff_id of target_staff_ids) {
          await client.query(
            `INSERT INTO notification_targets (notification_id, staff_id)
             VALUES ($1, $2)
             ON CONFLICT (notification_id, staff_id) DO NOTHING`,
            [notification.id, staff_id]
          );
        }
      }
      // If no target_staff_ids or empty array, notification is visible to all (no records in notification_targets)

      await client.query('COMMIT');

      // Send push notifications if requested (do this after transaction commits)
      if (push_notification_staff_ids && Array.isArray(push_notification_staff_ids) && push_notification_staff_ids.length > 0) {
        // Don't await - send push notifications asynchronously
        sendPushNotifications(push_notification_staff_ids, {
          title: title,
          body: message,
          url: "/",
        }).catch((err) => {
          console.error("Error sending push notifications:", err);
          // Don't fail the request if push notifications fail
        });
      }

      res.status(201).json(notification);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
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
