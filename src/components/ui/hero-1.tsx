"use client"

import TextLoop from "./text-loop"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

interface HeroProps {
  eyebrow?: string
  staticText?: string
  rotatingTexts?: string[]
  secondaryText?: string
  subtitle: string
  ctaLabel?: string
}

export function Hero({
  eyebrow = "Innovate Without Limits",
  staticText = "Design",
  rotatingTexts = ["Limitless", "Timeless", "Flawless"],
  secondaryText,
  subtitle,
  ctaLabel = "Get Started",
}: HeroProps) {
  const { isAuthenticated, loginWithDiscord } = useAuth()
  const navigate = useNavigate()
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden bg-transparent"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroPopUp {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        .hero-pop-1 {
          opacity: 0;
          animation: heroPopUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
        }
        .hero-pop-2 {
          opacity: 0;
          animation: heroPopUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
        }
        .hero-pop-3 {
          opacity: 0;
          animation: heroPopUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }
        .hero-pop-4 {
          opacity: 0;
          animation: heroPopUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.55s forwards;
        }
      `}} />

      {/* Soft amber lift behind headline (page AtmosphereBackground provides grid) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[28%] h-[420px] w-[680px] -translate-x-1/2 rounded-full blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(245,166,35,0.14) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href="#" className="group hero-pop-1" style={{ position: 'relative', zIndex: 20, display: 'inline-block' }}>
          <span
            className="cyron-glass text-sm mx-auto px-5 py-2 rounded-full w-fit tracking-[0.14em] uppercase flex items-center justify-center font-medium text-white/60 transition-all duration-300 group-hover:border-amber-400/30 group-hover:text-amber-200/90"
            style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace', fontSize: '0.7rem' }}
          >
            {eyebrow}
          </span>
        </a>
      )}

      {/* Title */}
      <div
        className="mt-6 py-6 hero-pop-2"
        style={{ position: 'relative', zIndex: 20 }}
      >
        <TextLoop
          staticText={staticText}
          rotatingTexts={rotatingTexts}
          staticTextClassName="text-white"
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-none tracking-tighter justify-center"
        />
        {secondaryText && (
          <p className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-none tracking-tighter text-white/90 mt-1 text-center">
            {secondaryText}
          </p>
        )}
      </div>

      {/* Subtitle */}
      <p
        className="mb-8 text-lg tracking-tight md:text-xl max-w-3xl mx-auto hero-pop-3 text-white/55"
        style={{ position: 'relative', zIndex: 20 }}
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex flex-wrap justify-center items-center gap-4 hero-pop-4" style={{ position: 'relative', zIndex: 20 }}>
          <button
            type="button"
            className="cyron-btn-primary"
            onClick={() => {
              if (isAuthenticated) {
                navigate("/dashboard")
              } else {
                loginWithDiscord()
              }
            }}
          >
            {ctaLabel}
          </button>
          <a href="/docs" className="cyron-btn-ghost">
            Docs
          </a>
        </div>
      )}

      <div className="relative mt-28" />
    </section>
  )
}
