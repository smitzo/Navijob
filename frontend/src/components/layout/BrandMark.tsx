import { siteConfig } from "@/config/site";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-10 place-items-center rounded-md bg-zinc-950 text-base font-black text-white">
        N
      </div>
      <span className="text-base font-bold text-zinc-950">{siteConfig.name}</span>
    </div>
  );
}
