import { cn } from '@/lib/utils';

const gradients = [
  'from-violet-500 to-indigo-500',
  'from-sky-500 to-cyan-400',
  'from-emerald-500 to-teal-400',
  'from-amber-500 to-orange-400',
  'from-rose-500 to-pink-500',
  'from-fuchsia-500 to-purple-500',
];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
  return (
    <span
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[11px] font-semibold text-white ring-2 ring-surface',
        gradients[hash(name) % gradients.length],
        className,
      )}
      aria-hidden
    >
      {initials || '?'}
    </span>
  );
}
