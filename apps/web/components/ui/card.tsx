import type { HTMLAttributes, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-blue-300/10",
        "bg-[#080d19]/75",
        "backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
