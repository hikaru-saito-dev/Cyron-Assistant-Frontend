"use client"

import { ChevronRight } from "lucide-react"
import TextLoop from "./text-loop"
import { ShinyButton } from "./shiny-button"
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
      min-h-[calc(100vh-40px)] overflow-hidden 
      rounded-b-xl"
      style={{ background: 'linear-gradient(to bottom, #000, transparent 30%, #898e8e 78%, #ffffff 99%)' }}
    >
      {/* Pop-up animation keyframes */}
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
        @keyframes heroGridFade {
          0% { opacity: 0; }
          100% { opacity: 0.8; }
        }
        @keyframes heroCurveRise {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(120px) scale(0.9);
            filter: blur(12px);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
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
        .hero-grid-anim {
          opacity: 0;
          animation: heroGridFade 1.5s ease-out 0s forwards;
        }
        .hero-curve-anim {
          opacity: 0;
          animation: heroCurveRise 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
        }
      `}} />

      {/* Grid BG */}
      <div
        className="absolute inset-0 h-full w-full hero-grid-anim"
        style={{
          zIndex: 0,
          backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
          backgroundSize: '6rem 5rem',
        }}
      />

      {/* Radial Accent */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[100%] hero-curve-anim"
        style={{
          top: 'calc(100% - 150px)',
          height: '500px',
          width: '700px',
          background: 'radial-gradient(closest-side, #000 82%, #ffffff)',
          zIndex: 1,
        }}
      />
      {/* Responsive overrides for radial accent via a larger pseudo-element approach */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[100%] hidden md:block hero-curve-anim"
        style={{
          top: 'calc(100% - 120px)',
          height: '500px',
          width: '1100px',
          background: 'radial-gradient(closest-side, #000 82%, #ffffff)',
          zIndex: 1,
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[100%] hidden lg:block hero-curve-anim"
        style={{
          top: 'calc(100% - 180px)',
          height: '750px',
          width: '140%',
          background: 'radial-gradient(closest-side, #000 82%, #ffffff)',
          zIndex: 1,
        }}
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href="#" className="group hero-pop-1 mt-6" style={{ position: 'relative', zIndex: 20, display: 'inline-block' }}>
          <span
            className="text-sm mx-auto px-5 py-2 rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
            style={{
              color: '#9ca3af',
              border: '2px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(to top right, rgba(212,212,216,0.05), rgba(156,163,175,0.05), transparent)',
            }}
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
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-none tracking-tighter justify-center"
        />
        {secondaryText && (
          <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-none tracking-tighter text-white mt-1 text-center">
            {secondaryText}
          </p>
        )}
      </div>

      {/* Subtitle */}
      <p
        className="mb-6 text-lg tracking-tight md:text-xl max-w-3xl mx-auto hero-pop-3"
        style={{ position: 'relative', zIndex: 20, color: '#9ca3af' }}
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex justify-center items-center gap-4 hero-pop-4" style={{ position: 'relative', zIndex: 20 }}>
          <ShinyButton
            onClick={() => {
              if (isAuthenticated) {
                navigate("/dashboard")
              } else {
                loginWithDiscord()
              }
            }}
          >
            {ctaLabel}
          </ShinyButton>
          <a
            href="/docs"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            Docs
          </a>
        </div>
      )}

      {/* Bottom Fade */}
      <div
        className="relative mt-32"
        style={{
          perspective: '2000px',
        }}
      />
    </section>
  )
}
