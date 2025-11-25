
// routes/route_modir.js
const express = require("express")
const { voroodModir, taghirRole, taghirVaziyat } = require("../controllers/controller_modir")
const middlewareAuth = require("../middlewares/middleware_auth")   // بررسی JWT
const middlewareAdmin = require("../middlewares/middleware_admin") // بررسی نقش مدیر

const router = express.Router()

/**
 * ورود مدیر
 * POST /api/modir/login
 */
router.post("/login", async (req, res) => {
  try {
    await voroodModir(req, res)
  } catch (err) {
    console.error("❌ خطا در route_modir/login:", err.message || err)
    return res.status(500).json({
      message: "⚠️ خطای داخلی سرور در ورود مدیر"
    })
  }
})

/**
 * تغییر نقش کاربر
 * PUT /api/modir/taghir-role
 */
router.put("/taghir-role", middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    await taghirRole(req, res)
  } catch (err) {
    console.error("❌ خطا در route_modir/taghir-role:", err.message || err)
    return res.status(500).json({
      message: "⚠️ خطای داخلی سرور در تغییر نقش"
    })
  }
})

/**
 * تغییر وضعیت کاربر
 * PUT /api/modir/taghir-vaziyat
 */
router.put("/taghir-vaziyat", middlewareAuth, middlewareAdmin, async (req, res) => {
  try {
    await taghirVaziyat(req, res)
  } catch (err) {
    console.error("❌ خطا در route_modir/taghir-vaziyat:", err.message || err)
    return res.status(500).json({
      message: "⚠️ خطای داخلی سرور در تغییر وضعیت"
    })
  }
})

module.exports = router