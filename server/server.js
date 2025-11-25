
// server.js
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const rahandaziDb = require("./config/db") // فایل اتصال MySQL (اصلاح شده)

// ایمپورت روترها
const routeVorood = require("./routes/route_vorood")
const routeSabtenam = require("./routes/route_sabtenam")
const routeDashboard = require("./routes/route_dashboard")
const routeModir = require("./routes/route_modir")

// بارگذاری تنظیمات .env
dotenv.config()

const app = express()

// میدل‌ورها
app.use(cors())
app.use(express.json())

// تست اتصال به دیتابیس MySQL
;(async () => {
  try {
    const ModelKarbar = await rahandaziDb()
    // یک تست ساده: گرفتن همه کاربران
    await ModelKarbar.findAll()
    console.log("✅ اتصال به دیتابیس برقرار شد و جدول karbar آماده است")
  } catch (err) {
    console.error("❌ خطا در اتصال به دیتابیس:", err.message)
  }
})()

// مسیر تست
app.get("/api", (req, res) => {
  res.json({ payam: "API faal ast" })
})

// مسیرهای اصلی بک‌اند
app.use("/api/vorood", routeVorood)
app.use("/api/sabtenam", routeSabtenam)
app.use("/api/dashboard", routeDashboard)
app.use("/api/modir", routeModir)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`🚀 Server dar port ${port} dar hal ejra ast`)
})
