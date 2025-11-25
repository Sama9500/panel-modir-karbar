
// src/App.jsx
import React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink } from "react-router-dom"

// safheha
import SafheAsli from "./safheha/safhe_asli.jsx"

// komponentha
import KomponentVorood from "./komponentha/komponent_vorood.jsx"
import KomponentSabtenam from "./komponentha/komponent_sabtenam.jsx"
import KomponentDashboard from "./komponentha/komponent_dashboard.jsx"
import KomponentModir from "./komponentha/komponent_modir.jsx"
import KomponentLogo from "./komponentha/komponent_logo.jsx"
import KomponentAx from "./komponentha/komponent_ax.jsx"
import KomponentZakhire from "./komponentha/komponent_zakhire.jsx"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="p-4 bg-gray-800 shadow-lg flex items-center justify-between sticky top-0 z-50">
          <KomponentLogo />
          <nav className="flex gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `dokme-gradient text-sm ${isActive ? "ring-2 ring-pink-400" : ""}`
              }
              end
            >
              خانه
            </NavLink>
            <NavLink
              to="/vorood"
              className={({ isActive }) =>
                `dokme-gradient text-sm ${isActive ? "ring-2 ring-pink-400" : ""}`
              }
            >
              ورود
            </NavLink>
            <NavLink
              to="/sabtenam"
              className={({ isActive }) =>
                `dokme-gradient text-sm ${isActive ? "ring-2 ring-pink-400" : ""}`
              }
            >
              ثبت‌نام
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `dokme-gradient text-sm ${isActive ? "ring-2 ring-pink-400" : ""}`
              }
            >
              داشبورد
            </NavLink>
            <NavLink
              to="/modir"
              className={({ isActive }) =>
                `dokme-gradient text-sm ${isActive ? "ring-2 ring-pink-400" : ""}`
              }
            >
              پنل مدیر
            </NavLink>
          </nav>
        </header>

        <main className="flex-1 p-6 animate-fadeIn">
          <Routes>
            <Route path="/" element={<SafheAsli />} />
            <Route path="/vorood" element={<KomponentVorood />} />
            <Route path="/sabtenam" element={<KomponentSabtenam />} />
            <Route path="/dashboard" element={<KomponentDashboard />} />
            <Route path="/modir" element={<KomponentModir />} />
            <Route path="/ax" element={<KomponentAx />} />
            <Route path="/zakhire" element={<KomponentZakhire />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="p-6 bg-gray-800 text-center text-sm text-gray-400 border-t border-gray-700">
          <p className="mb-2">© 2025 samaneh project - همه حقوق محفوظ است</p>
          <p className="text-xs text-gray-500">ساخته شده توسط سمانه سماواتی</p>
        </footer>
      </div>
    </Router>
  )
}
