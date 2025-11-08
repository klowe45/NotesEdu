import { Router } from "express";
import { pool } from "../db.js";
import Attendance from "../models/Attendance.js";
const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { attendanceData } = req.body;
    // attendanceData should be an array of objects: [{ student_id: 1, appeared: true }, ...]

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ error: "Invalid attendance data" });
    }

    const date = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Prepare attendance records with student names
    const attendanceRecords = [];
    for (const record of attendanceData) {
      // Get student's first and last name from students table
      const studentResult = await pool.query(
        `SELECT first_name, last_name FROM students WHERE id = $1`,
        [record.student_id]
      );

      if (studentResult.rows.length === 0) {
        throw new Error(`Student with id ${record.student_id} not found`);
      }

      const { first_name, last_name } = studentResult.rows[0];

      attendanceRecords.push({
        firstName: first_name,
        lastName: last_name,
        appeared: record.appeared,
        date: date
      });
    }

    // Use the Attendance model to create batch records
    const insertedRecords = await Attendance.createBatch(attendanceRecords);

    res.status(201).json({
      message: "Attendance submitted successfully",
      records: insertedRecords
    });
  } catch (e) {
    next(e);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const records = await Attendance.findAll();
    res.json(records);
  } catch (e) {
    next(e);
  }
});

export default router;
