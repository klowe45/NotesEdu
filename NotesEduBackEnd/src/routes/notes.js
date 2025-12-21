import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `select n.id, n.title, n.body, n.created_at,
              c.first_name as client_first, c.last_name as client_last,
              t.first_name as teacher_first, t.last_name as teacher_last
       from notes n
       join clients c on c.id = n.client_id
       left join owners t on t.id = n.teacher_id
       order by n.created_at desc`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

export default router;
