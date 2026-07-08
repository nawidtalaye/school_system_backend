// backend/database/seed.js
// Run once after school_management.sql has created the schema:
//   node backend/database/seed.js
// Safely creates the default Admin account with a real bcrypt hash.

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

const DEFAULT_ADMIN = {
  full_name: 'Admin',
  username: 'admin',
  email: 'admin@gmail.com',
  password: 'admin123',
  role: 'Admin',
};

async function seedAdmin() {
  const connection = await pool.getConnection();

  try {
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
      [DEFAULT_ADMIN.email, DEFAULT_ADMIN.username]
    );

    if (existing.length > 0) {
      console.log('Admin account already exists. Skipping seed.');
      return;
    }

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    await connection.query(
      `INSERT INTO users (full_name, username, email, password, role, status)
       VALUES (?, ?, ?, ?, ?, 'Active')`,
      [
        DEFAULT_ADMIN.full_name,
        DEFAULT_ADMIN.username,
        DEFAULT_ADMIN.email,
        hashedPassword,
        DEFAULT_ADMIN.role,
      ]
    );

    console.log('Default admin account created successfully.');
    console.log(`  Email:    ${DEFAULT_ADMIN.email}`);
    console.log(`  Username: ${DEFAULT_ADMIN.username}`);
    console.log(`  Password: ${DEFAULT_ADMIN.password} (change this after first login)`);
  } catch (error) {
    console.error('Failed to seed admin account:', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedAdmin();
