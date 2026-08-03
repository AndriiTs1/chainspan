import { Boxes } from "lucide-react";

type ChainSpanLogoProps = {
  className?: string;
  iconClassName?: string;
};

export function ChainSpanLogo({
  className = "size-10",
  iconClassName = "size-5",
}: ChainSpanLogoProps) {
  return (
    <span
      className={[
        "flex items-center justify-center rounded-xl",
        "border border-blue-400/30",
        "bg-blue-500/10",
        "shadow-[0_0_30px_rgba(59,130,246,0.2)]",
        "backdrop-blur-xl",
        className,
      ].join(" ")}
    >
      <Boxes
        className={["text-blue-400", iconClassName].join(" ")}
        strokeWidth={2}
      />
    </span>
  );
}
