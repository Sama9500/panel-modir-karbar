
// middleware_admin.js
const rahandaziDb = require("../config/db")

async function middlewareAdmin(req, res, next) {
  try {
    const db = await rahandaziDb()
    // بررسی کاربر در جدول karbar
    const [rows] = await db.query("SELECT id, email, role, status FROM karbar WHERE id = ?", [req.karbarId])
    const karbar = rows[0]

    if (!karbar) {
      return res.status(403).json({ message: "❌ کاربر یافت نشد" })
    }

    if (karbar.role !== "admin") {
      return res.status(403).json({ message: "⚠️ دسترسی غیر مجاز است" })
    }

    // ذخیره کاربر در req برای استفاده در کنترلرها
    req.karbar = karbar
    next()
  } catch (err) {
    console.error("خطا در middlewareAdmin:", err.message)
    return res.status(500).json({ message: "⚠️ خطا در بررسی نقش کاربر" })
  }
}

module.exports = middlewareAdmin