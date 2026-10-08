"use client";
import { CareerRecords, type RecordField } from "./CareerRecords";
const fields: RecordField[] = [
  { name: "title", label: "Project name", required: true, maxLength: 180 },
  { name: "description", label: "What does it do?", required: true, type: "textarea", maxLength: 4000 },
  { name: "contribution", label: "What did you build or contribute?", type: "textarea", maxLength: 3000, hint: "Explain your own role, especially for team projects." },
  { name: "stage", label: "Current stage", type: "select", options: [["idea", "Idea"], ["prototype", "Prototype"], ["live", "Live"], ["archived", "Archived"]] },
  { name: "stack", label: "Tools and technologies", type: "list", hint: "Separate tools with commas, up to 30 items." },
  { name: "source_url", label: "Source code URL (optional)", type: "url" },
  { name: "demo_url", label: "Live demo URL (optional)", type: "url" },
];
export function ProjectsEditor() { return <CareerRecords config={{ title: "The work behind your skills", description: "Describe your contribution and where each project stands. These are candidate-supplied examples, not independent skill verification.", endpoint: "me/projects/", titleKey: "title", subtitleKey: "stage", fields, emptyTitle: "Give your work a place to speak." }} />; }
