
// routes/route_sabtenam.js
const express = require("express")
const { sabtenamKarbar } = require("../controllers/controller_sabtenam")

const router = express.Router()

/**
 * مسیر ثبت‌نام کاربر
 * POST /api/sabtenam
 */
router.post("/", async (req, res) => {
  try {
    // اجرای تابع ثبت‌نام از کنترلر
    await sabtenamKarbar(req, res)
  } catch (err) {
    console.error("❌ خطا در route_sabtenam:", err.message || err)
    return res.status(500).json({
      message: "⚠️ خطای داخلی سرور در ثبت‌نام"
    })
  }
})

module.exports = router