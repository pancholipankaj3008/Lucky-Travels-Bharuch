import { useEffect, useRef, useState } from 'react'

const features = [
  {
    no: '01',
    title: 'Safe & Reliable Travel',
    text: 'Thoughtful service with your comfort and peace of mind at the centre.',
    icon: (
      <>
        <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </>
    ),
  },
  {
    no: '02',
    title: 'Experienced Drivers',
    text: 'Professional drivers focused on safe, smooth and courteous journeys.',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  },
  {
    no: '03',
    title: 'Clean & Comfortable Cars',
    text: 'Well-presented vehicles prepared to make every ride feel pleasant.',
    icon: (
      <>
        <path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6L10 4z" />
        <path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14z" />
      </>
    ),
  },
  {
    no: '04',
    title: 'On-Time Service',
    text: 'Careful planning and punctual pickups to keep your journey moving.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
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

export default function WhyChoose() {
  const [headRef, headIn] = useInView()
  const [gridRef, gridIn] = useInView()

  return (
    <section className="overflow-x-clip bg-white font-[Poppins,sans-serif] text-black">
      <div className="container-x pb-12 pt-16 sm:pb-14 sm:pt-20 lg:pb-20 lg:pt-24">
        {/* ---------- Heading ---------- */}
        <div ref={headRef} className={`text-center ${reveal(headIn)}`}>
          <p className="text-sm font-bold uppercase tracking-wide text-[#e3252d] sm:text-lg lg:text-2xl">
            Why Lucky Travels
          </p>
          <h2 className="mt-3 text-[28px] font-medium leading-tight sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Why Choose Lucky Travels?
          </h2>
          <p className="mx-auto mt-4 max-w-[900px] text-base leading-relaxed sm:mt-5 sm:text-lg lg:text-xl">
            Dependable travel is built on the details — clean vehicles, considerate service and a
            genuine commitment to your journey.
          </p>
        </div>

        {/* ---------- Cards (gap-px + coloured bg = patli red dividers) ---------- */}
        <div
          ref={gridRef}
          className={`mt-10 grid gap-px overflow-hidden rounded-lg border border-[#e3252d]/60 bg-[#e3252d]/60 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 ${reveal(gridIn)}`}
        >
          {features.map((f, i) => (
            <article
              key={f.no}
              className="group relative overflow-hidden bg-white p-5 pb-8 transition-colors duration-300 hover:bg-[#fff8f8] sm:p-6 sm:pb-10 lg:p-5 lg:pb-14 xl:p-6 xl:pb-14
                         after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:origin-left after:scale-x-0 after:bg-[#e3252d] after:content-['']
                         after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 motion-reduce:after:transition-none"
            >
              {/* content har card me thoda ruk ke aata hai (stagger) */}
              <div
                className={reveal(gridIn)}
                style={{ transitionDelay: gridIn ? `${150 + i * 120}ms` : '0ms' }}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#fde8e9] text-[#e3252d] transition duration-300 group-hover:scale-110 group-hover:bg-[#e3252d] group-hover:text-white motion-reduce:transition-none sm:h-12 sm:w-12">
                    <svg
                      className="h-6 w-6 sm:h-7 sm:w-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {f.icon}
                    </svg>
                  </span>
                  <span className="text-2xl text-[#f4a6a9] transition-colors duration-300 group-hover:text-[#e3252d] sm:text-3xl">
                    {f.no}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-medium transition-colors duration-300 group-hover:text-[#e3252d] sm:mt-8 sm:text-xl lg:text-[19px] xl:text-[21px]">
                  {f.title}
                </h3>
                <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-black xl:text-[15px]">
                  {f.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}