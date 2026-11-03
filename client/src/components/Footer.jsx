import { useEffect, useRef, useState } from 'react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Our Cars', href: '/cars' },
  { label: 'Contact Us', href: '/contact' },
]

const services = [
  'Local City Travel',
  'Outstation Trips',
  'Airport Transfers',
  'Family Travel',
]

const PHONE = '+88667 77110'
const WHATSAPP_URL = 'https://wa.me/918866777110'

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
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}

// Fade + slide-up. Reduced-motion wale users ko animation nahi dikhta.
const reveal = (on) =>
  `transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
    on ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
  }`

// Footer link: hover pe niche red line left se right stretch hoti hai (navbar jaisa)
const footerLink =
  "relative inline-block py-0.5 text-[14px] text-white/80 transition-colors duration-200 hover:text-white " +
  "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#e3252d] after:content-[''] " +
  "after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 motion-reduce:after:transition-none " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3252d]"

function ArrowRight({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function PhoneIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  )
}

export function CtaBanner() {
  const [ref, inView] = useInView()
  const delay = (ms) => ({ transitionDelay: inView ? `${ms}ms` : '0ms' })

  return (
    <section ref={ref} className="mt-5 overflow-x-clip bg-[#e3252d] font-[Inter,sans-serif] text-white">
      <div className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between md:gap-8 md:py-[65px]">
        <div>
          <p
            className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] sm:mb-5 sm:text-[16px] ${reveal(inView)}`}
            style={delay(0)}
          >
            Ready when you are
          </p>
          <h2
            className={`text-[28px] font-semibold leading-tight sm:text-[34px] lg:text-[38px] ${reveal(inView)}`}
            style={delay(100)}
          >
            Planning Your Next Trip?
          </h2>
          <p
            className={`mt-3 text-sm font-medium sm:mt-5 sm:text-[16px] ${reveal(inView)}`}
            style={delay(200)}
          >
            Let Lucky Travels help you get there comfortably.
          </p>
        </div>

        {/* Bahar wala div reveal karta hai, andar wala button hover (delay hover ko slow na kare) */}
        <div className={`shrink-0 ${reveal(inView)}`} style={delay(300)}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-base font-semibold text-[#14171d] shadow-sm
                       transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#14171d] hover:text-white hover:shadow-lg hover:shadow-black/30 active:translate-y-0 active:scale-[0.98]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                       motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto sm:text-[18px]"
          >
            Chat on WhatsApp
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Footer() {
  const [ref, inView] = useInView()
  // Har column thoda ruk ke aata hai (stagger)
  const delay = (i) => ({ transitionDelay: inView ? `${i * 120}ms` : '0ms' })

  return (
    <>
      <CtaBanner />

      <footer className="relative overflow-hidden bg-[#14171d] font-[Poppins,sans-serif] text-white">
        {/* Watermark */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-20 select-none whitespace-nowrap text-center text-[13vw] font-bold leading-none tracking-wide text-white/[0.04] sm:bottom-24 md:bottom-auto md:top-[52%] md:-translate-y-1/2 md:text-[110px]"
        >
          LUCKY TRAVEL
        </span>

        <div ref={ref} className="container-x relative pt-10 md:pt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            {/* Brand */}
            <div className={reveal(inView)} style={delay(0)}>
              <img src="/Footer Logo.png" alt="Lucky Travels Bharuch" className="h-12 w-auto sm:h-14" />
              <p className="mt-4 max-w-[270px] text-[13px] leading-relaxed text-white/70">
                Comfortable, dependable travel for Bharuch and beyond.
              </p>
              <a
                href={`tel:${PHONE.replace(/\s/g, '')}`}
                className="group mt-5 inline-flex items-center gap-2 text-[15px] font-semibold transition-colors duration-200 hover:text-[#e3252d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3252d]"
              >
                <PhoneIcon className="h-5 w-5 text-[#e3252d] transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none" />
                {PHONE}
              </a>
            </div>

            {/* Quick links */}
            <div className={reveal(inView)} style={delay(1)}>
              <h3 className="text-[15px] font-semibold uppercase tracking-wide">Quick Links</h3>
              <ul className="mt-4 space-y-3 sm:mt-5">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className={footerLink}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className={reveal(inView)} style={delay(2)}>
              <h3 className="text-[15px] font-semibold uppercase tracking-wide">Services</h3>
              <ul className="mt-4 space-y-3 sm:mt-5">
                {services.map((s) => (
                  <li key={s}>
                    <a href="/services" className={footerLink}>
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Find us */}
            <div className={reveal(inView)} style={delay(3)}>
              <h3 className="text-[15px] font-semibold uppercase tracking-wide">Find Us</h3>
              <p className="mt-4 text-[14px] text-white/80 sm:mt-5">Bharuch, Gujarat, India</p>
              <p className="mt-1 max-w-[220px] text-[14px] leading-snug text-white/80">
                Available for local and Outstation journeys.
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className={`mt-10 flex flex-col gap-2 border-t border-white/10 py-5 text-center text-[13px] sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:text-left ${reveal(inView)}`}
            style={delay(4)}
          >
            <p>© 2026 Lucky Travels Bharuch. All rights reserved.</p>
            <p>Travel comfortably. Arrive confidently.</p>
          </div>
        </div>
      </footer>
    </>
  )
}