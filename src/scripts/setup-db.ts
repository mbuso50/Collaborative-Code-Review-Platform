import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');


    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');


    await pool.query(schemaSQL);
    console.log(' Database schema setup completed!');


    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`Database has ${tablesCheck.rows.length} tables:`);
    tablesCheck.rows.forEach((table: any) => {
      console.log(` ${table.table_name}`);
    });

    process.exit(0);
  } catch (error: any) {
    if (error.code === '42P07') {
      console.log('  Tables already exist. Database is ready!');
      process.exit(0);
    } else {
      console.error(' Error setting up database:', error.message);
      process.exit(1);
    }
  }
}

setupDatabase();