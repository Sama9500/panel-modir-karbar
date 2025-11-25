
import React, { useState } from "react"
import { ersalPost } from "./komponent_api_helper"

export default function KomponentVorood() {
  const [email, setEmail] = useState("")
  const [ramzOboor, setRamzOboor] = useState("")
  const [payamVorood, setPayamVorood] = useState("")
  const [darHaleErsaal, setDarHaleErsaal] = useState(false)

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const sabmitVorood = async (roydad) => {
    roydad.preventDefault()
    setPayamVorood("")

    if (!email || !ramzOboor) {
      setPayamVorood("لطفا همه فیلدها را پر کنید")
      return
    }

    if (!emailPattern.test(email)) {
      setPayamVorood("ایمیل نامعتبر است")
      return
    }

    if (ramzOboor.length < 6) {
      setPayamVorood("رمز عبور باید حداقل 6 کاراکتر باشد")
      return
    }

    try {
      setDarHaleErsaal(true)

      // مسیر درست: /api/vorood
      const natije = await ersalPost("/api/vorood", { email, ramzOboor })

      if (!natije.ok) {
        const payamServer = natije.data?.message || "خطا در ورود"
        setPayamVorood(payamServer)
        setDarHaleErsaal(false)
        return
      }

      localStorage.setItem("token", natije.data.token)
      setPayamVorood("ورود موفق")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 400)
    } catch {
      setPayamVorood("ارتباط با سرور مشکل دارد")
    } finally {
      setDarHaleErsaal(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-96 kart-ziba">
        <h2 className="text-3xl mb-6 text-cyan-400 text-center">ورود کاربر</h2>

        <form onSubmit={sabmitVorood} className="flex flex-col space-y-4">
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

          <button
            type="submit"
            disabled={darHaleErsaal}
            className={`dokme-gradient ${darHaleErsaal ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {darHaleErsaal ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        {payamVorood && (
          <p className="mt-4 text-center text-red-400">{payamVorood}</p>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          حساب نداری؟{" "}
          <a href="/sabtenam" className="text-cyan-400 hover:underline">
            ثبت نام
          </a>
        </div>
      </div>
    </div>
  )
}
