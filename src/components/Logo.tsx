import { Receipt } from "lucide-react";

const sizes = {
  sm: { box: "h-7 w-7", icon: 15, rounded: "rounded-lg" },
  md: { box: "h-9 w-9", icon: 19, rounded: "rounded-xl" },
  lg: { box: "h-12 w-12", icon: 25, rounded: "rounded-2xl" },
};

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = sizes[size];
  return (
    <div
      className={`flex ${s.box} shrink-0 items-center justify-center ${s.rounded} bg-white text-brand-800 shadow-[var(--shadow-sm)]`}
    >
      <Receipt size={s.icon} strokeWidth={2} />
    </div>
  );
}
