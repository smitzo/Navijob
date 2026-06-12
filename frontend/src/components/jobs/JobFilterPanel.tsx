import { Button } from "@/components/ui/Button";
import { SelectInput, TextInput } from "@/components/ui/FormField";

export type JobFilters = {
  query: string;
  location: string;
  workMode: string;
  jobType: string;
  techStack: string;
  experience: string;
  salary: string;
};

type JobFilterPanelProps = {
  filters: JobFilters;
  locations: string[];
  techStacks: string[];
  onChange: (filters: JobFilters) => void;
  onReset: () => void;
};

export const defaultJobFilters: JobFilters = {
  query: "",
  location: "",
  workMode: "",
  jobType: "",
  techStack: "",
  experience: "",
  salary: "",
};

export function JobFilterPanel({
  filters,
  locations,
  techStacks,
  onChange,
  onReset,
}: JobFilterPanelProps) {
  function updateFilter(field: keyof JobFilters, value: string) {
    onChange({
      ...filters,
      [field]: value,
    });
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-200/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Filters</h2>
          <p className="text-sm leading-6 text-zinc-600">
            Narrow roles by location, experience, stack, work mode, and salary.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TextInput
          label="Search"
          value={filters.query}
          onChange={(event) => updateFilter("query", event.target.value)}
          placeholder="AI, fullstack, company..."
        />

        <SelectInput
          label="Location"
          value={filters.location}
          onChange={(event) => updateFilter("location", event.target.value)}
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </SelectInput>

        <SelectInput
          label="Work mode"
          value={filters.workMode}
          onChange={(event) => updateFilter("workMode", event.target.value)}
        >
          <option value="">Any mode</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </SelectInput>

        <SelectInput
          label="Job type"
          value={filters.jobType}
          onChange={(event) => updateFilter("jobType", event.target.value)}
        >
          <option value="">Any type</option>
          <option value="full_time">Full-time</option>
          <option value="internship">Internship</option>
        </SelectInput>

        <SelectInput
          label="Tech stack"
          value={filters.techStack}
          onChange={(event) => updateFilter("techStack", event.target.value)}
        >
          <option value="">Any stack</option>
          {techStacks.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </SelectInput>

        <SelectInput
          label="Experience required"
          value={filters.experience}
          onChange={(event) => updateFilter("experience", event.target.value)}
        >
          <option value="">Any experience</option>
          <option value="0">Intern/fresher friendly</option>
          <option value="1">1+ years</option>
          <option value="2">2+ years</option>
          <option value="3">3+ years</option>
          <option value="4">4+ years</option>
        </SelectInput>

        <SelectInput
          label="Minimum salary"
          value={filters.salary}
          onChange={(event) => updateFilter("salary", event.target.value)}
        >
          <option value="">Any salary</option>
          <option value="360000">30k+/month or equivalent</option>
          <option value="600000">50k+/month or equivalent</option>
          <option value="1000000">10 LPA+</option>
          <option value="1800000">18 LPA+</option>
          <option value="2500000">25 LPA+</option>
        </SelectInput>
      </div>
    </section>
  );
}
