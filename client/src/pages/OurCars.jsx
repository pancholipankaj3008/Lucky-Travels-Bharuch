import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'

/*
  Abhi static data hai. Backend connect karne ke baad bas `cars` ko API se
  aaye array se replace kar dena (same shape), <CarCard /> apne aap render karega.

  Images public/cars/ me rakho (ya apne path badal do).
*/
const fallbackCars = [
  {
    id: 1,
    name: 'Toyota Innova Crysta',
    image: '/Toyota Innova Crysta at Sunset 2.png',
    description: 'Spacious and comfortable for family journeys, group travel and outstation trips. (7, Seater)',
    seats: 7,
    passengers: 'Add capacity',
    luggage: 'Add luggage',
    seating: '(7,Seater)',
  },
  {
    id: 2,
    name: 'Suzuki Ertiga',
    image: '/Suzuki Ertiga at Golden Horizon 1.png',
    description: 'Spacious and comfortable for family journeys, group travel and outstation trips. (7, Seater)',
    seats: 7,
    passengers: 'Add capacity',
    luggage: 'Add luggage',
    seating: '(7,Seater)',
  },
  {
    id: 3,
    name: 'Suzuki Dzire',
    image: '/White Suzuki Dzire at Sunset 1.png',
    description: 'Comfortable and economical for city rides, airport transfers and small family trips. (5, Seater)',
    seats: 5,
    passengers: 'Add capacity',
    luggage: 'Add luggage',
    seating: '(5,Seater)',
  },
  {
    id: 4,
    name: 'Mahindra XUV700',
    image: '/XUV700 at Golden Hour.png',
    description: 'Premium comfort for family journeys, group travel and outstation trips. (7, Seater)',
    seats: 7,
    passengers: 'Add capacity',
    luggage: 'Add luggage',
    seating: '(7,Seater)',
  },
  {
    id: 5,
    name: 'Force Traveller',
    image: '/Force traveller 17 seter.png',
    description: 'Ideal for large groups, weddings, tours and outstation trips. (17, 22, 26 Seater)',
    seats: 17,
    passengers: 'Add capacity',
    luggage: 'Add luggage',
    seating: '(17,22,26 Seater)',
  },
]

// Filter chips. `match` batata hai kaun si gaadi us chip me aayegi.
const seatFilters = [
  { key: '5', label: '5 Seater', match: (s) => s === 5 },
  { key: '7', label: '7 Seater', match: (s) => s === 7 },
  { key: 'large', label: '17,22,26Seater', match: (s) => s >= 17 },
]

/* ---------- scroll reveal: element screen me aate hi ek baar animate hota hai ---------- */
function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}

const base =
  'transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none'

const revealUp = (on) =>
  `${base} ${on ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`

/* ---------- icons ---------- */
const svg = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}
const SearchIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" {...svg}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
)
const PersonIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" {...svg}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
  </svg>
)
const UsersIcon = () => (
  <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" {...svg}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M17.5 14.5c2.5 0 4 1.5 4 4" />
  </svg>
)
const LuggageIcon = () => (
  <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" {...svg}>
    <rect x="5" y="7" width="14" height="13" rx="2" />
    <path d="M9 7V4h6v3M9 11v5M15 11v5" />
  </svg>
)
const ArrowIcon = () => (
  <svg
    className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none"
    viewBox="0 0 24 24"
    {...svg}
    strokeWidth={2}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// Button ke andar hover pe chamak (shine) (parent me `group/btn relative overflow-hidden` chahiye)
const Shine = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-transform duration-700 ease-out group-hover/btn:translate-x-[450%] motion-reduce:hidden"
  />
)

/* ---------- single car card (dynamic data ke liye ready) ---------- */
function Spec({ icon, label, value }) {
  return (
    <div className="group/spec flex items-start gap-2.5">
      {/* Hover pe icon halka bada hota hai */}
      <span className="mt-1 text-[#e3252d] transition duration-300 group-hover/spec:scale-110 motion-reduce:transition-none sm:mt-1.5">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-base font-semibold text-black sm:text-[17px]">{label}</p>
        <p className="mt-0.5 text-[13px] text-[#8a6f74]">{value}</p>
      </div>
    </div>
  )
}

function CarCard({ car }) {
  const [ref, inView] = useInView()
  const d = (ms) => ({ transitionDelay: inView ? `${ms}ms` : '0ms' })

  const image = typeof car.image === 'string' ? car.image : car.image?.url
  const seats = Number(car.passengerCapacity ?? car.seats ?? 0)
  const seating = car.seating || `(${seats} Seater)`

  return (
    // Bahar wala div: scroll reveal. Andar wala article: hover (delay hover ko slow na kare)
    <div ref={ref} className={revealUp(inView)}>
      <article className="group grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] transition duration-300 ease-out hover:-translate-y-1 hover:border-[#e3252d]/40 hover:shadow-[0_18px_40px_rgba(229,37,42,0.18)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:grid-cols-2">
        {/* ---------- Image: zoom-out settle + hover zoom ---------- */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 md:aspect-auto md:min-h-[340px] lg:min-h-[400px]">
          <img
            src={image || '/AllHero.png'}
            alt={car.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
              inView ? 'scale-100 group-hover:scale-105' : 'scale-110'
            }`}
          />
          {/* Seating badge */}
          <span
            className={`absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#e3252d] shadow-md sm:left-4 sm:top-4 sm:text-xs ${revealUp(inView)}`}
            style={d(400)}
          >
            {seating.replace(/[()]/g, '').replace(',', ', ')}
          </span>
        </div>

        {/* ---------- Details (container query: card ki chaudai ke hisaab se layout) ---------- */}
        <div className="@container flex min-w-0 flex-col p-5 sm:p-6 lg:p-8">
          <p
            className={`text-sm font-bold uppercase tracking-wide text-black sm:text-base ${revealUp(inView)}`}
            style={d(150)}
          >
            Lucky Travels Fleet
          </p>

          <h3
            className={`mt-3 text-2xl font-semibold leading-tight text-[#e3252d] sm:text-3xl xl:text-4xl 2xl:text-[45px] ${revealUp(inView)}`}
            style={d(250)}
          >
            {car.name}.
          </h3>

          {/* red line: left se grow hoti hai */}
          <span
            aria-hidden="true"
            className={`mt-3 block h-1 w-12 origin-left rounded bg-[#e3252d] transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
              inView ? 'scale-x-100' : 'scale-x-0'
            }`}
            style={d(450)}
          />

          <p
            className={`mt-3 max-w-[500px] text-sm leading-relaxed text-black sm:text-base ${revealUp(inView)}`}
            style={d(350)}
          >
            {car.description}
          </p>

          <div
            className={`mt-5 grid grid-cols-1 gap-4 border-y border-gray-300 py-4 @md:grid-cols-3 @md:gap-3 ${revealUp(inView)}`}
            style={d(500)}
          >
            <Spec
              icon={<UsersIcon />}
              label="Passengers"
              value={car.passengerCapacity ? `${car.passengerCapacity} seats` : car.passengers}
            />
            <Spec
              icon={<LuggageIcon />}
              label="Luggage capacity"
              value={`${car.luggageCapacity ?? seats} items`}
            />
            <Spec icon={<UsersIcon />} label="Seating" value={seating} />
          </div>

          <div
            className={`mt-auto flex flex-col gap-3 pt-5 @sm:flex-row @sm:items-center @sm:justify-between ${revealUp(inView)}`}
            style={d(650)}
          >
            <p className="text-base font-semibold text-black sm:text-[18px]">Contact for pricing</p>
            <a
              href={`/contact?car=${encodeURIComponent(car.name)}`}
              className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#e3252d] px-6 py-2.5 text-base font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#c81f26] hover:shadow-lg hover:shadow-[#e3252d]/40 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3252d] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[18px]"
            >
              <Shine />
              Book this car
              <ArrowIcon />
            </a>
          </div>
        </div>
      </article>
    </div>
  )
}

export default function OurCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api
      .getCars()
      .then(({ cars: items }) => setCars(items || []))
      .catch(() => setCars(fallbackCars))
      .finally(() => setLoading(false))
  }, [])
  const [query, setQuery] = useState('')
  const [seatKey, setSeatKey] = useState(null)

  // Banner: page khulte hi chalta hai
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const [headRef, headIn] = useInView()
  const [filterRef, filterIn] = useInView()

  const heroDelay = (ms) => ({ transitionDelay: mounted ? `${ms}ms` : '0ms' })
  const headDelay = (ms) => ({ transitionDelay: headIn ? `${ms}ms` : '0ms' })
  const filterDelay = (ms) => ({ transitionDelay: filterIn ? `${ms}ms` : '0ms' })

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const chip = seatFilters.find((f) => f.key === seatKey)
    return cars.filter((c) => {
      const seating = c.seating || `${c.passengerCapacity ?? c.seats ?? ''} seater`
      const textOk = !q || c.name.toLowerCase().includes(q) || seating.toLowerCase().includes(q)
      const seatOk = !chip || chip.match(Number(c.passengerCapacity ?? c.seats ?? 0))
      return textOk && seatOk
    })
  }, [cars, query, seatKey])

  return (
    <main className="overflow-x-clip bg-white font-[Inter,sans-serif] text-black">
      {/* ---------- Page banner ---------- */}
      <section className="relative isolate flex min-h-[320px] items-center overflow-hidden bg-[#0f2347] text-white sm:min-h-[380px] lg:min-h-[440px]">
        {/* Background: load hote hi halka zoom-out hokar settle hoti hai */}
        <img
          src="/AllHero.png"
          alt=""
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[2500ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
            mounted ? 'scale-100' : 'scale-110'
          }`}
        />
        <div className="absolute inset-0 -z-10 bg-[#0b1d3d]/55" />

        <div className="container-x w-full py-12 sm:py-16 lg:py-0">
          <span
            className={`inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium uppercase text-[#e3252d] sm:px-5 sm:text-sm ${revealUp(mounted)}`}
            style={heroDelay(100)}
          >
            Our Cars
          </span>

          <h1
            className={`mt-5 text-3xl font-bold leading-tight min-[400px]:text-4xl sm:text-5xl lg:text-6xl xl:text-[65px] ${revealUp(mounted)}`}
            style={heroDelay(250)}
          >
            Choose Your Perfect Ride
          </h1>

          <p
            className={`mt-4 max-w-[600px] text-sm leading-relaxed sm:mt-5 sm:text-base ${revealUp(mounted)}`}
            style={heroDelay(400)}
          >
            Three thoughtfully selected vehicle options for city rides, family plans and longer journeys.
          </p>
        </div>
      </section>

      {/* ---------- Heading ---------- */}
      <section className="container-x pt-10 sm:pt-14 lg:pt-20">
        <div ref={headRef} className="text-center">
          <p
            className={`text-lg font-bold text-[#e3252d] sm:text-2xl ${revealUp(headIn)}`}
            style={headDelay(0)}
          >
            Choose your car
          </p>

          {/* Eyebrow ke neeche red line beech se dono taraf failti hai */}
          <span
            aria-hidden="true"
            className={`mx-auto mt-3 block h-1 w-16 origin-center rounded bg-[#e3252d] transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
              headIn ? 'scale-x-100' : 'scale-x-0'
            }`}
            style={headDelay(250)}
          />

          <h2
            className={`mt-4 text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl xl:text-[55px] ${revealUp(headIn)}`}
            style={headDelay(150)}
          >
            Find your fit for the journey
          </h2>

          <p
            className={`mx-auto mt-4 max-w-[800px] text-sm leading-relaxed text-[#8a6f74] sm:mt-5 sm:text-base lg:text-[17px] ${revealUp(headIn)}`}
            style={headDelay(300)}
          >
            Passenger and luggage details remain editable until confirmed by the business owner.
            Contact us for current pricing and suitability.
          </p>
        </div>

        {/* ---------- Search + seat filters ---------- */}
        <div ref={filterRef} className="mt-8 flex flex-col gap-4 sm:mt-10 lg:mt-12 lg:flex-row">
          <div className={`lg:flex-1 ${revealUp(filterIn)}`} style={filterDelay(0)}>
            <label className="flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-[#e3252d] shadow-[0_4px_18px_rgba(0,0,0,0.1)] transition duration-200 focus-within:shadow-[0_6px_22px_rgba(229,37,42,0.25)] focus-within:ring-2 focus-within:ring-[#e3252d]/50 hover:shadow-[0_6px_22px_rgba(0,0,0,0.14)] motion-reduce:transition-none">
              <SearchIcon />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search car name or seating capacity..."
                className="w-full min-w-0 bg-transparent text-sm text-black placeholder:text-[#8a6f74] focus:outline-none sm:text-base"
              />
            </label>
          </div>

          <div className={revealUp(filterIn)} style={filterDelay(150)}>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {seatFilters.map((f) => {
                const on = seatKey === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setSeatKey(on ? null : f.key)}
                    aria-pressed={on}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm shadow-[0_4px_18px_rgba(0,0,0,0.1)] transition duration-200 ease-out hover:-translate-y-0.5 active:scale-95 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-none sm:gap-3 sm:px-7 sm:py-4 sm:text-base ${
                      on ? 'bg-[#e3252d] text-white' : 'bg-white text-[#e3252d] hover:bg-[#fde8e9]'
                    }`}
                  >
                    <PersonIcon />
                    <span className={on ? 'text-white' : 'text-[#6b5559]'}>{f.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Car list ---------- */}
      <section className="container-x py-8 sm:py-10 lg:py-12">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-[#8a6f74]">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#fde8e9] border-t-[#e3252d] motion-reduce:animate-none" />
            Loading cars…
          </div>
        ) : visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#8a6f74]">
            Koi car nahi mili. Search ya filter badal ke dekho.
          </p>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {visible.map((car) => (
              <CarCard key={car._id || car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}