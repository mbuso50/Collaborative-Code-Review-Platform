import { pool } from "../config/database";
import fs from "fs";
import path from "path";

async function setupDatabase() {
  try {
    // Read and execute the schema SQL file
    const schemaPath = path.join(__dirname, "../../schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");
    
    console.log("Setting up database schema...");
    await pool.query(schemaSQL);
    console.log("Database schema created successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase();
