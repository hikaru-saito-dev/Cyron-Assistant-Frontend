import React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'primary';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonVariantsOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonVariants({ variant = 'default', size = 'default', className }: ButtonVariantsOptions = {}) {
  const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-[#F5A623] text-[#0a0a0a] border border-[#E8A017]/50 shadow-[0_0_24px_rgba(245,166,35,0.3)] hover:-translate-y-0.5 hover:bg-[#E8A017] hover:shadow-[0_0_36px_rgba(245,166,35,0.45)]',
    default:
      'bg-[#F5A623] text-[#0a0a0a] border border-[#E8A017]/50 shadow-[0_0_20px_rgba(245,166,35,0.25)] hover:-translate-y-0.5 hover:bg-[#E8A017]',
    outline:
      'border border-white/15 bg-white/[0.04] text-white backdrop-blur-md hover:-translate-y-0.5 hover:border-amber-400/30 hover:bg-white/10',
    ghost:
      'text-white/70 hover:text-white hover:bg-white/5 rounded-xl',
  };

  const sizes: Record<ButtonSize, string> = {
    default: 'h-10 px-5 py-2',
    sm: 'h-8 rounded-full px-3.5 text-xs',
    lg: 'h-12 rounded-full px-8 text-base',
    icon: 'h-10 w-10 rounded-full',
  };

  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
