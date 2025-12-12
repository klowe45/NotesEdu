import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

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

export async function assertDb() {
  const r = await pool.query("select 1 as ok");
  if (r.rows?.[0]?.ok !== 1) throw new Error("DB connection failed");
  console.log(
    `✅ DB connected: ${process.env.PGDATABASE} on ${process.env.PGPORT}`
  );
}
