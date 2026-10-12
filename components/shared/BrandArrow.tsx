import { cn } from '@/lib/utils';

/**
 * The PLACE.IL chevron (from the logo) drawn as two parallel outline strokes,
 * as on the brand-book cover. Purely decorative: size it with height classes,
 * colour comes from `currentColor`. Points in the Hebrew reading direction in
 * both locales — the brand never mirrors it.
 */
const ARROW_PATH =
  'M41.02,93.80L28.05,94.01L11.00,74.13C5.52,67.73 1.84,60.31 0.86,51.85C0.00,44.38 1.03,36.72 5.35,30.50L26.55,0.00L38.95,0.10L13.90,35.49C8.11,45.37 10.81,56.08 17.52,65.11L41.02,93.80';

export function BrandArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 57 94.01"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('block w-auto overflow-visible', className)}
    >
      <path d={ARROW_PATH} stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      <path
        d={ARROW_PATH}
        transform="translate(16 0)"
        stroke="currentColor"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        opacity={0.45}
      />
    </svg>
  );
}
