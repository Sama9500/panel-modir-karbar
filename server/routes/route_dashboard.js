
// routes/route_dashboard.js
const express = require("express")
const { daryaftEtelaatDashboard } = require("../controllers/controller_dashboard")
const middlewareAuth = require("../middlewares/middleware_auth") // بررسی JWT

const router = express.Router()

/**
 * مسیر داشبورد
 * GET /api/dashboard
 * دریافت اطلاعات داشبورد کاربر (نیاز به JWT معتبر)
 */
router.get("/", middlewareAuth, async (req, res) => {
  try {
    // اجرای کنترلر داشبورد
    await daryaftEtelaatDashboard(req, res)
  } catch (err) {
    console.error("❌ خطا در route_dashboard:", err.message || err)
    return res.status(500).json({
      message: "⚠️ خطای داخلی سرور در داشبورد"
    })
  }
})

module.exports = router