import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Collaborative-Code-Review-Platform-db",
  password: process.env.DB_PASSWORD || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
});


pool.on("connect", () => {
  console.log(" Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error(" Database connection error:", err.message);
});


export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    console.log(" Database connection test successful");
    client.release();
    return true;
  } catch (error: any) {
    console.error(" Database connection test failed:", error.message);
    return false;
  }
};