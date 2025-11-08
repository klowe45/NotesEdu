import { pool } from "../db.js";

class Attendance {
  constructor(firstName, lastName, appeared, date) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.appeared = appeared;
    this.date = date || new Date().toISOString().split('T')[0]; // Default to today if not provided
  }

  // Create a new attendance record
  async save() {
    try {
      const { rows } = await pool.query(
        `INSERT INTO attendance (first_name, last_name, appeared, date)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [this.firstName, this.lastName, this.appeared, this.date]
      );
      return rows[0];
    } catch (error) {
      throw new Error(`Error saving attendance: ${error.message}`);
    }
  }

  // Get all attendance records
  static async findAll() {
    try {
      const { rows } = await pool.query(
        `SELECT id, first_name, last_name, appeared, date
         FROM attendance
         ORDER BY date DESC, id`
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching attendance records: ${error.message}`);
    }
  }

  // Get attendance by date
  static async findByDate(date) {
    try {
      const { rows } = await pool.query(
        `SELECT id, first_name, last_name, appeared, date
         FROM attendance
         WHERE date = $1
         ORDER BY id`,
        [date]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching attendance by date: ${error.message}`);
    }
  }

  // Get attendance by student name
  static async findByStudentName(firstName, lastName) {
    try {
      const { rows } = await pool.query(
        `SELECT id, first_name, last_name, appeared, date
         FROM attendance
         WHERE first_name = $1 AND last_name = $2
         ORDER BY date DESC`,
        [firstName, lastName]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching attendance by student name: ${error.message}`);
    }
  }

  // Create multiple attendance records at once
  static async createBatch(attendanceRecords) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertedRecords = [];
      for (const record of attendanceRecords) {
        const { rows } = await client.query(
          `INSERT INTO attendance (first_name, last_name, appeared, date)
           VALUES ($1, $2, $3, $4)
           RETURNING *`,
          [record.firstName, record.lastName, record.appeared, record.date]
        );
        insertedRecords.push(rows[0]);
      }

      await client.query('COMMIT');
      return insertedRecords;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Error creating batch attendance: ${error.message}`);
    } finally {
      client.release();
    }
  }
}

export default Attendance;
