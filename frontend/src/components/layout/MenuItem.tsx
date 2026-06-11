import Link from "next/link";

type MenuItemProps = {
  href: string;
  label: string;
  active?: boolean;
};

export function MenuItem({ href, label, active = false }: MenuItemProps) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
      }`}
    >
      {label}
    </Link>
  );
}
