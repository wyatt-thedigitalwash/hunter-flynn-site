"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music" },
  { label: "About", href: "/about" },
  { label: "Shows", href: "/shows" },
  { label: "Booking", href: "/booking" },
];

const SOCIALS = [
  {
    label: "Facebook (opens in new tab)",
    href: "https://www.facebook.com/HunterFlynnMusic",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram (opens in new tab)",
    href: "https://www.instagram.com/h_nterflynn",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.523.99 4.088 4.088 0 01.99 1.524c.163.46.349 1.26.403 2.43.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.99 1.523 4.088 4.088 0 01-1.524.99c-.46.163-1.26.349-2.43.403-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.523-.99 4.088 4.088 0 01-.99-1.524c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.99-1.523A4.088 4.088 0 015.15 2.636c.46-.163 1.26-.349 2.43-.403C8.845 2.175 9.225 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a6.21 6.21 0 00-2.245 1.462A6.21 6.21 0 00.433 4.337C.136 5.1-.067 5.972.014 7.25.072 8.53.086 8.938.086 12.197c0 3.259.014 3.668.072 4.948.058 1.277.261 2.15.558 2.913a6.21 6.21 0 001.462 2.245 6.21 6.21 0 002.245 1.462c.762.297 1.635.5 2.913.558C8.535 24.381 8.943 24.395 12.202 24.395c3.259 0 3.668-.014 4.948-.072 1.277-.058 2.15-.261 2.913-.558a6.21 6.21 0 002.245-1.462 6.21 6.21 0 001.462-2.245c.297-.762.5-1.635.558-2.913.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.261-2.15-.558-2.913a6.21 6.21 0 00-1.462-2.245A6.21 6.21 0 0020.063.633C19.3.336 18.428.133 17.15.075 15.87.017 15.462.003 12.202.003L12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
      </svg>
    ),
  },
  {
    label: "TikTok (opens in new tab)",
    href: "https://www.tiktok.com/@hunter_flynn",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.28a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.69z" />
      </svg>
    ),
  },
  {
    label: "YouTube (opens in new tab)",
    href: "https://www.youtube.com/@hunterflynn",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="20" height="20" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const HERO_PAGES = ["/", "/about"];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const hasHero = HERO_PAGES.includes(pathname);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape key closes menu
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeMenu();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Focus trap in mobile menu
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const menu = menuRef.current;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first.focus();

    function trapFocus(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    menu.addEventListener("keydown", trapFocus);
    return () => menu.removeEventListener("keydown", trapFocus);
  }, [menuOpen, menuVisible]);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMenuVisible(true);
      });
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
    setTimeout(() => {
      setMenuOpen(false);
      hamburgerRef.current?.focus();
    }, 500);
  }, []);

  const handleNavClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          scrolled ? "bg-black/90" : "bg-transparent"
        }`}
      >
        <nav
          className="flex items-center justify-between px-8 md:px-12 py-4"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            aria-label="Hunter Flynn - Home"
            className={`transition-opacity duration-300 ${
              hasHero && !scrolled && !menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Image
              src="/logos/HunterFlynn_LogoName_White.png"
              alt="Hunter Flynn"
              width={160}
              height={40}
              className="h-[40px] w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-din text-sm tracking-widest uppercase text-white hover:opacity-70 transition-opacity"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden flex flex-col justify-center gap-[5px] w-11 h-11 items-center"
            onClick={openMenu}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span className="block w-6 h-[2px] bg-white" aria-hidden="true" />
            <span className="block w-6 h-[2px] bg-white" aria-hidden="true" />
            <span className="block w-6 h-[2px] bg-white" aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`fixed inset-0 z-[60] bg-black flex flex-col transition-opacity duration-500 ${
            menuVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top bar — logo + close */}
          <div className="flex items-center justify-between px-8 py-4">
            <Link
              href="/"
              onClick={handleNavClick}
              aria-label="Hunter Flynn - Home"
              className={`transition-opacity duration-500 ${
                menuVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src="/logos/HunterFlynn_LogoName_White.png"
                alt="Hunter Flynn"
                width={160}
                height={40}
                className="h-[40px] w-auto"
              />
            </Link>
            <button
              className="flex flex-col justify-center gap-[5px] w-11 h-11 items-center"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <span className="block w-6 h-[2px] bg-white origin-center rotate-45 translate-y-[3.5px]" aria-hidden="true" />
              <span className="block w-6 h-[2px] bg-white origin-center -rotate-45 -translate-y-[3.5px]" aria-hidden="true" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col items-center justify-center" aria-label="Mobile navigation">
            <ul className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={handleNavClick}
                    className={`font-din text-3xl tracking-widest uppercase text-white hover:opacity-70 transition-all duration-500 ${
                      menuVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                    style={{ transitionDelay: menuVisible ? `${i * 80}ms` : "0ms" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social links */}
          <div
            className={`flex items-center justify-center gap-6 pb-10 transition-opacity duration-500 ${
              menuVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: menuVisible ? "400ms" : "0ms" }}
          >
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="hover:opacity-70 transition-opacity p-2"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
