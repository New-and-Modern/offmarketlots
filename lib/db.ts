import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('amazonaws.com')
    ? { rejectUnauthorized: false }
    : false
});

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<{ rows: T[], rowCount: number }> {
  try {
    const res = await pool.query(text, params);
    return { rows: res.rows, rowCount: res.rowCount || 0 };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}