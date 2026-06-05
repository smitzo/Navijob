type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function FeatureCard({ eyebrow, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/85 p-5 shadow-sm shadow-zinc-200/70">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-lg font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
    </div>
  );
}
