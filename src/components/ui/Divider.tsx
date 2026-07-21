import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  /** Ornamen belah ketupat emas di tengah. */
  ornament?: boolean;
  /** Panjang tiap sisi garis. */
  width?: "sm" | "md" | "lg";
}

const WIDTHS = { sm: "w-10", md: "w-16", lg: "w-24" } as const;

/**
 * Hairline emas antar section (spec §1 signature motif).
 * Dua garis tipis warna --line dengan belah ketupat emas di tengah.
 */
export function Divider({ className, ornament = true, width = "md" }: DividerProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn("flex items-center justify-center gap-4", className)}
    >
      <span className={cn("h-px bg-line", WIDTHS[width])} />
      {ornament && (
        <span className="block h-1.5 w-1.5 rotate-45 border border-gold" />
      )}
      <span className={cn("h-px bg-line", WIDTHS[width])} />
    </div>
  );
}
