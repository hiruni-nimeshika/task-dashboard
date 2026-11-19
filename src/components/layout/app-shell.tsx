'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, LayoutDashboard, ListChecks, Menu, Moon, Plus, Sun, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListChecks },
  { href: '/tasks/new', label: 'New task', icon: Plus },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '/tasks') return pathname === '/tasks' || (/^\/tasks\/[^/]+/.test(pathname) && pathname !== '/tasks/new');
  return pathname === href;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="flex size-8 items-center justify-center rounded-[10px] bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_4px_12px_-2px_rgb(99_102_241/0.6)]">
        <Check className="size-4.5" strokeWidth={3} aria-hidden />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">TaskFlow</span>
    </Link>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {}
  };
  return (
    <button
      onClick={toggle}
      aria-label="Toggle colour theme"
      className={cn(
        'inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
    >
      <Moon className="size-4 dark:hidden" aria-hidden />
      <Sun className="hidden size-4 dark:block" aria-hidden />
    </button>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary/10 text-primary dark:bg-primary/15'
                  : 'text-muted hover:bg-surface-muted hover:text-foreground',
              )}
            >
              <Icon className={cn('size-4.5', active ? 'text-primary' : 'text-muted group-hover:text-foreground')} aria-hidden />
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function UserCard() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted/60 p-2.5">
      <span className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-indigo-500 text-xs font-semibold text-white">
        YN
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">Your Name</p>
        <p className="truncate text-xs text-muted">Product team</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawer = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = drawer.current;
    if (!d) return;
    if (menuOpen && !d.open) d.showModal();
    if (!menuOpen && d.open) d.close();
  }, [menuOpen]);

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/80 px-4 py-5 backdrop-blur-xl lg:flex">
        <div className="px-2">
          <Logo />
        </div>
        <nav aria-label="Main" className="mt-8 flex-1">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted/80">Workspace</p>
          <NavLinks pathname={pathname} />
        </nav>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted">Appearance</span>
            <ThemeToggle />
          </div>
          <UserCard />
        </div>
      </aside>

      {/* Mobile / tablet top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur-xl lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* Mobile drawer (native dialog: focus trap + Esc for free) */}
      <dialog
        ref={drawer}
        onClose={() => setMenuOpen(false)}
        onClick={(e) => e.target === drawer.current && setMenuOpen(false)}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-dvh w-72 max-w-[85vw] border-l border-border bg-surface p-0 text-foreground backdrop:bg-black/50 backdrop:backdrop-blur-sm lg:hidden"
      >
        <div className="flex h-full flex-col px-4 py-4">
          <div className="flex items-center justify-between px-2">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Main" className="mt-6 flex-1">
            <NavLinks pathname={pathname} onNavigate={() => setMenuOpen(false)} />
          </nav>
          <UserCard />
        </div>
      </dialog>

      <main id="main" className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
