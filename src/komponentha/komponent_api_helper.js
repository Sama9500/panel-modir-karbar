
// پایه آدرس API
export const apiPaye = "https://panel.contentgen.ir"


// تابع کمکی برای اطمینان از داشتن پیشوند /api
function sakhtRah(url) {
  if (url.startsWith("/api")) return url
  return url.startsWith("/") ? `/api${url}` : `/api/${url}`
}

// ارسال درخواست POST
export async function ersalPost(url, badan = {}, niazToken = false) {
  const sarDaste = {
    "Content-Type": "application/json"
  }

  if (niazToken) {
    const token = localStorage.getItem("token")
    if (token) sarDaste.Authorization = `Bearer ${token}`
  }

  try {
    const rah = sakhtRah(url)
    const pasokh = await fetch(`${apiPaye}${rah}`, {
      method: "POST",
      headers: sarDaste,
      body: JSON.stringify(badan)
    })

    const data = await pasokh.json().catch(() => ({}))
    return { ok: pasokh.ok, status: pasokh.status, data }
  } catch (err) {
    return { ok: false, status: 0, data: { message: "ارتباط با سرور مشکل دارد" } }
  }
}

// ارسال درخواست GET
export async function ersalGet(url, niazToken = false) {
  const sarDaste = {}
  if (niazToken) {
    const token = localStorage.getItem("token")
    if (token) sarDaste.Authorization = `Bearer ${token}`
  }

  try {
    const rah = sakhtRah(url)
    const pasokh = await fetch(`${apiPaye}${rah}`, { headers: sarDaste })

    const data = await pasokh.json().catch(() => ({}))
    return { ok: pasokh.ok, status: pasokh.status, data }
  } catch {
    return { ok: false, status: 0, data: { message: "ارتباط با سرور مشکل دارد" } }
  }
}

// مدیریت توکن
export function pakKonToken() {
  localStorage.removeItem("token")
}

export function gereftanToken() {
  return localStorage.getItem("token")
}
