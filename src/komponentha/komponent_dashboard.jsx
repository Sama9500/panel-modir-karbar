

import React, { useEffect, useState } from "react"
import { ersalPost, pakKonToken, gereftanToken } from "./komponent_api_helper"

export default function KomponentDashboard() {
  const [etelaatKarbar, setEtelaatKarbar] = useState(null)
  const [payamDashboard, setPayamDashboard] = useState("")
  const [darHaleLoad, setDarHaleLoad] = useState(true)

  const gereftanEtelaat = async () => {
    setPayamDashboard("")
    try {
      // مسیر درست: /api/dashboard
      const natije = await ersalPost("/api/dashboard", {}, true)
      if (!natije.ok) {
        const payamServer = natije.data?.message || "خطا در دریافت اطلاعات"
        setPayamDashboard(payamServer)
      } else {
        setEtelaatKarbar(natije.data?.karbar || null)
      }
    } catch {
      setPayamDashboard("ارتباط با سرور مشکل دارد")
    } finally {
      setDarHaleLoad(false)
    }
  }

  useEffect(() => {
    const token = gereftanToken()
    if (!token) {
      window.location.href = "/vorood"
      return
    }
    gereftanEtelaat()
  }, [])

  const khorooj = () => {
    pakKonToken()
    window.location.href = "/vorood"
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-cyan-400">داشبورد کاربر</h2>
        <button onClick={khorooj} className="dokme-gradient">خروج</button>
      </div>

      {darHaleLoad && <div className="kart-ziba text-center">در حال لود...</div>}

      {payamDashboard && <div className="kart-ziba text-red-400">{payamDashboard}</div>}

      {etelaatKarbar && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="kart-ziba">
            <h3 className="text-xl font-bold mb-2 text-purple-400">پروفایل</h3>
            <p>email: {etelaatKarbar.email}</p>
            <p>role: {etelaatKarbar.role}</p>
          </div>

          <div className="kart-ziba">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">تنظیمات</h3>
            <p>تنظیمات به زودی به اینجا اضافه می‌شود</p>
          </div>

          <div className="kart-ziba">
            <h3 className="text-xl font-bold mb-2 text-purple-400">فعالیت‌ها</h3>
            <p>لیست فعالیت‌ها</p>
          </div>
        </div>
      )}
    </div>
  )
}
