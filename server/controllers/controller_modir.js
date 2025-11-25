
// controller_modir.js
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

// ورود مدیر
async function voroodModir(req, res) {
  try {
    const { ramz } = req.body
    const ramzSahih = process.env.ADMIN_SECRET

    if (!ramz) {
      return res.status(400).json({ message: "رمز مدیر الزامی است" })
    }

    if (ramz !== ramzSahih) {
      return res.status(401).json({ message: "رمز مدیر اشتباه است" })
    }

    const db = await rahandaziDb()
    // گرفتن لیست کاربران از جدول karbar
    const [karbaran] = await db.query("SELECT id, email, role, status, created_at FROM karbar")

    // ساخت توکن JWT مخصوص مدیر
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      message: "ورود مدیر موفق",
      token,
      users: karbaran // خروجی همچنان با کلید users برای هماهنگی با فرانت‌اند
    })
  } catch (err) {
    console.error("خطا در voroodModir:", err.message)
    return res.status(500).json({ message: "خطای داخلی سرور" })
  }
}

// تغییر نقش کاربر
async function taghirRole(req, res) {
  try {
    const { karbarId, roleJadid } = req.body
    const db = await rahandaziDb()

    const [rows] = await db.query("SELECT id FROM karbar WHERE id = ?", [karbarId])
    const karbar = rows[0]

    if (!karbar) {
      return res.status(404).json({ message: "کاربر یافت نشد" })
    }

    await db.query("UPDATE karbar SET role = ? WHERE id = ?", [roleJadid || "user", karbarId])
    return res.status(200).json({ message: "نقش کاربر تغییر کرد" })
  } catch (err) {
    console.error("خطا در taghirRole:", err.message)
    return res.status(500).json({ message: "خطای داخلی سرور" })
  }
}

// تغییر وضعیت کاربر
async function taghirVaziyat(req, res) {
  try {
    const { karbarId, vaziyatJadid } = req.body
    const db = await rahandaziDb()

    const [rows] = await db.query("SELECT id FROM karbar WHERE id = ?", [karbarId])
    const karbar = rows[0]

    if (!karbar) {
      return res.status(404).json({ message: "کاربر یافت نشد" })
    }

    await db.query("UPDATE karbar SET status = ? WHERE id = ?", [vaziyatJadid || "active", karbarId])
    return res.status(200).json({ message: "وضعیت کاربر تغییر کرد" })
  } catch (err) {
    console.error("خطا در taghirVaziyat:", err.message)
    return res.status(500).json({ message: "خطای داخلی سرور" })
  }
}

module.exports = { voroodModir, taghirRole, taghirVaziyat, rahandaziDb }