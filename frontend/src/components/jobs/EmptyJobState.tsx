import { Button } from "@/components/ui/Button";

type EmptyJobStateProps = {
  onReset: () => void;
};

export function EmptyJobState({ onReset }: EmptyJobStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-zinc-950">No jobs match these filters</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
        Try widening the salary, work mode, experience, or tech stack filters.
      </p>
      <Button type="button" variant="secondary" className="mt-5" onClick={onReset}>
        Clear filters
      </Button>
    </div>
  );
}
