import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Create a new rating
router.post("/", async (req, res, next) => {
  try {
    const { client_id, category, rating_value, daily_id, teacher_id, date, notes } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO ratings (client_id, category, rating_value, daily_id, teacher_id, date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [client_id, category, rating_value, daily_id, teacher_id, date, notes]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Get ratings for a specific client
router.get("/client/:clientId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.category, r.rating_value, r.date, r.notes, r.created_at,
              t.first_name as teacher_first, t.last_name as teacher_last,
              d.title as daily_title
       FROM ratings r
       LEFT JOIN owners t on t.id = r.teacher_id
       LEFT JOIN dailies d on d.id = r.daily_id
       WHERE r.client_id = $1
       ORDER BY r.date DESC, r.created_at DESC`,
      [req.params.clientId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get ratings for a specific daily
router.get("/daily/:dailyId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.client_id, r.category, r.rating_value, r.date, r.notes, r.created_at,
              c.first_name as client_first, c.last_name as client_last,
              t.first_name as teacher_first, t.last_name as teacher_last
       FROM ratings r
       LEFT JOIN clients c on c.id = r.client_id
       LEFT JOIN owners t on t.id = r.teacher_id
       WHERE r.daily_id = $1
       ORDER BY r.category`,
      [req.params.dailyId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get all ratings
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT r.id, r.client_id, r.category, r.rating_value, r.date, r.notes, r.created_at,
              c.first_name as client_first, c.last_name as client_last,
              t.first_name as teacher_first, t.last_name as teacher_last,
              d.title as daily_title
       FROM ratings r
       LEFT JOIN clients c on c.id = r.client_id
       LEFT JOIN owners t on t.id = r.teacher_id
       LEFT JOIN dailies d on d.id = r.daily_id
       ORDER BY r.date DESC, r.created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Update a rating
router.put("/:id", async (req, res, next) => {
  try {
    const { category, rating_value, notes } = req.body;
    const { rows } = await pool.query(
      `UPDATE ratings
       SET category = COALESCE($1, category),
           rating_value = COALESCE($2, rating_value),
           notes = COALESCE($3, notes)
       WHERE id = $4
       RETURNING *`,
      [category, rating_value, notes, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Delete a rating
router.delete("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM ratings WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Rating not found" });
    }
    res.json({ message: "Rating deleted successfully", rating: rows[0] });
  } catch (e) {
    next(e);
  }
});

export default router;
