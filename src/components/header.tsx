'use client';
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./theme-toggle";
import RssLink from "./rss-link";
import Search from "./search";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    {href: "/discover", label: "Discover" },
  ];

  // Active link detection
  const [activePath, setActivePath] = useState("/");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setActivePath(window.location.pathname);
    }
  }, []);

  return (
      <header
          className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur transition-shadow duration-200 ${
              scrolled ? "shadow-md" : ""
          }`}
          aria-label="Main Navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Main Navigation */}
            <div className="flex items-center gap-8">
              <Link
                  href="/"
                  className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                  aria-label="Home page"
              >
                <Image
                    src="/logo.png"
                    alt="Blog Logo"
                    width={150}
                    height={32}
                    className="rounded-md object-contain"
                    priority
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navigationLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-medium transition-colors hover:text-primary relative px-1 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md ${
                            activePath === link.href
                                ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                                : "text-foreground/80"
                        }`}
                    >
                      {link.label}
                    </Link>
                ))}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Search */}
              <div className="hidden md:block w-full max-w-sm">
                <Search />
              </div>

              {/* RSS and Theme Toggle */}
              <div className="flex items-center gap-2">
                <RssLink />
                <ThemeToggle />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                  className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-foreground md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={toggleMobileMenu}
                  aria-label={isMenuOpen ? "Close mobile menu" : "Open mobile menu"}
                  aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          {isMenuOpen && (
              <div
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-40"
                  onClick={toggleMobileMenu}
                  aria-hidden="true"
              >
                <nav
                    className="absolute top-16 left-0 w-full bg-background shadow-lg border-t"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Mobile Navigation"
                >
                  <div className="flex flex-col divide-y animate-in slide-in-from-top duration-300">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`p-4 block text-sm font-medium transition-colors hover:bg-muted ${
                                activePath === link.href ? "text-primary" : "text-foreground/80"
                            }`}
                            onClick={toggleMobileMenu}
                        >
                          {link.label}
                        </Link>
                    ))}
                    <div className="p-4 flex justify-center items-center gap-4">
                      <Search />
                    </div>
                  </div>
                </nav>
              </div>
          )}
        </div>
      </header>
  );
}