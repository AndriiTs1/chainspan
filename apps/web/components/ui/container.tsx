import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={["mx-auto w-full max-w-375 px-6 lg:px-10", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
