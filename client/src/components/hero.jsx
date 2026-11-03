import { useEffect, useRef, useState } from 'react'

// Hero background images: public/ folder me rakho
const slides = [
  { src: '/Hero Camry.png', alt: 'Camry at sunset' },
  { src: '/Hero Ertiga.png', alt: 'Ertiga at sunset' },
  { src: '/Hero Innova.png', alt: 'Innova at sunset' },
  { src: '/Hero Urbania.png', alt: 'Urbania at sunset' },
]

const WHATSAPP_URL = 'https://wa.me/918866777110' // apna sahi number daalo

// Slide kitne ms baad badle
const SLIDE_INTERVAL = 5000

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

const revealLeft = (on) =>
  `${base} ${on ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`

/* ---------- button styles (hover effects yahin hain) ---------- */
// Red button: hover pe gehra red + thoda upar uthta hai + glow shadow + shine sweep, click pe dab jata hai
const btnPrimary =
  'group relative overflow-hidden inline-flex items-center justify-center gap-2.5 rounded-md bg-[#e3252d] px-5 py-3 text-base font-semibold text-white ' +
  'transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#c81f26] hover:shadow-lg hover:shadow-[#e3252d]/40 ' +
  'active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:py-3.5 sm:text-lg'

// White button: hover pe red fill ho jata hai aur text white
const btnSecondary =
  'group relative overflow-hidden inline-flex items-center justify-center gap-2.5 rounded-md border border-[#e3252d] bg-white px-5 py-3 text-base font-semibold text-[#e3252d] ' +
  'transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#e3252d] hover:text-white hover:shadow-lg hover:shadow-[#e3252d]/40 ' +
  'active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:py-3.5 sm:text-lg'

/* ---------- icons (inline SVG, koi library nahi chahiye) ---------- */
const svgProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// Button ke andar hover pe chamak (shine) nikalta hai (parent me `group relative overflow-hidden` chahiye)
const Shine = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/35 transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:hidden"
  />
)

// Arrow button hover pe thoda aage slide karta hai (parent me `group` chahiye)
const ArrowRight = ({ className = 'h-5 w-5' }) => (
  <svg
    className={`${className} transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none`}
    viewBox="0 0 24 24"
    {...svgProps}
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)
const ShieldCheck = () => (
  <svg className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" viewBox="0 0 24 24" {...svgProps}>
    <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </svg>
)
const Clock = () => (
  <svg className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" viewBox="0 0 24 24" {...svgProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
const Pin = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svgProps}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)
const Calendar = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svgProps}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)
const Phone = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...svgProps}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
)

/* ---------- booking bar field ---------- */
// Reveal wrapper alag, hover andar (delay hover ko slow na kare)
function Field({ icon, label, children, show, delay = 0 }) {
  return (
    <div className={revealUp(show)} style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}>
      <label className="group/field flex min-w-0 items-center gap-3 xl:border-l-2 xl:border-[#e3252d] xl:pl-4">
        {/* Icon: hover / focus pe red fill + thoda bada */}
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#fde8e9] text-[#e3252d] transition duration-300 group-hover/field:scale-110 group-hover/field:bg-[#e3252d] group-hover/field:text-white group-focus-within/field:scale-110 group-focus-within/field:bg-[#e3252d] group-focus-within/field:text-white motion-reduce:transition-none">
          {icon}
        </span>

        {/* Label and input */}
        <span className="flex min-w-0 flex-1 flex-col justify-center">
          <span className="mb-1.5 block text-sm font-semibold leading-5 text-[#0f1b3d]">
            {label}
          </span>

          {children}
        </span>
      </label>
    </div>
  )
}

const inputClass =
  'h-9 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-xs text-[#0f1b3d] placeholder:text-gray-400 transition focus:border-[#e3252d] focus:outline-none focus:ring-1 focus:ring-[#e3252d] hover:border-gray-400'

export default function Hero() {
  const [active, setActive] = useState(0)

  // Hero: page khulte hi chalta hai
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Booking bar: screen me aate hi chalta hai
  const [barRef, barIn] = useInView()

  const heroDelay = (ms) => ({ transitionDelay: mounted ? `${ms}ms` : '0ms' })
  const barDelay = (ms) => ({ transitionDelay: barIn ? `${ms}ms` : '0ms' })

  // Slides auto-rotate (sirf tab jab 1 se zyada image ho)
  useEffect(() => {
    if (slides.length < 2) return
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), SLIDE_INTERVAL)
    return () => clearInterval(id)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const msg =
      `Hi Lucky Travels, I want to book a ride.\n` +
      `Pickup: ${data.pickup}\nDestination: ${data.destination}\n` +
      `Date: ${data.date}\nPhone: ${data.phone}`
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(msg)}`, '_blank', 'noreferrer')
  }

  return (
    <section className="overflow-x-clip bg-white font-[Inter,sans-serif] text-white">
      {/* ---------- Hero image area ---------- */}
      <div className="relative isolate min-h-[700px] overflow-hidden bg-[#0b0d12] md:min-h-[680px] lg:min-h-[700px] xl:min-h-[740px] 2xl:min-h-[820px]">
        {/* Background: load hote hi halka zoom-out hokar settle hoti hai */}
        <div
          className={`absolute inset-0 -z-20 transition-transform duration-[2500ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
            mounted ? 'scale-100' : 'scale-110'
          }`}
        >
          {slides.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.alt}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                i === active ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* dark shade: mobile pe poora halka dark (text padhne ke liye), tablet/desktop pe left se fade */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-black/55 md:bg-[linear-gradient(to_right,#0b0d12_0%,#0b0d12_20%,rgba(11,13,18,0.6)_38%,rgba(11,13,18,0.2)_52%,transparent_64%)] lg:bg-[linear-gradient(to_right,#0b0d12_0%,#0b0d12_20%,rgba(11,13,18,0.6)_35%,rgba(11,13,18,0.2)_48%,transparent_60%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden h-1/3 bg-gradient-to-t from-black/25 to-transparent md:block" />

        {/* white swoosh, bottom-left (Figma jaisa) - left se slide-in */}
        <svg
          className={`absolute bottom-0 left-0 -z-10 hidden h-24 w-[420px] text-white md:block ${revealLeft(mounted)}`}
          style={heroDelay(500)}
          viewBox="0 0 420 96"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 96V0c90 58 220 90 420 96H0z" fill="currentColor" />
        </svg>

        {/* slide dots (clickable) - sirf md+ pe. Reveal wrapper alag, hover andar */}
        <div
          className={`absolute bottom-32 right-6 z-10 hidden md:block xl:right-20 ${revealUp(mounted)}`}
          style={heroDelay(1300)}
        >
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none ${
                  i === active ? 'w-8 bg-[#e3252d]' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* content */}
        <div className="container-x relative z-10 pb-8 pt-7 sm:pt-8 md:min-h-[680px] md:pb-36 md:pt-10 lg:min-h-[700px] lg:pb-44 lg:pt-12 xl:min-h-[740px] 2xl:min-h-[820px]">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
            {/* red line: left se grow hoti hai */}
            <span
              className={`h-[5px] w-10 shrink-0 origin-left rounded bg-[#e3252d] transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none sm:w-14 lg:w-[84px] ${
                mounted ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={heroDelay(100)}
            />
            <p
              className={`text-xs uppercase tracking-wide sm:text-base lg:text-xl ${revealUp(mounted)}`}
              style={heroDelay(250)}
            >
              Bharuch’s dependable travel partner
            </p>
          </div>

          <h1 className="mt-8 text-[36px] font-bold leading-[1.15] min-[400px]:text-[42px] sm:mt-10 sm:text-6xl lg:mt-14 lg:text-[64px] xl:mt-16 xl:text-[80px]">
            <span className={`block ${revealUp(mounted)}`} style={heroDelay(400)}>
              Every <span className="italic">Journey</span>
            </span>
            <span className={`block ${revealUp(mounted)}`} style={heroDelay(580)}>
              Begins with{' '}
              <span className="relative inline-block italic text-[#e3252d]">
                Trust.
                {/* underline: left se draw hoti hai */}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded bg-[#e3252d] transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
                    mounted ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={heroDelay(1200)}
                />
              </span>
            </span>
          </h1>

          <p
            className={`mt-6 text-lg font-semibold sm:mt-8 sm:text-2xl lg:mt-12 xl:mt-16 xl:text-[28px] ${revealUp(mounted)}`}
            style={heroDelay(800)}
          >
            Your Trusted Travel Partner in Bharuch
          </p>

          {/* Buttons: reveal wrapper alag, hover andar (delay hover ko slow na kare) */}
          <div className={`mt-8 lg:mt-12 ${revealUp(mounted)}`} style={heroDelay(950)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a href="/contact" className={`${btnPrimary} w-full sm:w-auto`}>
                <Shine />
                Book Your Ride
                <ArrowRight />
              </a>
              <a href="/cars" className={`${btnSecondary} w-full sm:w-auto`}>
                <Shine />
                Explore Our Cars
                <ArrowRight />
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-base font-semibold sm:text-lg lg:mt-12">
            <span className={`inline-flex items-center gap-3 ${revealUp(mounted)}`} style={heroDelay(1100)}>
              <ShieldCheck />
              Safety first
            </span>
            <span className="hidden h-7 w-px bg-white sm:block" aria-hidden="true" />
            <span className={`inline-flex items-center gap-3 ${revealUp(mounted)}`} style={heroDelay(1250)}>
              <Clock />
              Timely service
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Booking bar: screen me aate hi neeche se upar ---------- */}
      <div ref={barRef} className="container-x relative z-20 -mt-25 py-6 sm:py-8">
        <div className={revealUp(barIn)} style={barDelay(0)}>
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:gap-5 sm:p-5 xl:grid-cols-[auto_1fr_auto] xl:items-center xl:gap-6 xl:p-6"
          >
            <div className={`border-l-2 border-[#e3252d] pl-4 sm:pl-5 ${revealUp(barIn)}`} style={barDelay(200)}>
              <h2 className="text-xl font-semibold leading-tight text-[#0f1b3d] sm:text-2xl">
                Plan Your
                <br className="hidden xl:block" /> Journey
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5">
              <Field icon={<Pin />} label="Pickup Location" show={barIn} delay={300}>
                <input name="pickup" required type="text" placeholder="Enter pickup location" className={inputClass} />
              </Field>
              <Field icon={<Pin />} label="Destination" show={barIn} delay={400}>
                <input name="destination" required type="text" placeholder="Enter Destination" className={inputClass} />
              </Field>
              <Field icon={<Calendar />} label="Travel Date" show={barIn} delay={500}>
                <input name="date" required type="date" className={inputClass} />
              </Field>
              <Field icon={<Phone />} label="Phone Number" show={barIn} delay={600}>
                <input name="phone" required type="tel" inputMode="tel" placeholder="Enter P.No" className={inputClass} />
              </Field>
            </div>

            <div className={revealUp(barIn)} style={barDelay(700)}>
              <button type="submit" className={`${btnPrimary} w-full xl:w-auto`}>
                <Shine />
                Book Now
                <ArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}