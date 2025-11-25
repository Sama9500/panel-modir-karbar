
// middleware_auth.js
const jwt = require("jsonwebtoken")
const mysql = require("mysql2/promise")
require("dotenv").config()

// اتصال پایدار به دیتابیس با اطلاعات .env
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

async function middlewareAuth(req, res, next) {
  const sarcheshme = req.headers.authorization || ""
  const gheta = sarcheshme.split(" ")
  const token = gheta.length === 2 ? gheta[1] : null

  if (!token) {
    return res.status(401).json({ message: "❌ توکن یافت نشد" })
  }

  try {
    // بررسی و رمزگشایی توکن
    const kodGoshay = jwt.verify(token, process.env.JWT_SECRET)

    // ذخیره اطلاعات در req برای استفاده بعدی
    req.karbarId = kodGoshay.id
    req.role = kodGoshay.role
    req.email = kodGoshay.email

    // بررسی وجود کاربر در جدول karbar
    const db = await rahandaziDb()
    const [rows] = await db.query(
      "SELECT id, email, role, status FROM karbar WHERE id = ? AND email = ?",
      [req.karbarId, req.email]
    )
    const karbar = rows[0]

    if (!karbar) {
      return res.status(401).json({ message: "❌ کاربر معتبر نیست" })
    }

    // ذخیره کاربر در req برای استفاده در کنترلرها
    req.karbar = karbar

    next()
  } catch (err) {
    console.error("خطا در middlewareAuth:", err.message)
    return res.status(401).json({ message: "⚠️ توکن نامعتبر یا منقضی شده است" })
  }
}

module.exports = middlewareAuth
