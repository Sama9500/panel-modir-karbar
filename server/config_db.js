
// config/db.js
const mysql = require("mysql2/promise")

let pool
async function rahandaziDb() {
  if (!pool) {
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    }

    try {
      // ایجاد pool برای مدیریت اتصال‌ها
      pool = mysql.createPool(config)

      // ساخت جدول karbar اگر وجود نداشت
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS karbar (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          ramzHashed VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)

      console.log("✅ ارتباط با MySQL برقرار شد و جدول karbar آماده است")
    } catch (err) {
      console.error("❌ ارتباط با MySQL یا ساخت جدول karbar ممکن نشد:", err.message)
      process.exit(1)
    }
  }

  // آبجکت برای کار با جدول karbar
  const ModelKarbar = {
    async insert(email, ramzHashed, role = "user", status = "active") {
      const [result] = await pool.execute(
        "INSERT INTO karbar (email, ramzHashed, role, status) VALUES (?, ?, ?, ?)",
        [email, ramzHashed, role, status]
      )
      return result.insertId
    },

    async findByEmail(email) {
      const [rows] = await pool.execute(
        "SELECT id, email, role, status, created_at, updated_at FROM karbar WHERE email = ?",
        [email]
      )
      return rows[0]
    },

    async findAll() {
      const [rows] = await pool.execute(
        "SELECT id, email, role, status, created_at, updated_at FROM karbar"
      )
      return rows
    },

    async updateStatus(id, newStatus) {
      await pool.execute("UPDATE karbar SET status = ? WHERE id = ?", [newStatus, id])
      return true
    },

    async deleteById(id) {
      await pool.execute("DELETE FROM karbar WHERE id = ?", [id])
      return true
    }
  }

  return ModelKarbar
}

module.exports = rahandaziDb
