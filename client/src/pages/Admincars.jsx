// src/pages/admin/AdminCars.jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

const CATEGORY_SUGGESTIONS = ['Premium Car', 'Sedan', 'Hatchback', 'SUV', 'Tempo Traveller', 'Mini Bus']
const EMPTY = { name: '', category: '', passengerCapacity: '', luggageCapacity: '', description: '' }

const svg = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}
const UploadIcon = () => (
  <svg className="h-8 w-8" viewBox="0 0 24 24" {...svg}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
)
const PlusIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svg}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)
const LogoutIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...svg}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
)
const UsersIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...svg}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17.5 14.5c2.5 0 4 1.5 4 4" />
  </svg>
)

const fieldClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-[#0f1b3d] placeholder:text-gray-400 focus:border-[#e3252d] focus:outline-none focus:ring-1 focus:ring-[#e3252d]'

function Label({ children, hint }) {
  return (
    <span className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-[#0f1b3d]">
      {children}
      {hint && <span className="text-xs font-normal text-gray-500">{hint}</span>}
    </span>
  )
}

export default function AdminCars() {
  const navigate = useNavigate()
  const formRef = useRef(null)
  const fileRef = useRef(null)

  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState(null) // { type: 'success' | 'error', text }

  // ---- cars load ----
  useEffect(() => {
    api
      .getCars()
      .then((d) => setCars(d.cars || []))
      .catch((e) => setNotice({ type: 'error', text: e.message }))
      .finally(() => setLoading(false))
  }, [])

  // ---- file preview (memory leak se bachne ke liye revoke) ----
  // ---- notice auto-hide ----
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(t)
  }, [notice])

  useEffect(() => () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
  }, [preview])

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function resetForm() {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setForm(EMPTY)
    setFile(null)
    setPreview('')
    setEditingId(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function onPickFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setNotice({ type: 'error', text: 'Please choose an image file.' })
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setNotice({ type: 'error', text: 'Image must be under 5 MB.' })
      return
    }
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(f))
    setFile(f)
  }

  function startEdit(car) {
    setEditingId(car._id)
    setForm({
      name: car.name,
      category: car.category,
      passengerCapacity: String(car.passengerCapacity),
      luggageCapacity: String(car.luggageCapacity ?? car.passengerCapacity),
      description: car.description,
    })
    setFile(null)
    setPreview(car.image?.url || '')
    if (fileRef.current) fileRef.current.value = ''
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!editingId && !file) {
      setNotice({ type: 'error', text: 'Car image is required.' })
      return
    }

    const body = new FormData()
    body.append('name', form.name.trim())
    body.append('category', form.category.trim())
    body.append('passengerCapacity', form.passengerCapacity)
    body.append('luggageCapacity', form.luggageCapacity)
    body.append('description', form.description.trim())
    if (file) body.append('image', file) // multer field name: "image" (agar tumhara alag hai to yahan badlo)

    setSaving(true)
    try {
      if (editingId) {
        const d = await api.updateCar(editingId, body)
        setCars((list) => list.map((c) => (c._id === editingId ? d.car : c)))
        setNotice({ type: 'success', text: 'Car updated successfully.' })
      } else {
        const d = await api.addCar(body)
        setCars((list) => [d.car, ...list])
        setNotice({ type: 'success', text: 'Car added successfully.' })
      }
      resetForm()
    } catch (err) {
      if (err.status === 401) return navigate('/admin/login', { replace: true })
      setNotice({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(car) {
    if (!window.confirm(`Delete "${car.name}"? This cannot be undone.`)) return
    try {
      await api.deleteCar(car._id)
      setCars((list) => list.filter((c) => c._id !== car._id))
      if (editingId === car._id) resetForm()
      setNotice({ type: 'success', text: 'Car deleted.' })
    } catch (err) {
      if (err.status === 401) return navigate('/admin/login', { replace: true })
      setNotice({ type: 'error', text: err.message })
    }
  }

  async function handleLogout() {
    try {
      await api.logout()
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] font-[Inter,sans-serif] text-[#0f1b3d]">
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="container-x flex h-[68px] items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo.png" alt="Lucky Travels" className="h-10 w-auto" />
            <span className="hidden h-6 w-px bg-gray-300 sm:block" aria-hidden="true" />
            <span className="hidden text-sm font-semibold sm:block">Admin Panel</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-md border border-[#e3252d] px-4 py-2 text-sm font-semibold text-[#e3252d] transition hover:bg-[#e3252d] hover:text-white"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </header>

      <main className="container-x py-8 lg:py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#e3252d]">Fleet</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Manage your cars</h1>
        </div>

        {notice && (
          <p
            role="status"
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              notice.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-[#f3c5c8] bg-[#fde8e9] text-[#b3151c]'
            }`}
          >
            {notice.text}
          </p>
        )}

        {/* ---------- Add / Edit form ---------- */}
        <section
          ref={formRef}
          className="mt-8 scroll-mt-24 rounded-2xl bg-white p-5 shadow-[0_6px_24px_rgba(0,0,0,0.08)] sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{editingId ? 'Edit car' : 'Add a new car'}</h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-semibold text-[#e3252d] hover:underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* Image upload */}
            <div>
              <Label>Car image</Label>
              <label className="group relative grid aspect-[4/3] cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-[#f3c5c8] bg-[#fff8f8] text-[#e3252d] transition hover:border-[#e3252d]">
                {preview ? (
                  <>
                  <img src={preview} alt="Selected car preview" className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/55 py-2 text-center text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                      Click to change image
                    </span>
                  </>
                ) : (
                  <span className="flex flex-col items-center gap-2 px-4 text-center">
                    <UploadIcon />
                    <span className="text-sm font-semibold">Upload car image</span>
                    <span className="text-xs text-gray-500">JPG, PNG or WebP, up to 5 MB</span>
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickFile}
                  className="sr-only"
                />
              </label>
              {editingId && !file && (
                <p className="mt-2 text-xs text-gray-500">Nayi image na chuno to purani image hi rahegi.</p>
              )}
            </div>

            {/* Fields */}
            <div className="grid content-start gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <Label>Car name</Label>
                <input
                  required
                  value={form.name}
                  onChange={setField('name')}
                  placeholder="e.g. Toyota Innova Crysta"
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <Label>Category</Label>
                <input
                  required
                  list="car-categories"
                  value={form.category}
                  onChange={setField('category')}
                  placeholder="e.g. Premium Car"
                  className={fieldClass}
                />
                <datalist id="car-categories">
                  {CATEGORY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>

              <label className="block">
                <Label hint="seats">Passenger capacity</Label>
                <input
                  required
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={form.passengerCapacity}
                  onChange={setField('passengerCapacity')}
                  placeholder="e.g. 7"
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <Label hint="bags">Luggage capacity</Label>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={form.luggageCapacity}
                  onChange={setField('luggageCapacity')}
                  placeholder="e.g. 3"
                  className={fieldClass}
                />
              </label>

              <label className="block sm:col-span-2">
                <Label>Description</Label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={setField('description')}
                  placeholder="A spacious, premium MPV ideal for family trips, group travel and comfortable outstation journeys."
                  className={`${fieldClass} h-auto resize-y py-3 leading-relaxed`}
                />
              </label>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-[#e3252d] px-6 py-3.5 text-base font-semibold text-white transition hover:bg-[#c81f26] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingId ? 'Update car' : 'Add car'}
                  {!saving && !editingId && <PlusIcon />}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* ---------- Cars list ---------- */}
        <section className="mt-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">All cars</h2>
            {!loading && <p className="text-sm text-gray-500">{cars.length} total</p>}
          </div>

          {loading ? (
            <p className="py-16 text-center text-sm text-gray-500">Loading cars…</p>
          ) : cars.length === 0 ? (
            <p className="mt-6 rounded-2xl bg-white py-16 text-center text-sm text-gray-500 shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
              Abhi koi car nahi hai. Upar form se pehli car add karo.
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {cars.map((car) => (
                <article
                  key={car._id}
                  className={`overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.1)] ${
                    editingId === car._id ? 'ring-2 ring-[#e3252d]' : ''
                  }`}
                >
                  <img
                    src={car.image?.url}
                    alt={car.name}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{car.category}</p>
                    <h3 className="mt-2 text-lg font-semibold">{car.name}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#0f1b3d]/80">
                      {car.description}
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#fde8e9] px-3 py-1 text-xs font-semibold text-[#e3252d]">
                      <UsersIcon />
                      {car.passengerCapacity} passengers · {car.luggageCapacity ?? car.passengerCapacity} luggage capacity
                    </p>

                    <div className="mt-5 flex gap-3 border-t border-gray-200 pt-4">
                      <button
                        type="button"
                        onClick={() => startEdit(car)}
                        className="flex-1 rounded-md border border-[#e3252d] py-2 text-sm font-semibold text-[#e3252d] transition hover:bg-[#fde8e9]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(car)}
                        className="flex-1 rounded-md bg-[#e3252d] py-2 text-sm font-semibold text-white transition hover:bg-[#c81f26]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
