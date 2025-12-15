// src/db.js
import "dotenv/config";
import dns from "node:dns";
import pkg from "pg";
const { Pool } = pkg;

// Prefer IPv4 first (avoids IPv6 connect issues on some hosts like Render)
dns.setDefaultResultOrder?.("ipv4first");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your environment (use the Neon *-pooler* URL with sslmode=require)."
  );
}

export const pool = new Pool({
  connectionString,
  // Neon requires SSL; Render doesn’t ship a CA by default, so don’t reject
  ssl: { rejectUnauthorized: false },

  // Optional tuning (env overrides if you want)
  max: Number(process.env.PGPOOL_MAX ?? 10),
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT ?? 30_000),
  connectionTimeoutMillis: Number(process.env.PG_CONN_TIMEOUT ?? 10_000),
});

// Convenience helper
export const query = (text, params) => pool.query(text, params);

// Call this once at startup to fail fast if DB is unreachable
export async function assertDb() {
  const r = await pool.query("select 1 as ok");
  if (!r?.rows?.[0]?.ok) throw new Error("DB connection failed");
  console.log("✅ DB connected");
}

// Graceful shutdown
async function closePool(signal) {
  try {
    await pool.end();
    console.log(`🛑 DB pool closed (${signal})`);
    process.exit(0);
  } catch (e) {
    console.error("Error closing DB pool", e);
    process.exit(1);
  }
}
process.on("SIGTERM", () => closePool("SIGTERM"));
process.on("SIGINT", () => closePool("SIGINT"));
