import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <section className={`rounded-lg border border-zinc-200 bg-white shadow-sm shadow-zinc-200/70 ${className}`}>
      {children}
    </section>
  );
}
