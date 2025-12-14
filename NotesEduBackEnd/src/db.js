// src/db.js
import "dotenv/config";
import dns from "node:dns";
import pkg from "pg";
const { Pool } = pkg;

// Prefer IPv4 so Node doesn't try IPv6 first on Render
dns.setDefaultResultOrder("ipv4first");

// Always use DATABASE_URL on Render/Neon
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // safe with Neon; URL also has sslmode=require
});

// Optional: quick startup check
export async function assertDb() {
  const r = await pool.query("select 1 as ok");
  if (r.rows?.[0]?.ok !== 1) throw new Error("DB connection failed");
  console.log("✅ DB connected");
}
