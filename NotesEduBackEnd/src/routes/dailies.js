import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Create a new daily for a client
router.post("/", async (req, res, next) => {
  try {
    const { student_id, teacher_id, title, body } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO dailies (client_id, teacher_id, title, body)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [student_id, teacher_id, title, body]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// Get dailies for a specific client
router.get("/client/:clientId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.id, d.title, d.body, d.created_at,
              t.first_name as teacher_first, t.last_name as teacher_last
       FROM dailies d
       LEFT JOIN teachers t on t.id = d.teacher_id
       WHERE d.client_id = $1
       ORDER BY d.created_at DESC`,
      [req.params.clientId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get all dailies
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.id, d.client_id, d.title, d.body, d.created_at,
              t.first_name as teacher_first, t.last_name as teacher_last,
              c.first_name as client_first, c.last_name as client_last
       FROM dailies d
       LEFT JOIN teachers t on t.id = d.teacher_id
       LEFT JOIN clients c on c.id = d.client_id
       ORDER BY d.created_at DESC`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

export default router;
