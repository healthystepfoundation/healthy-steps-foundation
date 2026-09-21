import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'onDark';
type ButtonSize = 'sm' | 'md' | 'lg';

// Flat fills and plain color transitions on purpose: no gradients, sheen
// sweeps, glows or hover lift. Buttons on established nonprofit sites sit
// still and change color — decoration on a donate button reads as artifice.
const baseClasses =
  'relative font-semibold tracking-tight inline-flex items-center justify-center gap-2 ' +
  'rounded-full whitespace-nowrap select-none ' +
  'transition-colors duration-200 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-amber-400 text-warm-gray-900 shadow-soft ' +
    'hover:bg-amber-500 active:bg-amber-500 focus-visible:outline-amber-600',
  secondary:
    'bg-forest-green-600 text-white shadow-soft ' +
    'hover:bg-forest-green-700 active:bg-forest-green-700 focus-visible:outline-forest-green-600',
  outline:
    'border border-forest-green-500/40 text-forest-green-700 bg-white ' +
    'hover:border-forest-green-500 hover:bg-forest-green-50 ' +
    'active:bg-forest-green-100 focus-visible:outline-forest-green-600',
  ghost:
    'text-forest-green-600 hover:bg-forest-green-50 active:bg-forest-green-100 focus-visible:outline-forest-green-600',
  // For placing on forest-green-900 / photo overlays
  onDark:
    'border border-white/30 text-white bg-white/10 ' +
    'hover:bg-white/20 hover:border-white/50 active:bg-white/25 focus-visible:outline-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-9 py-4 text-base sm:text-lg',
};

/**
 * The raw class string, for the cases neither <Button> nor <ButtonLink> covers —
 * chiefly plain `<a href="tel:…">` / `mailto:` anchors, which must stay real
 * anchors rather than becoming next/link routes.
 */
export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

const buttonClasses = buttonStyles;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps): React.JSX.Element {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

/**
 * A link styled as a button. Use this instead of wrapping <Button> in <Link> —
 * nesting a <button> inside an <a> produces invalid markup and makes the
 * control announce itself twice to screen readers.
 */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonLinkProps): React.JSX.Element {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
