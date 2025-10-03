import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `select n.id, n.title, n.body, n.created_at,
              s.first_name as student_first, s.last_name as student_last,
              t.first_name as teacher_first, t.last_name as teacher_last
       from notes n
       join students s on s.id = n.student_id
       left join teachers t on t.id = n.teacher_id
       order by n.created_at desc`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

export default router;
