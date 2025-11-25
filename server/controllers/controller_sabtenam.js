
// controller_sabtenam.js
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mysql = require("mysql2/promise")
require("dotenv").config()

// اتصال پایدار به دیتابیس با استفاده از Pool
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

async function sabtenamKarbar(req, res) {
  try {
    const { email, ramzOboor } = req.body

    // بررسی ورودی‌ها مطابق ستون‌های موجود در جدول karbar
    if (!email || !ramzOboor) {
      return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است" })
    }

    if (ramzOboor.length < 6) {
      return res.status(400).json({ message: "رمز عبور باید حداقل 6 کاراکتر باشد" })
    }

    const db = await rahandaziDb()

    // بررسی وجود کاربر با ایمیل یکتا
    const [vojod] = await db.query("SELECT id FROM karbar WHERE email = ?", [email])
    if (vojod.length > 0) {
      return res.status(409).json({ message: "این ایمیل قبلاً ثبت شده است" })
    }

    // هش کردن رمز عبور
    const ramzHashed = await bcrypt.hash(ramzOboor, 10)

    // ذخیره کاربر جدید مطابق ستون‌های جدول (name و password در جدول فعلی وجود ندارند)
    const [natije] = await db.query(
      "INSERT INTO karbar (email, ramzHashed, role, status) VALUES (?, ?, ?, ?)",
      [email, ramzHashed, "user", "active"]
    )

    // گرفتن اطلاعات کاربر ذخیره‌شده
    const [jadidRows] = await db.query("SELECT id, email, role, status FROM karbar WHERE id = ?", [natije.insertId])
    const jadid = jadidRows[0]

    // ساخت توکن JWT
    const token = jwt.sign(
      { id: jadid.id, email: jadid.email, role: jadid.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    return res.status(201).json({
      message: "ثبت‌نام با موفقیت انجام شد",
      token,
      karbar: {
        id: jadid.id,
        email: jadid.email,
        role: jadid.role,
        status: jadid.status
      }
    })
  } catch (err) {
    console.error("خطا در sabtenamKarbar:", err.message)
    return res.status(500).json({ message: "خطای داخلی سرور" })
  }
}

module.exports = { sabtenamKarbar, rahandaziDb }