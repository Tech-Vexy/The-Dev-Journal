'use client';
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useState } from "react"
import ThemeToggle from "./theme-toggle"
import RssLink from "./rss-link"
import Search from "./search"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" }
  ]

  return (
      <header
          className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
          aria-label="Main Navigation"
      >
        <div className="container mx-auto px-4">
          <div className="flex h-auto items-center justify-between py-3">
            {/* Logo and Main Navigation */}
            <div className="flex items-center gap-8">
              <Link
                  href="/"
                  className="flex items-center"
                  aria-label="Home page"
              >
                <Image
                    src="/logo.png"
                    alt="Blog Logo"
                    width={200}
                    height={100}
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
                        className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
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
                  className="md:hidden"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle mobile menu"
                  aria-expanded={isMenuOpen}
              >
                <Menu />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Overlay */}
          {isMenuOpen && (
              <div
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-40"
                  onClick={toggleMobileMenu}
              >
                <nav
                    className="absolute top-full left-0 w-full bg-background shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col divide-y">
                    {navigationLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="p-4 block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors text-center"
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
  )
}