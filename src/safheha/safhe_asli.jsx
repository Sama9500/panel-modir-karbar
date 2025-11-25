

import React from "react"
import { Link } from "react-router-dom"

export default function SafheAsli() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-8 drop-shadow-lg">نمونه کار حرفه‌ای</h1>
      <div className="flex space-x-6">
        <Link to="/vorood" className="dokme-gradient">ورود</Link>
        <Link to="/sabtenam" className="dokme-gradient">ثبت نام</Link>
      </div>
    </div>
  )
}
