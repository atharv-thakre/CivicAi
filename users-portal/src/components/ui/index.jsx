import React from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

export const Card = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-2xl overflow-hidden shadow-2xl transition-all duration-300",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const Button = React.forwardRef(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-vision-accent text-white hover:opacity-90 shadow-lg shadow-blue-500/20 active:scale-95 transition-all font-bold uppercase tracking-tight',
      secondary: 'bg-black/5 dark:bg-white/10 text-[var(--text)] dark:text-white hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all font-bold uppercase tracking-tight backdrop-blur-sm border border-[var(--border)]',
      outline: 'bg-transparent border border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)] active:scale-95 transition-all font-bold uppercase tracking-tight',
      ghost: 'bg-transparent text-vision-slate-400 hover:text-[var(--text)] active:scale-95 transition-all font-bold uppercase tracking-tight',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all font-bold uppercase tracking-tight shadow-lg shadow-red-500/20',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[10px] rounded-xl',
      md: 'px-6 py-2.5 text-xs rounded-xl',
      lg: 'px-8 py-3.5 text-sm rounded-2xl',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export const Badge = ({ children, className }) => (
  <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight rounded-lg border flex items-center justify-center", className)}>
    {children}
  </span>
);

export const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-xl lg:text-2xl font-bold tracking-tight leading-tight uppercase">{children}</h2>
    {subtitle && <p className="text-xs text-vision-slate-400 mt-1 font-medium tracking-normal">{subtitle}</p>}
  </div>
);

export const MotionCard = (props) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  />
);
