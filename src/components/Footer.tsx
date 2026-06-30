import Image from "next/image";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/HunterFlynnMusic",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/h_nterflynn",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.523.99 4.088 4.088 0 01.99 1.524c.163.46.349 1.26.403 2.43.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.99 1.523 4.088 4.088 0 01-1.524.99c-.46.163-1.26.349-2.43.403-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.523-.99 4.088 4.088 0 01-.99-1.524c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.99-1.523A4.088 4.088 0 015.15 2.636c.46-.163 1.26-.349 2.43-.403C8.845 2.175 9.225 2.163 12 2.163zM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a6.21 6.21 0 00-2.245 1.462A6.21 6.21 0 00.433 4.337C.136 5.1-.067 5.972.014 7.25.072 8.53.086 8.938.086 12.197c0 3.259.014 3.668.072 4.948.058 1.277.261 2.15.558 2.913a6.21 6.21 0 001.462 2.245 6.21 6.21 0 002.245 1.462c.762.297 1.635.5 2.913.558C8.535 24.381 8.943 24.395 12.202 24.395c3.259 0 3.668-.014 4.948-.072 1.277-.058 2.15-.261 2.913-.558a6.21 6.21 0 002.245-1.462 6.21 6.21 0 001.462-2.245c.297-.762.5-1.635.558-2.913.058-1.28.072-1.688.072-4.948s-.014-3.668-.072-4.948c-.058-1.277-.261-2.15-.558-2.913a6.21 6.21 0 00-1.462-2.245A6.21 6.21 0 0020.063.633C19.3.336 18.428.133 17.15.075 15.87.017 15.462.003 12.202.003L12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@hunter_flynn",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.28a8.28 8.28 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.69z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@hunterflynn",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" width="24" height="24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const FOOTER_LINKS = [
  { label: "Terms", href: "https://www.bigmachinerecords.com/terms" },
  { label: "Do Not Sell My Personal Information", href: "https://www.bigmachinerecords.com/privacy" },
  { label: "Privacy", href: "https://www.bigmachinerecords.com/privacy" },
  { label: "Cookie Choices", href: "https://www.bigmachinerecords.com/privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-black pt-16 pb-8 px-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Logo */}
        <Image
          src="/logos/HunterFlynn_LogoLocked_White.png"
          alt="Hunter Flynn"
          width={200}
          height={60}
          loading="lazy"
          className="h-[60px] w-auto mb-8"
        />

        {/* Social icons */}
        <div className="flex items-center gap-6 mb-12">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="hover:opacity-70 transition-opacity"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Subscribe form */}
        <SubscribeForm />

        {/* Divider */}
        <div className="w-full h-px bg-white/20 my-10" />

        {/* Copyright */}
        <p className="font-adobe text-xs text-white text-center mb-1">
          Copyright &copy; 2026 Hunter Flynn Music - All Rights Reserved.
        </p>
        <p className="font-adobe text-xs text-white text-center mb-6">
          &copy; Borchetta Entertainment Group, LLC d/b/a Big Machine Records
        </p>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
          {FOOTER_LINKS.map((link, i) => (
            <span key={link.label} className="flex items-center">
              {i > 0 && <span className="text-white/50 text-xs mx-2">|</span>}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-adobe text-xs text-white hover:opacity-70 transition-opacity"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
