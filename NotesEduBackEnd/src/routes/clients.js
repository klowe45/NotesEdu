import { Router } from "express";
import { pool } from "../db.js";
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, middle_name, last_name, address, phone,
              guardian_first_name, guardian_last_name, guardian_phone, guardian_email,
              created_at
       FROM clients ORDER BY id`
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { first_name, middle_name, last_name } = req.body;
    const { rows } = await pool.query(
      `insert into clients (first_name, middle_name, last_name)
       values ($1, $2, $3) returning *`,
      [first_name, middle_name || null, last_name]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, first_name, middle_name, last_name, address, phone,
              guardian_first_name, guardian_last_name, guardian_phone, guardian_email,
              created_at
       FROM clients WHERE id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.get("/:id/notes", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `select n.id, n.title, n.body, n.created_at,
              t.first_name as teacher_first, t.last_name as teacher_last
       from notes n
       left join teachers t on t.id = n.teacher_id
       where n.client_id = $1
       order by n.created_at desc`,
      [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

router.post("/:id/notes", async (req, res, next) => {
  try {
    const { teacher_id, title, body } = req.body;
    const { rows } = await pool.query(
      `insert into notes (client_id, teacher_id, title, body)
       values ($1, $2, $3, $4) returning *`,
      [req.params.id, teacher_id, title, body]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      address,
      phone,
      guardian_first_name,
      guardian_last_name,
      guardian_phone,
      guardian_email
    } = req.body;

    const { rows } = await pool.query(
      `UPDATE clients
       SET first_name = $1,
           middle_name = $2,
           last_name = $3,
           address = $4,
           phone = $5,
           guardian_first_name = $6,
           guardian_last_name = $7,
           guardian_phone = $8,
           guardian_email = $9
       WHERE id = $10
       RETURNING *`,
      [
        first_name,
        middle_name || null,
        last_name,
        address || null,
        phone || null,
        guardian_first_name || null,
        guardian_last_name || null,
        guardian_phone || null,
        guardian_email || null,
        req.params.id
      ]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM clients WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Client not found" });
    }
    res.json({ message: "Client deleted successfully", client: rows[0] });
  } catch (e) {
    next(e);
  }
});

export default router;
