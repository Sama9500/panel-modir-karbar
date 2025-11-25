
// model_karbar.js
const mysql = require("mysql2/promise")

let pool
async function rahandaziDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
  return pool
}

async function ModelKarbar() {
  try {
    const db = await rahandaziDb()

    // ساخت جدول karbar اگر وجود نداشت
    await db.execute(`
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

    console.log("✅ جدول karbar در MySQL آماده است")

    // آبجکت برای کار با جدول karbar
    return {
      async insert(email, ramzHashed, role = "user", status = "active") {
        const [result] = await db.execute(
          "INSERT INTO karbar (email, ramzHashed, role, status) VALUES (?, ?, ?, ?)",
          [email, ramzHashed, role, status]
        )
        return result.insertId
      },

      async findByEmail(email) {
        const [rows] = await db.execute(
          "SELECT id, email, role, status, created_at, updated_at FROM karbar WHERE email = ?",
          [email]
        )
        return rows[0]
      },

      async findAll() {
        const [rows] = await db.execute(
          "SELECT id, email, role, status, created_at, updated_at FROM karbar"
        )
        return rows
      },

      async updateStatus(id, newStatus) {
        await db.execute(
          "UPDATE karbar SET status = ? WHERE id = ?",
          [newStatus, id]
        )
        return true
      },

      async deleteById(id) {
        await db.execute("DELETE FROM karbar WHERE id = ?", [id])
        return true
      }
    }
  } catch (err) {
    console.error("❌ ارتباط با MySQL یا ساخت جدول karbar ممکن نشد:", err.message)
    process.exit(1)
  }
}

module.exports = ModelKarbar