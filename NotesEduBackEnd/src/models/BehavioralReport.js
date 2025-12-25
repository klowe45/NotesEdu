import { pool } from "../db.js";

class BehavioralReport {
  static async create({ client_id, content, author, staff_id }) {
    const result = await pool.query(
      `INSERT INTO behavioral_reports (client_id, content, author, staff_id, date_submitted)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING id, client_id, content, author, staff_id, date_submitted`,
      [client_id, content, author, staff_id]
    );
    return result.rows[0];
  }

  static async findAll() {
    const result = await pool.query(
      `SELECT
        br.id,
        br.client_id,
        br.content,
        br.author,
        br.staff_id,
        br.date_submitted,
        c.first_name,
        c.middle_name,
        c.last_name
       FROM behavioral_reports br
       JOIN clients c ON br.client_id = c.id
       ORDER BY br.date_submitted DESC`
    );
    return result.rows;
  }

  static async findByClientId(clientId) {
    const result = await pool.query(
      `SELECT
        br.id,
        br.client_id,
        br.content,
        br.author,
        br.staff_id,
        br.date_submitted,
        c.first_name,
        c.middle_name,
        c.last_name
       FROM behavioral_reports br
       JOIN clients c ON br.client_id = c.id
       WHERE br.client_id = $1
       ORDER BY br.date_submitted DESC`,
      [clientId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT
        br.id,
        br.client_id,
        br.content,
        br.author,
        br.staff_id,
        br.date_submitted,
        c.first_name,
        c.middle_name,
        c.last_name
       FROM behavioral_reports br
       JOIN clients c ON br.client_id = c.id
       WHERE br.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM behavioral_reports WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }
}

export default BehavioralReport;
