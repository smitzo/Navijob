"use client";
import { CareerRecords, type RecordField } from "./CareerRecords";
const fields: RecordField[] = [
  { name: "title", label: "Role title", required: true, maxLength: 180 },
  { name: "company", label: "Company or organization", required: true, maxLength: 180 },
  { name: "location", label: "Location", maxLength: 160 },
  { name: "start_date", label: "Start date", type: "date", required: true },
  { name: "end_date", label: "End date", type: "date", nullable: true, hint: "Leave empty if you currently work here." },
  { name: "is_current", label: "I currently work here", type: "checkbox" },
  { name: "description", label: "Your work and contribution", type: "textarea", maxLength: 4000 },
];
export function ExperienceEditor() { return <CareerRecords config={{ title: "Your experience", description: "What you worked on, where you contributed and what you learned.", endpoint: "me/experience/", titleKey: "title", subtitleKey: "company", fields, emptyTitle: "There’s room for your first chapter." }} />; }
