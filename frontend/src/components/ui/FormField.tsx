import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

type BaseFieldProps = {
  label: string;
  helper?: string;
};

type TextInputProps = BaseFieldProps & InputHTMLAttributes<HTMLInputElement>;

type SelectInputProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    children: ReactNode;
  };

const inputClasses =
  "mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100";

export function TextInput({ label, helper, ...props }: TextInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <input className={inputClasses} {...props} />
      {helper && <span className="mt-1 block text-xs leading-5 text-zinc-500">{helper}</span>}
    </label>
  );
}

export function SelectInput({ label, helper, children, ...props }: SelectInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-zinc-800">{label}</span>
      <select className={inputClasses} {...props}>
        {children}
      </select>
      {helper && <span className="mt-1 block text-xs leading-5 text-zinc-500">{helper}</span>}
    </label>
  );
}
