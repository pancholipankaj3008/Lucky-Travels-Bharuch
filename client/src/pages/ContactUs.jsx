import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

const PHONE = "+91 88667 77110";
const PHONE_LINK = "+918866777110";
const EMAIL = "luckytravels777110@gmail.com";

/* ---------- extra animations (reduced-motion me band) ---------- */
const animCss = `
@keyframes contact-pop {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes contact-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
@media (prefers-reduced-motion: no-preference) {
  .contact-pop { animation: contact-pop 0.35s ease-out both; }
  .contact-bounce { animation: contact-bounce 2s ease-in-out infinite; }
}`;

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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

const base =
  "transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none";

const revealUp = (on) => `${base} ${on ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`;

// Left card: laptop pe left se, mobile pe neeche se
const revealLeft = (on) =>
  `${base} ${
    on
      ? "translate-x-0 translate-y-0 opacity-100"
      : "translate-y-8 opacity-0 lg:translate-y-0 lg:-translate-x-12"
  }`;

// Right card: laptop pe right se, mobile pe neeche se
const revealRight = (on) =>
  `${base} ${
    on
      ? "translate-x-0 translate-y-0 opacity-100"
      : "translate-y-8 opacity-0 lg:translate-y-0 lg:translate-x-12"
  }`;

const ArrowIcon = ({ className = "h-3.5 w-3.5" }) => (
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
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const inputClass =
  "w-full rounded-md bg-[#F3F4F6] px-4 py-3 text-sm text-gray-800 placeholder:text-gray-500 outline-none transition duration-200 hover:bg-[#ebedf1] focus:bg-white focus:ring-2 focus:ring-[#E5252A]/40";

// Field focus hone par label red ho jata hai (wrapper pe `group/field` chahiye)
const labelClass =
  "mb-2 block text-sm font-semibold text-[#111827] transition-colors duration-200 group-focus-within/field:text-[#E5252A] sm:text-base";

function ContactUs() {
  const [cars, setCars] = useState([]);
  const [searchParams] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  useEffect(() => { api.getCars().then(({ cars: list }) => setCars(list || [])).catch(() => setCars([])); }, []);
  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    car: searchParams.get("car") || "",
    pickup: "",
    destination: "",
    date: "",
    phone: "",
    message: "",
  }));

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setStatus(null);
    try {
      await api.sendEnquiry({ name: form.name, email: form.email, phone: form.phone, car: form.car, pickupLocation: form.pickup, destination: form.destination, travelDate: form.date, message: form.message, formType: "Contact Enquiry" });
      setStatus({ type: "success", text: "Enquiry sent successfully. We will contact you soon." });
      setForm({ name: "", email: "", car: "", pickup: "", destination: "", date: "", phone: "", message: "" });
    } catch (error) { setStatus({ type: "error", text: error.message }); }
    finally { setSubmitting(false); }
  };

  /* ---------- animation state (logic se alag) ---------- */
  // Hero: page khulte hi chalta hai
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const [asideRef, asideIn] = useInView();
  const [formRef, formIn] = useInView();
  const [mapRef, mapIn] = useInView();
  const [mapLoaded, setMapLoaded] = useState(false);

  const heroDelay = (ms) => ({ transitionDelay: mounted ? `${ms}ms` : "0ms" });
  const asideDelay = (ms) => ({ transitionDelay: asideIn ? `${ms}ms` : "0ms" });
  // Form fields ek ke baad ek aate hain
  const fieldDelay = (i) => ({ transitionDelay: formIn ? `${250 + i * 70}ms` : "0ms" });
  const fieldClass = `group/field ${revealUp(formIn)}`;

  return (
    <div className="overflow-x-clip bg-white">
      <style>{animCss}</style>

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
            className={`inline-block rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#E5252A] sm:text-[15px] ${revealUp(mounted)}`}
            style={heroDelay(100)}
          >
            Contact Us
          </span>

          <h1
            className={`mt-4 max-w-4xl text-[32px] font-bold leading-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl xl:text-7xl ${revealUp(mounted)}`}
            style={heroDelay(250)}
          >
            Your Next Journey Starts Here.
          </h1>

          <p
            className={`mt-4 text-base text-white/90 sm:text-[19px] ${revealUp(mounted)}`}
            style={heroDelay(400)}
          >
            Tell us your trip, and let&apos;s plan your ride.
          </p>
        </div>
      </section>

      {/* ================= INFO + FORM ================= */}
      <section className="container-x py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
          {/* ---------- Left dark card ---------- */}
          <aside
            ref={asideRef}
            className={`rounded-xl bg-[#14171F] p-6 text-white sm:p-8 lg:min-h-[336px] ${revealLeft(asideIn)}`}
          >
            <p
              className={`text-sm font-medium uppercase tracking-wide text-[#E5252A] sm:text-[16px] ${revealUp(asideIn)}`}
              style={asideDelay(200)}
            >
              Lucky Travels Bharuch
            </p>

            <h2
              className={`mt-5 text-[28px] font-semibold leading-snug sm:mt-6 sm:text-[32px] xl:text-[39px] ${revealUp(asideIn)}`}
              style={asideDelay(300)}
            >
              We&apos;re ready when
              <br />
              you are.
            </h2>

            <p
              className={`mt-5 max-w-[260px] text-[15px] font-semibold leading-relaxed text-[#7CA0A8] ${revealUp(asideIn)}`}
              style={asideDelay(400)}
            >
              Share your travel plan with us. We&apos;ll help you choose the right
              ride for a comfortable journey.
            </p>

            <div className="mt-6 border-t border-white/20" />

            {/* Call row: icon ke peeche halka ping ring */}
            <div className={revealUp(asideIn)} style={asideDelay(500)}>
              <div className="group flex items-center gap-3 py-5">
                <span className="relative flex h-8 w-8 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/50 motion-reduce:hidden" aria-hidden="true" />
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF] text-[#E5252A] transition duration-300 group-hover:scale-110 group-hover:bg-[#E5252A] group-hover:text-white motion-reduce:transition-none">
                    <PhoneIcon />
                  </span>
                </span>
                <div>
                  <p className="text-[15px] text-white/80">Call us</p>
                  <a
                    href={`tel:${PHONE_LINK}`}
                    className="text-base font-semibold transition-colors duration-200 hover:text-[#E5252A] sm:text-[17px]"
                  >
                    {PHONE}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20" />

            <div className={revealUp(asideIn)} style={asideDelay(600)}>
              <div className="group flex items-center gap-3 py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#E5252A] transition duration-300 group-hover:scale-110 group-hover:bg-[#E5252A] group-hover:text-white motion-reduce:transition-none">
                  <MailIcon />
                </span>

                <div className="min-w-0">
                  <p className="text-[15px] text-white/80">Mail us</p>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="break-all text-sm font-semibold transition-colors duration-200 hover:text-[#E5252A] sm:text-[15px]"
                  >
                    {EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className={`mt-1 flex flex-wrap gap-3 ${revealUp(asideIn)}`} style={asideDelay(700)}>
              <a
                href={`tel:${PHONE_LINK}`}
                onClick={(e) => {
    e.preventDefault();
    gtag_report_conversion(`tel:${PHONE_LINK}`);
  }}
                className="rounded-md bg-[#E5252A] px-6 py-2 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#c91e23] hover:shadow-lg hover:shadow-[#E5252A]/40 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[18px]"
              >
                Call Now
              </a>
              <a
                href={`https://wa.me/${PHONE_LINK.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/40 px-4 py-2 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-[#14171F] active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:text-[18px]"
              >
                WhatsApp Us
              </a>
            </div>
          </aside>

          {/* ---------- Right form card ---------- */}
          <div
            ref={formRef}
            className={`rounded-xl border border-[#F2A5A8] bg-white p-6 sm:p-8 ${revealRight(formIn)}`}
          >
            <h2
              className={`text-2xl font-semibold text-[#111827] sm:text-3xl xl:text-[38px] ${revealUp(formIn)}`}
              style={{ transitionDelay: formIn ? "100ms" : "0ms" }}
            >
              Plan Your Ride
            </h2>
            <p
              className={`mt-3 text-base font-medium text-[#475569] sm:text-xl ${revealUp(formIn)}`}
              style={{ transitionDelay: formIn ? "180ms" : "0ms" }}
            >
              Complete the form and we&apos;ll be ready to help.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 sm:mt-7">
              {status && (
                <p
                  role="status"
                  className={`contact-pop mb-5 rounded-md p-3 text-sm ${status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {status.text}
                </p>
              )}
              <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className={fieldClass} style={fieldDelay(0)}>
                  <label htmlFor="name" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={inputClass}
                    required
                  />
                </div>

                <div className={fieldClass} style={fieldDelay(1)}>
                  <label htmlFor="phone" className={labelClass}>Contact Number</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="10-digit number" className={inputClass} required />
                </div>

                <div className={fieldClass} style={fieldDelay(2)}>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} required />
                </div>

                <div className={fieldClass} style={fieldDelay(3)}>
                  <label htmlFor="car" className={labelClass}>Choose Car</label>
                  <select id="car" name="car" value={form.car} onChange={handleChange} className={inputClass}>
                    <option value="">Any available car</option>
                    {cars.map((car) => <option key={car._id} value={car.name}>{car.name}</option>)}
                  </select>
                </div>

                <div className={fieldClass} style={fieldDelay(4)}>
                  <label htmlFor="pickup" className={labelClass}>Pickup Location</label>
                  <input id="pickup" name="pickup" type="text" value={form.pickup} onChange={handleChange} placeholder="Enter pickup location" className={inputClass} required />
                </div>

                <div className={fieldClass} style={fieldDelay(5)}>
                  <label htmlFor="destination" className={labelClass}>Destination</label>
                  <input id="destination" name="destination" type="text" value={form.destination} onChange={handleChange} placeholder="Where are you going?" className={inputClass} required />
                </div>

                <div className={fieldClass} style={fieldDelay(6)}>
                  <label htmlFor="date" className={labelClass}>Date</label>
                  <input id="date" name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} required />
                </div>
              </div>

              <div className={`group/field mt-5 ${revealUp(formIn)}`} style={fieldDelay(7)}>
                <label htmlFor="message" className={labelClass}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us anything else about your trip"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Bahar wala div reveal karta hai, andar wala button hover */}
              <div className={`mt-5 ${revealUp(formIn)}`} style={fieldDelay(8)}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#E5252A] px-5 py-3 text-base font-semibold text-white
                             transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#c91e23] hover:shadow-lg hover:shadow-[#E5252A]/40 active:translate-y-0 active:scale-[0.98]
                             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5252A]
                             disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none
                             motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto sm:py-2.5 sm:text-[18px]"
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1 motion-reduce:transition-none" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section className="container-x pb-10 sm:pb-14">
        <div
          ref={mapRef}
          className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-[#0F1E33] shadow-[0_12px_35px_rgba(15,30,51,0.16)] transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,30,51,0.28)] ${revealUp(mapIn)}`}
        >
          {/* Map heading */}
          <div className="flex flex-col gap-3 bg-[#0F1E33] px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e3252d]">
                {/* Pin halka upar-neeche bounce karta hai */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="contact-bounce h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  Find Us in Bharuch
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  Bharuch, Gujarat, India
                </p>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Bharuch%2C%20Gujarat%2C%20India"
              target="_blank"
              rel="noreferrer"
              className="group/dir inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#0F1E33]
                         transition duration-200 hover:-translate-y-0.5 hover:bg-[#e3252d] hover:text-white hover:shadow-lg active:translate-y-0 active:scale-[0.98]
                         motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-fit"
            >
              Get Directions
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4 transition-transform duration-200 group-hover/dir:-translate-y-0.5 group-hover/dir:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>
          </div>

          {/* Google Map: load hone par fade-in */}
          <iframe
            title="Lucky Travels location in Bharuch, Gujarat"
            src="https://maps.google.com/maps?q=Bharuch%2C%20Gujarat%2C%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => setMapLoaded(true)}
            className={`block h-[280px] w-full border-0 transition-opacity duration-700 motion-reduce:transition-none sm:h-[380px] lg:h-[440px] ${
              mapLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </section>
    </div>
  );
}

export default ContactUs;