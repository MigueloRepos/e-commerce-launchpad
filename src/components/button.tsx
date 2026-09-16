import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "icon" };
export function Button({ variant = "primary", className, ...props }: Props) {
  const styles =
    variant === "outline"
      ? "border border-border bg-background text-foreground hover:bg-muted"
      : variant === "icon"
        ? "bg-transparent text-primary hover:bg-muted"
        : "bg-primary text-primary-foreground hover:bg-primary-hover";
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        styles,
        className,
      )}
      {...props}
    />
  );
}
