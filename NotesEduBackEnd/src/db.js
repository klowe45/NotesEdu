// src/db.js
import "dotenv/config";
import dns from "node:dns";
import pkg from "pg";
const { Pool } = pkg;

// Prefer IPv4 so Node doesn't try IPv6 first on Render
dns.setDefaultResultOrder("ipv4first");

// Use DATABASE_URL (production/Neon) or fall back to local config
export const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD || undefined,
        port: Number(process.env.PGPORT || 5432),
      }
);

// Optional: quick startup check
export async function assertDb() {
  const r = await pool.query("select 1 as ok");
  if (r.rows?.[0]?.ok !== 1) throw new Error("DB connection failed");
  console.log("✅ DB connected");
}
