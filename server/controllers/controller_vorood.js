
// controller_vorood.js
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mysql = require("mysql2/promise")
require("dotenv").config()

// اتصال پایدار به دیتابیس (Pool واحد)
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

async function voroodKarbar(req, res) {
  try {
    const { email, ramzOboor } = req.body

    // بررسی ورودی‌ها
    if (!email || !ramzOboor) {
      return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است" })
    }

    const db = await rahandaziDb()

    // پیدا کردن کاربر با ایمیل از جدول karbar
    const [rows] = await db.query(
      "SELECT id, email, ramzHashed, role, status FROM karbar WHERE email = ?",
      [email]
    )
    const karbar = rows[0]

    if (!karbar) {
      return res.status(404).json({ message: "کاربر یافت نشد، لطفاً ثبت‌نام کنید" })
    }

    // اگر ستون status داری و کاربر غیرفعاله
    if (karbar.status && karbar.status !== "active") {
      return res.status(403).json({ message: "حساب کاربری غیرفعال است" })
    }

    // بررسی رمز عبور با ستون ramzHashed
    const sahih = await bcrypt.compare(ramzOboor, karbar.ramzHashed)
    if (!sahih) {
      return res.status(401).json({ message: "رمز عبور نادرست است" })
    }

    // ساخت توکن JWT
    const token = jwt.sign(
      { id: karbar.id, email: karbar.email, role: karbar.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    return res.status(200).json({
      message: "ورود موفق",
      token,
      karbar: {
        id: karbar.id,
        email: karbar.email,
        role: karbar.role,
        status: karbar.status || "active"
      }
    })
  } catch (err) {
    console.error("خطا در voroodKarbar:", err.message)
    return res.status(500).json({ message: "خطای داخلی سرور" })
  }
}

module.exports = { voroodKarbar, rahandaziDb }