import { useEffect, useRef, useState } from "react";

/* ---------- Small icon helper (lucide-style, no extra package) ---------- */
const Icon = ({ children, className = "h-6 w-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PinIcon = () => (
  <Icon>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

const RouteIcon = () => (
  <Icon>
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
    <circle cx="18" cy="5" r="3" />
  </Icon>
);

const SendIcon = () => (
  <Icon>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </Icon>
);

const UserIcon = () => (
  <Icon>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66" />
  </Icon>
);

const BriefcaseIcon = () => (
  <Icon>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M9 3v3h6V3" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </Icon>
);

const SparklesIcon = () => (
  <Icon>
    <path d="M9.94 14.06 8 20l-1.94-5.94L0 12l6.06-2.06L8 4l1.94 5.94L16 12Z" transform="translate(3 0)" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
  </Icon>
);

const ArrowIcon = ({ className = "h-3.5 w-3.5" }) => (
  <Icon className={className}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
);

/* ---------- Data ---------- */
const services = [
  {
    no: "01",
    title: "Local City Travel",
    desc: "Easy, comfortable travel across Bharuch for errands, meetings and everyday plans.",
    icon: <PinIcon />,
  },
  {
    no: "02",
    title: "Outstation Car Travel",
    desc: "Relaxed intercity journeys planned around your destination and schedule.",
    icon: <RouteIcon />,
  },
  {
    no: "03",
    title: "Airport Pickup & Drop",
    desc: "Convenient airport transfers with timely pickups and ample travel comfort.",
    icon: <SendIcon />,
  },
  {
    no: "04",
    title: "Family Trips & Holidays",
    desc: "Spacious rides for family time, weekend escapes and memorable holidays.",
    icon: <UserIcon />,
  },
  {
    no: "05",
    title: "Corporate Travel",
    desc: "Professional point-to-point travel for meetings and business requirements.",
    icon: <BriefcaseIcon />,
  },
  {
    no: "06",
    title: "Wedding & Special Occasions",
    desc: "Dependable guest and family travel for celebrations and important days.",
    icon: <SparklesIcon />,
  },
];

/* ---------- scroll reveal: element screen me aate hi ek baar animate hota hai ---------- */
function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

const revealUp = (on) =>
  `transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
    on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

/* ---------- Page ---------- */
function Services() {
  // Hero: page khulte hi chalta hai
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const [headRef, headIn] = useInView();
  const [gridRef, gridIn] = useInView();

  const heroDelay = (ms) => ({ transitionDelay: mounted ? `${ms}ms` : "0ms" });
  const headDelay = (ms) => ({ transitionDelay: headIn ? `${ms}ms` : "0ms" });

  return (
    <div className="overflow-x-clip bg-white">
      {/* ================= HERO ================= */}
      <section className="relative isolate flex min-h-[360px] items-center overflow-hidden sm:min-h-[400px] lg:min-h-[440px]">
        {/* Background: load hote hi halka zoom-out hokar settle hoti hai */}
        <img
          src="/AllHero.png"
          alt="Mountain road"
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[2500ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
            mounted ? "scale-100" : "scale-110"
          }`}
        />
        <div className="absolute inset-0 -z-10 bg-[#0B1B3F]/55" />

        <div className="container-x w-full py-12 sm:py-16 lg:py-0">
          <span
            className={`inline-block rounded-full bg-white px-4 py-1 text-xs font-medium text-[#E5252A] sm:text-[15px] ${revealUp(mounted)}`}
            style={heroDelay(100)}
          >
            Travel Solutions
          </span>

          <h1
            className={`mt-4 text-[32px] font-semibold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl ${revealUp(mounted)}`}
            style={heroDelay(250)}
          >
            Services for Every Journey
          </h1>

          <p
            className={`mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base ${revealUp(mounted)}`}
            style={heroDelay(400)}
          >
            Thoughtful car travel for daily plans, business needs, family moments
            and roads beyond Bharuch.
          </p>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="container-x py-12 sm:py-16 lg:py-20">
        <div ref={headRef} className="mx-auto max-w-4xl text-center">
          <p
            className={`text-lg font-bold text-[#E5252A] sm:text-2xl ${revealUp(headIn)}`}
            style={headDelay(0)}
          >
            How we can help
          </p>

          {/* Eyebrow ke neeche red line beech se dono taraf failti hai */}
          <span
            aria-hidden="true"
            className={`mx-auto mt-3 block h-1 w-16 origin-center rounded bg-[#E5252A] transition-transform duration-700 ease-out motion-reduce:scale-x-100 motion-reduce:transition-none ${
              headIn ? "scale-x-100" : "scale-x-0"
            }`}
            style={headDelay(250)}
          />

          <h2
            className={`mt-5 text-[26px] font-semibold leading-tight text-black sm:mt-6 sm:text-4xl lg:text-5xl xl:text-6xl ${revealUp(headIn)}`}
            style={headDelay(150)}
          >
            Choose the journey that fits your plans
          </h2>

          <p
            className={`mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[#9B6B76] sm:mt-6 sm:text-lg lg:text-xl ${revealUp(headIn)}`}
            style={headDelay(300)}
          >
            Tell us where you&apos;re going and what matters for your trip.
            We&apos;ll help you plan the right travel experience.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-10"
        >
          {services.map((item, i) => (
            // Bahar wala div: reveal + stagger. Andar wala article: hover (delay hover ko slow na kare)
            <div
              key={item.no}
              className={revealUp(gridIn)}
              style={{ transitionDelay: gridIn ? `${i * 110}ms` : "0ms" }}
            >
              <article
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#F2A5A8] bg-white p-5 shadow-[0_2px_6px_rgba(229,37,42,0.12)]
                           transition duration-300 ease-out hover:-translate-y-2 hover:border-[#E5252A] hover:shadow-[0_16px_36px_rgba(229,37,42,0.2)]
                           after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:origin-left after:scale-x-0 after:bg-[#E5252A] after:content-['']
                           after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100
                           motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:after:transition-none"
              >
                <div className="flex items-start justify-between">
                  <span className="text-lg font-semibold text-gray-500 transition-colors duration-300 group-hover:text-[#E5252A] sm:text-[20px]">
                    {item.no}
                  </span>
                  {/* Hover pe icon box red fill hota hai aur halka tilt + zoom */}
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FDE8E9] text-[#E5252A] transition duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-[#E5252A] group-hover:text-white motion-reduce:transition-none motion-reduce:group-hover:rotate-0 sm:h-14 sm:w-14 lg:h-15 lg:w-15">
                    {item.icon}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-bold text-black transition-colors duration-300 group-hover:text-[#E5252A] sm:mt-6 sm:text-2xl">
                  {item.title}
                </h3>

                <p className="mt-3 max-w-[260px] text-sm leading-relaxed text-[#9B6B76]">
                  {item.desc}
                </p>

                <a
                  href="/contact"
                  className="group/btn mt-6 inline-flex w-fit items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-base font-bold text-black
                             transition duration-200 ease-out group-hover:border-[#E5252A]
                             hover:border-[#E5252A] hover:bg-[#E5252A] hover:text-white hover:shadow-lg hover:shadow-[#E5252A]/30 active:scale-[0.98]
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5252A]
                             motion-reduce:transition-none sm:px-5 sm:py-3 sm:text-[18px]"
                >
                  Enquire Now
                  <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none" />
                </a>
              </article>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;