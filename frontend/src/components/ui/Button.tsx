import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-950 text-white hover:bg-teal-800 disabled:bg-zinc-400",
  secondary: "border border-zinc-300 bg-white text-zinc-900 hover:border-teal-700 hover:text-teal-800",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
};

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-bold transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
