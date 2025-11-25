

import React, { useState } from "react"

export default function KomponentZakhire() {
  const [matn, setMatn] = useState("")
  const [natije, setNatije] = useState("")

  const sabmitMatn = (roydad) => {
    roydad.preventDefault()
    if (!matn.trim()) {
      setNatije("لطفا متن را وارد کنید")
      return
    }
    setNatije(`متن ذخیره شد: ${matn}`)
    setMatn("")
  }

  return (
    <div className="kart-ziba w-full max-w-md mx-auto">
      <form onSubmit={sabmitMatn} className="flex flex-col space-y-4">
        <textarea
          value={matn}
          onChange={(roydad) => setMatn(roydad.target.value)}
          placeholder="متن را بنویسید"
          className="input-ziba h-32 focus:ring-cyan-400"
        />
        <button type="submit" className="dokme-gradient">ذخیره</button>
      </form>
      {natije && (
        <p className="mt-4 text-cyan-400">{natije}</p>
      )}
    </div>
  )
}
