import { useEffect, useRef, useState } from 'react'

// Images (public/ folder me rakho):
//   /AllHero.png        -> mountain road wali banner image
//   /Rectangle 114.png  -> Ertiga car wali image

const cards = [
  {
    no: '01',
    title: 'Our Mission',
    text: 'To make dependable, comfortable travel easy to arrange for people across Bharuch.',
  },
  {
    no: '02',
    title: 'Our Commitment',
    text: 'Friendly communication, punctual service and thoughtful attention throughout your journey.',
  },
  {
    no: '03',
    title: 'Why Choose Lucky Travels?',
    text: 'Because a smooth journey comes from local knowledge, good cars and service that genuinely cares.',
  },
]

/* ---------- badge ka halka floating loop (reduced-motion me band) ---------- */
const floatCss = `
@keyframes about-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@media (prefers-reduced-motion: no-preference) {
  .about-float { animation: about-float 4s ease-in-out infinite; }
}`

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

const revealUp = (on) => `${base} ${on ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`

// Image: mobile pe neeche se, laptop pe left se slide
const revealLeft = (on) =>
  `${base} ${
    on
      ? 'translate-x-0 translate-y-0 opacity-100'
      : 'translate-y-8 opacity-0 lg:translate-y-0 lg:-translate-x-12'
  }`

// Quote box: left se slide
const revealSide = (on) => `${base} ${on ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`

const revealPop = (on) => `${base} ${on ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`

function ArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function AboutUs() {
  // Banner: page khulte hi chalta hai (scroll ki zarurat nahi)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const [imgRef, imgIn] = useInView()
  const [textRef, textIn] = useInView()
  const [cardsRef, cardsIn] = useInView()

  const bannerDelay = (ms) => ({ transitionDelay: mounted ? `${ms}ms` : '0ms' })
  const textDelay = (ms) => ({ transitionDelay: textIn ? `${ms}ms` : '0ms' })

  return (
    <main className="overflow-x-clip bg-white font-[Inter,sans-serif] text-black">
      <style>{floatCss}</style>

      {/* ---------- Page banner ---------- */}
      <section className="relative isolate flex min-h-[340px] items-center overflow-hidden bg-[#0f2347] text-white sm:min-h-[400px] lg:h-110">
        {/* Background image: load hote hi halka zoom-out hokar settle hoti hai */}
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
            className={`inline-block rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#e3252d] sm:text-sm ${revealUp(mounted)}`}
            style={bannerDelay(100)}
          >
            Our Story
          </span>
          <h1
            className={`mt-4 text-[32px] font-bold leading-tight sm:mt-5 sm:text-5xl lg:text-[56px] ${revealUp(mounted)}`}
            style={bannerDelay(250)}
          >
            About Lucky Travels Bharuch
          </h1>
          <p
            className={`mt-4 max-w-[420px] text-sm leading-relaxed sm:mt-5 sm:text-base ${revealUp(mounted)}`}
            style={bannerDelay(400)}
          >
            Local understanding, thoughtful service and comfortable journeys — all from the heart of Bharuch.
          </p>
        </div>
      </section>

      {/* ---------- Our story ---------- */}
      <section className="container-x py-12 sm:py-14 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-6">
          {/* Image + badge */}
          <div ref={imgRef} className={`relative isolate w-full max-w-[510px] pb-6 lg:pb-0 ${revealLeft(imgIn)}`}>
            {/* Red outline frame: image ke peeche se thoda khisak ke bahar aata hai */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 -z-10 transition-transform duration-700 ease-out motion-reduce:transition-none ${
                imgIn ? '-translate-x-2.5 -translate-y-2.5 sm:-translate-x-3 sm:-translate-y-3' : 'translate-x-0 translate-y-0'
              }`}
              style={{ transitionDelay: imgIn ? '600ms' : '0ms' }}
            />

            <div className="group overflow-hidden rounded-br rounded-tr rounded-bl">
              <img
                src="/Rectangle 114.png"
                alt="Maruti Suzuki Ertiga on a scenic Bharuch route"
                loading="lazy"
                className="aspect-[473/535] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>

            {/* Badge: pop-in hota hai, phir halka float karta rehta hai */}
            <div
              className={`absolute bottom-0 right-0 origin-bottom-right lg:-right-8 lg:bottom-5 ${revealPop(imgIn)}`}
              style={{ transitionDelay: imgIn ? '700ms' : '0ms' }}
            >
              <div className="about-float rounded-xl bg-[#e3252d] px-6 py-4 text-white shadow-lg sm:px-10 sm:py-5 lg:px-16 lg:py-6">
                <p className="text-sm font-semibold sm:text-base">Proudly serving</p>
                <p className="text-sm sm:text-base">Bharuch, Gujarat</p>
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="max-w-[520px]">
            <p
              className={`text-base font-semibold uppercase tracking-wide text-[#e3252d] sm:text-lg ${revealUp(textIn)}`}
              style={textDelay(0)}
            >
              Our Story
            </p>
            <h2
              className={`mt-3 text-[30px] font-bold leading-[1.15] sm:mt-4 sm:text-5xl xl:text-[58px] ${revealUp(textIn)}`}
              style={textDelay(100)}
            >
              Travel that feels personal.
            </h2>
            <p
              className={`mt-5 text-base leading-relaxed sm:mt-6 sm:text-[18px] ${revealUp(textIn)}`}
              style={textDelay(200)}
            >
              Lucky Travels Bharuch is dedicated to making everyday travel, family journeys and
              outstation trips comfortable and convenient.
            </p>

            <blockquote
              className={`mt-6 border-l-[6px] border-[#e3252d] bg-[#eef0f5] px-4 py-4 text-[15px] font-extrabold leading-snug sm:mt-8 sm:border-l-7 sm:px-5 sm:py-5 sm:text-[16px] ${revealSide(textIn)}`}
              style={textDelay(350)}
            >
              “Every route is different. Our commitment to your comfort stays the same.”
            </blockquote>

            {/* Bahar wala div reveal karta hai, andar wala button hover */}
            <div className={`mt-8 sm:mt-10 ${revealUp(textIn)}`} style={textDelay(500)}>
              <a
                href="/contact"
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#e3252d] px-6 py-3.5 text-base font-semibold text-white
                           transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#c81f26] hover:shadow-lg hover:shadow-[#e3252d]/40 active:translate-y-0 active:scale-[0.98]
                           focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3252d]
                           motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto sm:py-4"
              >
                Let’s Plan Your Journey
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Mission / Commitment / Why ---------- */}
      <section className="container-x pb-14 sm:pb-16 lg:pb-24">
        <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            // Bahar wala div: reveal + stagger. Andar wala article: hover (delay hover ko slow na kare)
            <div
              key={c.no}
              className={`${revealUp(cardsIn)} sm:max-lg:last:odd:col-span-2 sm:max-lg:last:odd:mx-auto sm:max-lg:last:odd:w-[calc(50%-0.75rem)]`}
              style={{ transitionDelay: cardsIn ? `${i * 150}ms` : '0ms' }}
            >
              <article
                className="group relative h-full overflow-hidden rounded-lg border border-[#f3c5c8] bg-white p-6 transition duration-300 ease-out
                           hover:-translate-y-1.5 hover:border-[#e3252d] hover:shadow-[0_16px_36px_rgba(227,37,45,0.15)] sm:p-6 lg:px-7 lg:py-10
                           after:absolute after:left-0 after:top-0 after:h-1 after:w-full after:origin-left after:scale-x-0 after:bg-[#e3252d] after:content-['']
                           after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100
                           motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:after:transition-none"
              >
                <p className="inline-grid h-10 min-w-10 place-items-center rounded-full bg-[#fde8e9] px-2 text-base font-bold text-[#e3252d] transition-colors duration-300 group-hover:bg-[#e3252d] group-hover:text-white sm:text-lg">
                  {c.no}
                </p>
                <h3 className="mt-6 text-lg font-bold transition-colors duration-300 group-hover:text-[#e3252d] sm:mt-8 sm:text-xl">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8a6f74] sm:text-base">{c.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}