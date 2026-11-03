import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Cars", href: "/cars" },
  { label: "Contact Us", href: "/contact" },
];

function ArrowRight({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
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
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Desktop/tablet link: hover pe niche red line left se right stretch hoti hai.
  // Active page pe line hamesha full dikhti hai.
  const linkClass = ({ isActive }) =>
    `relative inline-block whitespace-nowrap py-1 text-sm font-medium transition-colors duration-200 lg:text-[15px]
     after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-[#e3252d]
     after:content-[''] after:transition-transform after:duration-300 after:ease-out motion-reduce:after:transition-none
     ${
       isActive
         ? "text-[#e3252d] after:scale-x-100"
         : "text-[#0f1b3d] hover:text-[#e3252d] after:scale-x-0 hover:after:scale-x-100"
     }`;

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white font-[Inter,sans-serif] shadow-sm">
      <nav className="container-x flex h-[78px] items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="shrink-0">
          <img
            src="/Logo.png"
            alt="Lucky Travels"
            className="h-14 w-auto object-contain lg:h-20"
          />
        </Link>

        {/* Desktop + Tablet Links */}
        <ul className="hidden items-center gap-5 md:flex lg:gap-14">
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <NavLink
                to={link.href}
                end={link.href === "/"}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop + Tablet CTA */}
        <Link
          to="/contact"
          className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#e3252d] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c81f26] md:inline-flex lg:gap-2 lg:px-5 lg:py-3 lg:text-[16px]"
        >
          Book Your Ride
          <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
        </Link>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded p-2 text-[#0f1b3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e3252d] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="container-x border-t border-gray-100 bg-white pb-5 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  end={link.href === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block border-b border-gray-100 py-3 text-[15px] font-medium transition ${
                      isActive
                        ? "text-[#e3252d]"
                        : "text-[#0f1b3d] hover:text-[#e3252d]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            onClick={closeMenu}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#e3252d] px-5 py-3 font-semibold text-white transition hover:bg-[#c81f26]"
          >
            Book Your Ride
            <ArrowRight />
          </Link>
        </div>
      )}
    </header>
  );
}