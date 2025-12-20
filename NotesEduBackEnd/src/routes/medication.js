import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Create or update medication records for a client
router.post("/", async (req, res, next) => {
  try {
    const { client_id, teacher_id, general_notes, medications } = req.body;

    // Delete existing medication records for this client
    await pool.query("DELETE FROM medication WHERE client_id = $1", [
      client_id,
    ]);

    // Insert new medication records
    const results = [];
    for (const med of medications) {
      const result = await pool.query(
        "INSERT INTO medication (client_id, teacher_id, general_notes, medication_name, medication_notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [client_id, teacher_id, general_notes, med.name, med.notes]
      );
      results.push(result.rows[0]);
    }

    res.status(201).json(results);
  } catch (err) {
    next(err);
  }
});

// Get medication records for a specific client
router.get("/client/:clientId", async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const result = await pool.query(
      "SELECT * FROM medication WHERE client_id = $1 ORDER BY created_at DESC",
      [clientId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get all medication records
router.get("/", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM medication ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Delete a medication record
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM medication WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
