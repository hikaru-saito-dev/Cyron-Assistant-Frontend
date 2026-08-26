import type { PropsWithChildren, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Shared rhythm for every marketing section: amber eyebrow, display heading,
 * muted lede. Keeps vertical spacing and type scale consistent across pages.
 */
export function SectionShell({
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
  headerClassName,
  children,
}: PropsWithChildren<{
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  headerClassName?: string;
}>) {
  return (
    <section className={cn('relative bg-transparent py-16 md:py-24', className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal
          className={cn(
            'max-w-3xl',
            align === 'center' && 'mx-auto text-center',
            headerClassName,
          )}
        >
          {eyebrow && (
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-400/90">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white text-balance md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
            {title}
          </h2>
          {lede && (
            <p className="mt-4 text-sm leading-relaxed text-white/55 text-balance md:text-base">
              {lede}
            </p>
          )}
        </Reveal>

        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}

export function Reveal({
  children,
  className,
  delay = 0.1,
}: PropsWithChildren<{ className?: string; delay?: number }>) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Small amber-dotted label used above mockups and inside panel chrome. */
export function MetaTag({
  children,
  tone = 'muted',
  className,
}: PropsWithChildren<{ tone?: 'muted' | 'amber'; className?: string }>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]',
        tone === 'amber' ? 'text-amber-400/90' : 'text-white/35',
        className,
      )}
    >
      {children}
    </span>
  );
}
