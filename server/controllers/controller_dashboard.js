
// controller_dashboard.js
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

async function daryaftEtelaatDashboard(req, res) {
  try {
    const db = await rahandaziDb()

    // گرفتن اطلاعات کاربر از جدول karbar با id که در middlewareAuth ست شده
    const [rows] = await db.query(
      "SELECT id, email, role, status, created_at, updated_at FROM karbar WHERE id = ?",
      [req.karbarId]
    )
    const karbar = rows[0]

    if (!karbar) {
      return res.status(404).json({ message: "❌ کاربر یافت نشد" })
    }

    // فقط ستون‌های موجود و مورد نیاز رو برگردونیم
    const karbarInfo = {
      id: karbar.id,
      email: karbar.email,
      role: karbar.role,
      status: karbar.status,
      created_at: karbar.created_at,
      updated_at: karbar.updated_at
    }

    // فعالیت‌های نمونه (در آینده می‌تونی از جدول activity بیاری)
    const faaliyatHa = [
      { onvan: "✅ ورود به حساب", tarikh: new Date() },
      { onvan: "📊 مشاهده داشبورد", tarikh: new Date() }
    ]

    return res.status(200).json({ karbar: karbarInfo, faaliyatHa })
  } catch (err) {
    console.error("خطا در daryaftEtelaatDashboard:", err.message)
    return res.status(500).json({ message: "⚠️ خطای داخلی سرور" })
  }
}

module.exports = { daryaftEtelaatDashboard }