import { useEffect, useRef, useState } from 'react'

const services = [
  {
    title: 'Local Travel City',
    href: '/services',
    icon: (
      <>
        <circle cx="6" cy="6" r="2" />
        <path d="M8 6h6a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7" />
        <path d="M18 16l2 2-2 2" />
      </>
    ),
  },
  {
    title: 'Outstation Travel',
    href: '/services',
    icon: (
      <>
        <circle cx="6" cy="6" r="2" />
        <path d="M8 6h6a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7" />
        <path d="M18 16l2 2-2 2" />
      </>
    ),
  },
  {
    title: 'Airport Pickup & Drop',
    href: '/services',
    icon: <path d="M21 3L3 10.5l7 3 3 7L21 3zM10 13.5L21 3" />,
  },
  {
    title: 'Family Travel',
    href: '/services',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  },
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
  'transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none'

// Neeche se upar fade
const revealUp = (on) => `${base} ${on ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`

// Image: mobile pe neeche se, laptop pe left se slide
const revealLeft = (on) =>
  `${base} ${
    on
      ? 'translate-x-0 translate-y-0 opacity-100'
      : 'translate-y-8 opacity-0 lg:translate-y-0 lg:-translate-x-10'
  }`

// Badge: chhota se bada hokar aata hai
const revealPop = (on) => `${base} ${on ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`

function ArrowRight({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function Services() {
  const [imgRef, imgIn] = useInView()
  const [textRef, textIn] = useInView()

  // Delay sirf bahar ke reveal wrappers pe lagta hai, hover wale elements pe nahi.
  const delay = (ms) => ({ transitionDelay: textIn ? `${ms}ms` : '0ms' })

  return (
    <section className="overflow-x-clip bg-white font-[Poppins,sans-serif] text-black">
      <div className="container-x py-12 sm:py-14 lg:py-16">
        <div className="grid items-stretch gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          {/* ---------- Image + badge ---------- */}
          <div
            ref={imgRef}
            className={`relative mx-auto h-full w-full max-w-[550px] lg:mx-0 ${revealLeft(imgIn)}`}
          >
            {/* Image: hover pe halka zoom */}
            <div className="group h-full overflow-hidden rounded-md">
              <img
                src="/Mask group.png"
                alt="Mountain road on a Lucky Travels route"
                loading="lazy"
                className="h-full min-h-[320px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 sm:min-h-[420px] lg:min-h-full"
              />
            </div>

            {/* Badge: bahar wala div pop-in karta hai, andar wala hover pe uthta hai */}
            <div
              className={`absolute -bottom-3 right-3 origin-bottom-right lg:-right-6 lg:bottom-15 ${revealPop(imgIn)}`}
              style={{ transitionDelay: imgIn ? '500ms' : '0ms' }}
            >
              <div className="rounded-xl bg-[#e3252d] px-3 py-2.5 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:px-4 sm:py-3 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <p className="text-sm sm:text-[18px]">From Bharuch</p>
                <p className="text-xs font-semibold sm:text-[15px]">To Every Destination</p>
              </div>
            </div>
          </div>

          {/* ---------- Text + service links ---------- */}
          <div ref={textRef} className="flex h-full flex-col justify-between py-2 lg:py-4">
            <p
              className={`text-base font-medium uppercase text-[#e3252d] sm:text-xl ${revealUp(textIn)}`}
              style={delay(0)}
            >
              Travel, your way
            </p>

            <h2
              className={`mt-3 text-[28px] font-bold leading-snug sm:text-4xl lg:text-5xl lg:leading-[1.3] xl:text-[60px] ${revealUp(textIn)}`}
              style={delay(100)}
            >
              Service for every road ahead
            </h2>

            <p
              className={`mt-4 max-w-[650px] text-sm leading-relaxed sm:text-base ${revealUp(textIn)}`}
              style={delay(200)}
            >
              From an airport run to a family holiday, we make travel simple, comfortable and
              dependable.
            </p>

            {/* gap-px + coloured bg = patli red dividers */}
            <div
              className={`mt-6 grid flex-1 gap-px overflow-hidden rounded-lg border border-[#e3252d] bg-[#e3252d] sm:mt-8 sm:grid-cols-2 sm:grid-rows-2 ${revealUp(textIn)}`}
              style={delay(300)}
            >
              {services.map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  className="group relative flex h-full items-center justify-between gap-3 overflow-hidden bg-white px-4 py-5 transition-colors duration-300 hover:bg-[#fff5f5] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e3252d] sm:px-5 sm:py-6
                             after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:origin-top after:scale-y-0 after:bg-[#e3252d] after:content-['']
                             after:transition-transform after:duration-300 after:ease-out hover:after:scale-y-100 motion-reduce:after:transition-none"
                >
                  <span className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <svg
                      className="h-7 w-7 shrink-0 text-[#e3252d] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none sm:h-8 sm:w-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {s.icon}
                    </svg>
                    <span className="min-w-0">
                      <span className="block text-base font-medium transition-colors duration-300 group-hover:text-[#e3252d] sm:text-lg xl:text-xl">
                        {s.title}
                      </span>
                      <span className="mt-1 block text-sm text-black/60 sm:text-[16px]">Learn More</span>
                    </span>
                  </span>
                  <ArrowRight className="h-6 w-6 shrink-0 text-[#e3252d] transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none sm:h-7 sm:w-7" />
                </a>
              ))}
            </div>

            <div className={`mt-6 ${revealUp(textIn)}`} style={delay(400)}>
              <a
                href="/services"
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#e3252d] px-6 py-3 text-base font-medium text-[#e3252d]
                           transition duration-200 hover:-translate-y-0.5 hover:bg-[#e3252d] hover:text-white hover:shadow-lg hover:shadow-[#e3252d]/40 active:translate-y-0 active:scale-[0.98]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3252d]
                           motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-55 sm:py-3.5 sm:text-lg"
              >
                View All Service
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}