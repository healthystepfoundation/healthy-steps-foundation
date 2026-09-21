'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, type Variants } from 'framer-motion';
import { Menu, X, ChevronDown, Heart, ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import type { ProgramView } from '@/types';
import { ProgramIcon } from '@/lib/icons';
import { subscribeToScroll } from '@/lib/scroll';
import { cn } from '@/lib/utils';

const ABOUT_LINKS = [
  { href: '/about', label: 'About Us', desc: 'Who we are and why we started' },
  { href: '/staff', label: 'Our Staff', desc: 'The people behind the work' },
] as const;

const SIMPLE_LINKS = [
  { href: '/get-help', label: 'Get Help' },
  { href: '/stories', label: 'Stories' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
] as const;

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, y: 6, scale: 0.99, transition: { duration: 0.14 } },
};

/** Shared trigger styling for both the dropdown buttons and the flat links. */
function navItemClasses(active: boolean): string {
  return cn(
    'relative flex items-center gap-1 text-[1.0625rem] font-medium py-2 transition-colors duration-200',
    active ? 'text-forest-green-600' : 'text-warm-gray-700 hover:text-forest-green-600',
  );
}

/** The amber underline that slides under the active / hovered nav item. */
function NavUnderline({ active }: { active: boolean }): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-amber-500',
        'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        active ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100 group-focus-within/nav:scale-x-100',
      )}
    />
  );
}

interface DropdownProps {
  label: string;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  panelClassName?: string;
  children: React.ReactNode;
}

/**
 * Hover-and-focus dropdown. Opens on pointer enter for mice, on click/Enter for
 * keyboards and touch, and closes on Escape or when focus leaves the group —
 * the old CSS-only `group-hover` version was unreachable by keyboard entirely.
 */
function NavDropdown({
  label,
  active,
  open,
  onOpen,
  onClose,
  panelClassName,
  children,
}: DropdownProps): React.JSX.Element {
  return (
    <div
      className="group/nav relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
        className={navItemClasses(active || open)}
      >
        {label}
        <ChevronDown
          size={15}
          className={cn('transition-transform duration-300', open && 'rotate-180')}
        />
        <NavUnderline active={active} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute top-full left-1/2 z-50 -translate-x-1/2 pt-4',
              panelClassName,
            )}
          >
            <div className="overflow-hidden rounded-2xl border border-warm-gray-200/80 bg-white/95 shadow-float backdrop-blur-xl">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header({ programs }: { programs: ProgramView[] }): React.JSX.Element {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<'about' | 'programs' | null>(null);
  const [openMenu, setOpenMenu] = useState<'about' | 'programs' | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reading-progress bar along the bottom edge of the bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 240, damping: 40, mass: 0.3 });

  // Hysteresis on the compress threshold: collapsing removes ~56px of header
  // height, which itself shifts scrollY (scroll anchoring, short pages). A
  // single cutoff lets that shift flip the state straight back, so the bar
  // shook. Compress only past 96px, expand only back under 8px — the dead
  // zone between them is wider than the height change, so no feedback loop.
  const scrolledRef = useRef(false);
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => {
      const next = scrolledRef.current ? window.scrollY > 8 : window.scrollY > 96;
      scrolledRef.current = next;
      return next;
    },
    () => false,
  );

  // Any navigation closes every menu. Adjusting state during render rather than
  // in an effect avoids a second render pass with the menus still open.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileGroup(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setMobileOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock the page behind the mobile drawer
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // A short close delay keeps the panel open while the pointer crosses the gap
  // between the trigger and the panel.
  const openMenuNow = useCallback((menu: 'about' | 'programs') => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  }, []);

  const closeMenuSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  }, []);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  const aboutActive = ABOUT_LINKS.some((l) => isActive(l.href));
  const programsActive = isActive('/programs');

  return (
    <>
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled
          ? 'border-b border-warm-gray-200/70 bg-white/80 shadow-soft backdrop-blur-xl backdrop-saturate-150'
          : 'border-b border-transparent bg-white',
      )}
    >
      <div
        className={cn(
          'container mx-auto flex items-center justify-between gap-6 px-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled ? 'py-2' : 'py-4',
        )}
      >
        {/* Logo — shrinks as you scroll so the bar reclaims vertical space */}
        <Link href="/" className="group flex shrink-0 items-center" aria-label="Healthy Steps Foundation home">
          <Image
            src="/HSF_logo.png"
            alt="Healthy Steps Foundation, a path to mental wellness"
            width={440}
            height={126}
            priority
            className={cn(
              'w-auto object-contain transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
              'group-hover:scale-[1.03]',
              scrolled ? 'h-14 sm:h-16 md:h-[4.5rem]' : 'h-20 sm:h-24 md:h-28',
            )}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          <NavDropdown
            label="About"
            active={aboutActive}
            open={openMenu === 'about'}
            onOpen={() => openMenuNow('about')}
            onClose={closeMenuSoon}
            panelClassName="w-[22rem]"
          >
            <div className="p-2">
              {ABOUT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'group/item flex items-start gap-3 rounded-xl px-4 py-3 transition-colors duration-200',
                    isActive(link.href) ? 'bg-forest-green-50' : 'hover:bg-forest-green-50',
                  )}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 transition-transform duration-300 group-hover/item:scale-150" />
                  <span>
                    <span className="block text-sm font-semibold text-warm-gray-900">{link.label}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-warm-gray-500">{link.desc}</span>
                  </span>
                </Link>
              ))}
            </div>
          </NavDropdown>

          <NavDropdown
            label="Programs"
            active={programsActive}
            open={openMenu === 'programs'}
            onOpen={() => openMenuNow('programs')}
            onClose={closeMenuSoon}
            panelClassName="w-[46rem]"
          >
            <div className="grid grid-cols-2 gap-1 p-3">
              {programs.map((program) => (
                  <Link
                    key={program.slug}
                    href={`/programs/${program.slug}`}
                    className={cn(
                      'group/item flex items-start gap-3 rounded-xl p-3 transition-colors duration-200',
                      isActive(`/programs/${program.slug}`)
                        ? 'bg-forest-green-50'
                        : 'hover:bg-forest-green-50',
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-green-50 text-forest-green-600 transition-all duration-300 group-hover/item:bg-forest-green-500 group-hover/item:text-white">
                      <ProgramIcon name={program.icon} size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-warm-gray-900">
                        {program.name}
                      </span>
                      <span className="mt-0.5 block line-clamp-2 text-xs leading-relaxed text-warm-gray-500">
                        {program.shortDescription}
                      </span>
                    </span>
                  </Link>
              ))}
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-between gap-4 border-t border-warm-gray-100 bg-warm-white px-5 py-3.5">
              <p className="text-xs leading-relaxed text-warm-gray-500">
                All support is offered on a temporary, emergency basis.
              </p>
              <Link
                href="/programs"
                className="link-sweep inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-forest-green-600 hover:text-forest-green-700"
              >
                View all programs <ArrowRight size={15} />
              </Link>
            </div>
          </NavDropdown>

          {SIMPLE_LINKS.map((link) => (
            <div key={link.href} className="group/nav relative">
              <Link href={link.href} className={navItemClasses(isActive(link.href))}>
                {link.label}
                <NavUnderline active={isActive(link.href)} />
              </Link>
            </div>
          ))}
        </nav>

        {/* Donate CTA + hamburger */}
        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink href="/donate" size="sm" className="hidden sm:inline-flex">
            <Heart size={15} className="fill-current" />
            Donate
          </ButtonLink>

          <button
            className="rounded-xl p-2.5 text-warm-gray-700 transition-colors hover:bg-warm-gray-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Reading progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-amber-400 via-amber-500 to-forest-green-500"
      />
    </header>

      {/* Mobile drawer — deliberately a sibling of <header>, not a child. The
          header's backdrop-filter makes it a containing block for fixed
          positioning, which would clip the drawer to the header's height. */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden">
            <motion.div
              className="fixed inset-0 z-40 bg-warm-gray-900/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col bg-warm-white shadow-float"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-warm-gray-200 px-5 py-4">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <Image
                    src="/HSF_logo.png"
                    alt="Healthy Steps Foundation"
                    width={200}
                    height={58}
                    className="h-11 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-warm-gray-700 transition-colors hover:bg-warm-gray-100"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-5">
                <MobileLink href="/" label="Home" active={pathname === '/'} onNavigate={() => setMobileOpen(false)} />

                <MobileGroup
                  label="About"
                  open={mobileGroup === 'about'}
                  onToggle={() => setMobileGroup(mobileGroup === 'about' ? null : 'about')}
                >
                  {ABOUT_LINKS.map((link) => (
                    <MobileSubLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </MobileGroup>

                <MobileGroup
                  label="Programs"
                  open={mobileGroup === 'programs'}
                  onToggle={() => setMobileGroup(mobileGroup === 'programs' ? null : 'programs')}
                >
                  <MobileSubLink href="/programs" label="All Programs" onNavigate={() => setMobileOpen(false)} />
                  {programs.map((program) => (
                    <MobileSubLink
                      key={program.slug}
                      href={`/programs/${program.slug}`}
                      label={program.name}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ))}
                </MobileGroup>

                {SIMPLE_LINKS.map((link) => (
                  <MobileLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={isActive(link.href)}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
              </nav>

              <div className="border-t border-warm-gray-200 bg-white px-5 py-5">
                <ButtonLink href="/donate" size="md" className="w-full" onClick={() => setMobileOpen(false)}>
                  <Heart size={16} className="fill-current" />
                  Donate Now
                </ButtonLink>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Mobile drawer pieces ─────────────────────────────────────────────────── */

function MobileLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate: () => void;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold transition-colors',
        active
          ? 'bg-forest-green-50 text-forest-green-700'
          : 'text-warm-gray-800 hover:bg-forest-green-50 hover:text-forest-green-700',
      )}
    >
      {label}
      {active && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
    </Link>
  );
}

function MobileGroup({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-semibold text-warm-gray-800 transition-colors hover:bg-forest-green-50 hover:text-forest-green-700"
      >
        {label}
        <ChevronDown
          size={17}
          className={cn('text-warm-gray-400 transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-4 space-y-0.5 border-l border-warm-gray-200 py-1 pl-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileSubLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block rounded-lg px-4 py-2.5 text-sm font-medium text-warm-gray-600 transition-colors hover:bg-forest-green-50 hover:text-forest-green-700"
    >
      {label}
    </Link>
  );
}
