

import React, { useState } from "react"

export default function KomponentAx() {
  const [ax, setAx] = useState(null)

  const handleAx = (roydad) => {
    const file = roydad.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAx(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="kart-ziba flex flex-col items-center space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleAx}
        className="text-sm text-gray-400"
      />
      {ax && (
        <img
          src={ax}
          alt="عکس کاربر"
          className="w-48 h-48 object-cover rounded-lg shadow-lg"
        />
      )}
    </div>
  )
}
