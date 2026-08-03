import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export function Section({
  children,
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={["relative w-full", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}
