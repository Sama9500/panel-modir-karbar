

import React from "react"

export default function KomponentLogo() {
  return (
    <div className="flex items-center space-x-3">
      {/* دایره رنگی به عنوان نماد لوگو */}
      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xl">S</span>
      </div>
      {/* متن برند پروژه */}
      <h1 className="text-2xl font-bold text-white">samaneh samavati</h1>
    </div>
  )
}
