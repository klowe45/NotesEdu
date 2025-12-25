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

    // Prepare attendance records with client names
    const attendanceRecords = [];
    const skippedClients = [];

    for (const record of attendanceData) {
      // Get client's first and last name from clients table
      const clientResult = await pool.query(
        `SELECT first_name, last_name FROM clients WHERE id = $1`,
        [record.student_id]
      );

      if (clientResult.rows.length === 0) {
        throw new Error(`Client with id ${record.student_id} not found`);
      }

      const { first_name, last_name } = clientResult.rows[0];

      // Check if attendance already exists for this client today
      const existingAttendance = await pool.query(
        `SELECT id FROM attendance WHERE first_name = $1 AND last_name = $2 AND date = $3`,
        [first_name, last_name, date]
      );

      if (existingAttendance.rows.length > 0) {
        skippedClients.push(`${first_name} ${last_name}`);
        continue; // Skip this client
      }

      attendanceRecords.push({
        firstName: first_name,
        lastName: last_name,
        appeared: record.appeared,
        date: date
      });
    }

    // Use the Attendance model to create batch records
    let insertedRecords = [];
    if (attendanceRecords.length > 0) {
      insertedRecords = await Attendance.createBatch(attendanceRecords);
    }

    res.status(201).json({
      message: "Attendance submitted successfully",
      records: insertedRecords,
      skipped: skippedClients.length > 0 ? skippedClients : undefined
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

router.get("/today", async (_req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(
      `SELECT first_name, last_name, appeared FROM attendance WHERE date = $1`,
      [today]
    );
    res.json(result.rows);
  } catch (e) {
    next(e);
  }
});

export default router;
