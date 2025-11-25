
import React, { useState } from "react"
import { ersalPost } from "./komponent_api_helper"

export default function KomponentModir() {
  const [ramzModir, setRamzModir] = useState("")
  const [listKarbaran, setListKarbaran] = useState([])
  const [payamModir, setPayamModir] = useState("")
  const [darHaleErsaal, setDarHaleErsaal] = useState(false)

  const voroodModir = async (roydad) => {
    roydad.preventDefault()
    setPayamModir("")

    if (!ramzModir) {
      setPayamModir("رمز خود را وارد کنید")
      return
    }

    try {
      setDarHaleErsaal(true)

      // مسیر درست: /api/modir/login یا /api/modir (بسته به تعریف در route_modir.js)
      const natije = await ersalPost("/api/modir", { ramz: ramzModir })

      if (!natije.ok) {
        const payamServer = natije.data?.message || "رمز اشتباه است"
        setPayamModir(payamServer)
        setDarHaleErsaal(false)
        return
      }

      setListKarbaran(natije.data?.users || [])
    } catch {
      setPayamModir("ارتباط با سرور مشکل دارد")
    } finally {
      setDarHaleErsaal(false)
    }
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h2 className="text-4xl font-bold mb-6 text-purple-400">پنل مدیر</h2>

      <form onSubmit={voroodModir} className="flex items-center space-x-3 mb-6">
        <input
          type="password"
          placeholder="رمز مدیر"
          value={ramzModir}
          onChange={(roydad) => setRamzModir(roydad.target.value)}
          className="input-ziba focus:ring-purple-500 w-64"
        />
        <button
          type="submit"
          disabled={darHaleErsaal}
          className={`dokme-gradient ${darHaleErsaal ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {darHaleErsaal ? "درحال ورود..." : "ورود مدیر"}
        </button>
      </form>

      {payamModir && <div className="kart-ziba text-red-400">{payamModir}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listKarbaran.map((u) => (
          <div key={u._id} className="kart-ziba">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{u.email}</p>
                <p className="text-sm text-gray-400">نقش: {u.role}</p>
                <p className="text-sm text-gray-400">وضعیت: {u.status || "active"}</p>
              </div>
              <div className="flex space-x-2">
                <button className="dokme-gradient">تغییر نقش</button>
                <button className="dokme-gradient">تغییر وضعیت</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
