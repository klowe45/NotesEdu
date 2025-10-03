import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      "select id, first_name, last_name, email, created_at from teachers order by id"
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

export default router;
