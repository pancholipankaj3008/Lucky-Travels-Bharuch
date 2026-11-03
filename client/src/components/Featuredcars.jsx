import { useEffect, useRef, useState } from 'react'

/*
  Home page ke liye 3 featured cars (static).
  Backend aane par isko API se aaye array se replace kar dena.
*/
const featured = [
  {
    id: 1,
    name: 'Toyota Innova Crysta',
    image: '/Toyota Innova Crysta at Sunset 2.png',
    text: 'A spacious, premium MPV ideal for family trips, group travel and comfortable outstation journeys.',
  },
  {
    id: 2,
    name: 'Suzuki Ertiga',
    image: '/Suzuki Ertiga at Golden Horizon 1.png',
    text: 'A spacious, premium MPV ideal for family trips, group travel and comfortable outstation journeys.',
  },
  {
    id: 3,
    name: 'Force Urbania',
    image: '/Force Urbania.png',
    text: 'A spacious, premium MPV ideal for family trips, group travel and comfortable outstation journeys.',
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
    on ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  }`

function ArrowRight() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function CarCard({ car }) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.12)]
                 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_44px_rgba(0,0,0,0.2)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* Image: hover pe halka zoom */}
      <div className="overflow-hidden">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-base sm:text-lg xl:text-xl">Premium Car</p>
        <h3 className="mt-3 text-2xl font-semibold transition-colors duration-300 group-hover:text-[#e3252d] sm:mt-4 xl:text-3xl">
          {car.name}
        </h3>
        <p className="mt-3 mb-5 text-sm leading-relaxed">{car.text}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-3 border-t border-black pt-4">
          <p className="text-base font-semibold">Contact for pricing</p>
          <a
            href="/cars"
            className="group/btn inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-[#e3252d] px-3.5 py-2 text-sm font-medium text-white
                       transition duration-200 hover:-translate-y-0.5 hover:bg-[#c81f26] hover:shadow-lg hover:shadow-[#e3252d]/40 active:translate-y-0 active:scale-95
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3252d]
                       motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:text-[16px]"
          >
            View &amp; Book
            <ArrowRight />
          </a>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedCars() {
  const [headRef, headIn] = useInView()
  const [gridRef, gridIn] = useInView()

  return (
    <section className="overflow-x-clip bg-white font-[Poppins,sans-serif] text-black">
      <div className="container-x py-12 sm:py-14 lg:py-16">
        {/* ---------- Heading ---------- */}
        <div ref={headRef} className={`text-center ${reveal(headIn)}`}>
          <p className="text-xl font-bold text-[#e3252d] sm:text-2xl lg:text-3xl">Our Cars</p>
          <h2 className="mt-3 text-[28px] font-semibold leading-tight sm:mt-5 sm:text-4xl md:text-5xl xl:text-6xl">
            A car for every kind of journey
          </h2>
          <p className="mt-4 text-base sm:mt-6 sm:text-lg lg:text-xl">
            Choose comfort and space that fits your travel plan.
          </p>
        </div>

        {/* ---------- Cards ---------- */}
        <div ref={gridRef} className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((car, i) => (
            // Bahar wala div sirf reveal (stagger delay) sambhalta hai, andar wala card hover.
            // Isse hover ke time delay nahi lagta.
            <div
              key={car.id}
              className={`${reveal(gridIn)} md:max-lg:last:odd:col-span-2 md:max-lg:last:odd:mx-auto md:max-lg:last:odd:w-[calc(50%-0.75rem)]`}
              style={{ transitionDelay: gridIn ? `${i * 150}ms` : '0ms' }}
            >
              <CarCard car={car} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}