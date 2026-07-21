import { invitation } from "@/data/invitation";
import { cn } from "@/lib/utils";

interface MonogramProps {
  className?: string;
  size?: number;
  /** Lingkaran hairline emas mengelilingi inisial. */
  ring?: boolean;
}

/**
 * Signature element (spec §1): inisial pasangan dalam lingkaran tipis emas.
 * Muncul di preloader, lalu jadi motif hairline berulang antar section.
 * Warna & font di-derive dari token — konsisten = terasa satu tangan.
 */
export function Monogram({ className, size = 88, ring = true }: MonogramProps) {
  const { groom, bride } = invitation.couple;
  const g = groom.nickname.charAt(0).toUpperCase();
  const b = bride.nickname.charAt(0).toUpperCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label={`Monogram ${g} dan ${b}`}
      className={cn("select-none", className)}
    >
      {ring && (
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="var(--color-gold)"
          strokeWidth="0.75"
        />
      )}
      <text
        x="33"
        y="59"
        textAnchor="middle"
        fill="var(--color-gold)"
        style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 500 }}
      >
        {g}
      </text>
      <text
        x="50"
        y="61"
        textAnchor="middle"
        fill="var(--color-gold-soft)"
        style={{ fontFamily: "var(--font-signature)", fontSize: 30 }}
      >
        &amp;
      </text>
      <text
        x="67"
        y="59"
        textAnchor="middle"
        fill="var(--color-gold)"
        style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 500 }}
      >
        {b}
      </text>
    </svg>
  );
}
