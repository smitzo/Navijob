"use client";
import { CareerRecords, type RecordField } from "./CareerRecords";
const year = new Date().getFullYear();
const fields: RecordField[] = [
  { name: "institution", label: "School, college or institution", required: true, maxLength: 180 },
  { name: "qualification", label: "Degree or qualification", required: true, maxLength: 180 },
  { name: "field_of_study", label: "Field of study", maxLength: 180 },
  { name: "start_year", label: "Start year", type: "number", required: true, min: 1900, max: year },
  { name: "end_year", label: "Completion or expected graduation year", type: "number", nullable: true, min: 1900, max: year + 8, hint: "An expected graduation year is fine if you’re still studying." },
  { name: "is_current", label: "I’m currently studying here", type: "checkbox" },
  { name: "description", label: "Relevant work, activities or achievements", type: "textarea", maxLength: 2000 },
];
export function EducationEditor() { return <CareerRecords config={{ title: "Your education", description: "Formal study, qualifications and the work that shaped your foundations.", endpoint: "me/education/", titleKey: "qualification", subtitleKey: "institution", fields, emptyTitle: "Add the learning behind your work." }} />; }
