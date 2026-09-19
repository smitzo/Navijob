"use client";

import Link from "next/link";
import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";

export function ActionButton({ variant = "primary", className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "quiet"; children: ReactNode }) {
  return <button className={`button button--${variant} ${className}`} {...props}>{children}</button>;
}

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: ReactNode; variant?: "primary" | "outline" | "quiet" }) {
  return <Link className={`button button--${variant}`} href={href}>{children}</Link>;
}

type FieldProps = { label: string; hint?: string; error?: string };

export function InputField({ label, hint, error, id, className = "", ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return <div className={`field ${className}`}><label htmlFor={fieldId}>{label}</label><input id={fieldId} aria-invalid={!!error} aria-describedby={hint || error ? `${fieldId}-help` : undefined} {...props} />{(error || hint) && <small id={`${fieldId}-help`} className={error ? "field-error" : "muted"}>{error || hint}</small>}</div>;
}

export function TextAreaField({ label, hint, error, id, ...props }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return <div className="field"><label htmlFor={fieldId}>{label}</label><textarea id={fieldId} aria-invalid={!!error} aria-describedby={hint || error ? `${fieldId}-help` : undefined} {...props} />{(hint || error) && <small id={`${fieldId}-help`} className={error ? "field-error" : "muted"}>{error || hint}</small>}</div>;
}

export function SelectField({ label, hint, error, id, children, ...props }: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  return <div className="field"><label htmlFor={fieldId}>{label}</label><select id={fieldId} aria-invalid={!!error} aria-describedby={hint || error ? `${fieldId}-help` : undefined} {...props}>{children}</select>{(hint || error) && <small id={`${fieldId}-help`} className={error ? "field-error" : "muted"}>{error || hint}</small>}</div>;
}

export function Notice({ children, kind = "info" }: { children: ReactNode; kind?: "info" | "error" | "success" }) {
  return <div className={`notice notice--${kind}`} role={kind === "error" ? "alert" : "status"}>{children}</div>;
}

export function LoadingState({ label = "Loading your workspace…" }: { label?: string }) {
  return <div className="loading-state" role="status"><span className="loading-dot" aria-hidden="true" />{label}</div>;
}

export function EmptyState({ title, children, href, action }: { title: string; children: ReactNode; href?: string; action?: string }) {
  return <div className="empty-state"><span className="empty-mark" aria-hidden="true">↗</span><h2>{title}</h2><p className="muted">{children}</p>{href && action && <ButtonLink href={href} variant="outline">{action}</ButtonLink>}</div>;
}
