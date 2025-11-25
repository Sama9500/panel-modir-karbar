
import React, { useState } from "react"
import { ersalPost } from "./komponent_api_helper"
import KomponentVorood from "./komponent_vorood.jsx"

export default function KomponentSabtenam() {
  const [email, setEmail] = useState("")
  const [ramzOboor, setRamzOboor] = useState("")
  const [ramzOboorTaeid, setRamzOboorTaeid] = useState("")
  const [payamSabtenam, setPayamSabtenam] = useState("")
  const [darHaleErsaal, setDarHaleErsaal] = useState(false)

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const sabmitSabtenam = async (roydad) => {
    roydad.preventDefault()
    setPayamSabtenam("")

    if (!email || !ramzOboor || !ramzOboorTaeid) {
      setPayamSabtenam("لطفا همه فیلدها را پر کنید")
      return
    }

    if (!emailPattern.test(email)) {
      setPayamSabtenam("ایمیل نامعتبر است")
      return
    }

    if (ramzOboor.length < 6) {
      setPayamSabtenam("رمز عبور باید حداقل 6 کاراکتر باشد")
      return
    }

    if (ramzOboor !== ramzOboorTaeid) {
      setPayamSabtenam("رمز عبور و تایید آن یکسان نیست")
      return
    }

    try {
      setDarHaleErsaal(true)

      // مسیر درست: /api/sabtenam
      const natije = await ersalPost("/api/sabtenam", { email, ramzOboor })

      if (!natije.ok) {
        const payamServer = natije.data?.message || "خطا در ثبت‌نام"
        setPayamSabtenam(payamServer)
        setDarHaleErsaal(false)
        return
      }

      localStorage.setItem("token", natije.data.token)
      setPayamSabtenam("ثبت‌نام موفق")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 400)
    } catch {
      setPayamSabtenam("ارتباط با سرور مشکل دارد")
    } finally {
      setDarHaleErsaal(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 kart-ziba">
        <h2 className="text-3xl mb-6 text-cyan-400 text-center">ثبت‌نام کاربر</h2>

        <form onSubmit={sabmitSabtenam} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(roydad) => setEmail(roydad.target.value)}
            className="input-ziba focus:ring-cyan-400"
          />

          <input
            type="password"
            placeholder="رمز عبور"
            value={ramzOboor}
            onChange={(roydad) => setRamzOboor(roydad.target.value)}
            className="input-ziba focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="تایید رمز عبور"
            value={ramzOboorTaeid}
            onChange={(roydad) => setRamzOboorTaeid(roydad.target.value)}
            className="input-ziba focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={darHaleErsaal}
            className={`dokme-gradient ${darHaleErsaal ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {darHaleErsaal ? "در حال ثبت‌نام..." : "ثبت‌نام"}
          </button>
        </form>

        {payamSabtenam && (
          <p className="mt-4 text-center text-red-400">{payamSabtenam}</p>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          حساب داری؟{" "}
          <a href="/vorood" className="text-cyan-400 hover:underline">
            ورود
          </a>
        </div>
      </div>
    </div>
  )
}
