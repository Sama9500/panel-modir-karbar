
// routes/route_vorood.js
const express = require("express")
const { voroodKarbar } = require("../controllers/controller_vorood")

const router = express.Router()

/**
 * مسیر ورود کاربر
 * POST /api/vorood
 */
router.post("/", async (req, res) => {
  try {
    // اجرای تابع ورود از کنترلر
    await voroodKarbar(req, res)
  } catch (err) {
    console.error("❌ خطا در route_vorood:", err.message || err)
    return res.status(500).json({
      message: "⚠️ خطای داخلی سرور در ورود"
    })
  }
})

module.exports = router