import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Get all categories for a teacher
router.get("/teacher/:teacherId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, created_at
       FROM categories
       WHERE teacher_id = $1
       ORDER BY created_at ASC`,
      [req.params.teacherId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Get all categories for an organization
router.get("/organization/:orgId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, created_at
       FROM categories
       WHERE org_id = $1
       ORDER BY created_at ASC`,
      [req.params.orgId]
    );
    res.json(rows);
  } catch (e) {
    next(e);
  }
});

// Create a new category for a teacher or organization
router.post("/", async (req, res, next) => {
  try {
    const { teacher_id, org_id, name } = req.body;

    // Ensure either teacher_id or org_id is provided, but not both
    if ((teacher_id && org_id) || (!teacher_id && !org_id)) {
      return res.status(400).json({ error: 'Must provide either teacher_id or org_id, but not both' });
    }

    const { rows } = await pool.query(
      `INSERT INTO categories (teacher_id, org_id, name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [teacher_id || null, org_id || null, name]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    // Handle unique constraint violation
    if (e.code === '23505') {
      return res.status(400).json({ error: 'Category already exists' });
    }
    next(e);
  }
});

// Delete a category
router.delete("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `DELETE FROM categories WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted", category: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Initialize default categories for a teacher or organization
router.post("/init", async (req, res, next) => {
  try {
    const { teacher_id, org_id } = req.body;

    // Ensure either teacher_id or org_id is provided, but not both
    if ((teacher_id && org_id) || (!teacher_id && !org_id)) {
      return res.status(400).json({ error: 'Must provide either teacher_id or org_id, but not both' });
    }

    const defaultCategories = [
      "Money Management",
      "Meal Prep",
      "Medication Management",
      "Housekeeping",
      "Shopping",
      "Transportation",
      "Communication",
      "Health Management",
    ];

    const insertedCategories = [];
    for (const name of defaultCategories) {
      try {
        const { rows } = await pool.query(
          `INSERT INTO categories (teacher_id, org_id, name)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [teacher_id || null, org_id || null, name]
        );
        insertedCategories.push(rows[0]);
      } catch (e) {
        // Skip if category already exists
        if (e.code !== '23505') {
          throw e;
        }
      }
    }

    res.status(201).json(insertedCategories);
  } catch (e) {
    next(e);
  }
});

export default router;
