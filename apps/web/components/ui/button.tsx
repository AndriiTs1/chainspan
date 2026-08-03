import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-linear-to-r from-blue-600 to-violet-600 shadow-[0_0_42px_rgba(79,70,229,0.4)] text-white",
    secondary:
      "border border-white/15 bg-white/4 text-zinc-200 backdrop-blur-xl",
  };

  return (
    <button
      className={[
        "flex h-12 items-center justify-center rounded-xl px-7 font-medium transition",
        "hover:scale-[1.03]",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
