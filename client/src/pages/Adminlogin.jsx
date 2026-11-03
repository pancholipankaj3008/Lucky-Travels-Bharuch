// src/pages/admin/AdminLogin.jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const svg = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const MailIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svg}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)
const LockIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svg}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
const EyeIcon = ({ off }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svg}>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M4 4l16 16" />}
  </svg>
)
const ArrowRight = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svg}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.login(email.trim(), password)
      navigate(location.state?.from || '/admin/cars', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-white font-[Inter,sans-serif] lg:grid-cols-2">
      {/* ---------- Left brand panel (hero jaisa dark) ---------- */}
      <section className="relative hidden overflow-hidden bg-[#0b0d12] text-white lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_90%,rgba(227,37,45,0.35),transparent_55%),linear-gradient(to_right,#0b0d12,#14171d)]"
          aria-hidden="true"
        />
        <img src="/Footer Logo.png" alt="Lucky Travels" className="relative h-14 w-auto self-start" />

        <div className="relative">
          <div className="flex items-center gap-4">
            <span className="h-[5px] w-16 bg-[#e3252d]" />
            <p className="text-sm uppercase tracking-wide">Admin panel</p>
          </div>
          <h1 className="mt-8 text-6xl font-bold leading-[1.15]">
            Every <span className="italic">Journey</span>
            <br />
            Begins with <span className="italic text-[#e3252d]">Trust.</span>
          </h1>
          <p className="mt-6 max-w-[360px] text-base text-white/70">
            Manage your fleet and keep Lucky Travels running smoothly.
          </p>
        </div>

        <p className="relative text-xs text-white/50">© 2026 Lucky Travels Bharuch</p>
      </section>

      {/* ---------- Form ---------- */}
      <section className="flex items-center justify-center bg-[#f6f7fb] px-4 py-12 sm:px-8">
        <div className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.1)] sm:p-10">
          <img src="/logo.png" alt="Lucky Travels" className="mb-6 h-12 w-auto lg:hidden" />

          <p className="text-xs font-semibold uppercase tracking-wide text-[#e3252d]">Admin login</p>
          <h2 className="mt-3 text-3xl font-bold text-[#0f1b3d]">Welcome back</h2>
          <p className="mt-2 text-sm text-[#0f1b3d]/70">Sign in to manage your cars.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#0f1b3d]">Email</span>
              <span className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3.5 text-[#e3252d] focus-within:border-[#e3252d] focus-within:ring-1 focus-within:ring-[#e3252d]">
                <MailIcon />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@luckytravels.com"
                  className="h-11 w-full bg-transparent text-sm text-[#0f1b3d] placeholder:text-gray-400 focus:outline-none"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-[#0f1b3d]">Password</span>
              <span className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-3.5 text-[#e3252d] focus-within:border-[#e3252d] focus-within:ring-1 focus-within:ring-[#e3252d]">
                <LockIcon />
                <input
                  type={show ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-11 w-full bg-transparent text-sm text-[#0f1b3d] placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="text-gray-500 hover:text-[#0f1b3d]"
                >
                  <EyeIcon off={show} />
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg border border-[#f3c5c8] bg-[#fde8e9] px-4 py-3 text-sm text-[#b3151c]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-md bg-[#e3252d] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#c81f26] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Login'}
              {!loading && <ArrowRight />}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
