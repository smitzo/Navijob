import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type VisitorResponse = {
  count: number;
  mode: "supabase" | "local";
};

const localCounterPath = path.join(os.tmpdir(), "navijob-visitors.json");

async function incrementLocalVisitor(visitorKey: string): Promise<VisitorResponse> {
  let visitors: Record<string, string> = {};

  try {
    const raw = await fs.readFile(localCounterPath, "utf8");
    visitors = JSON.parse(raw);
  } catch {
    visitors = {};
  }

  visitors[visitorKey] = new Date().toISOString();
  await fs.writeFile(localCounterPath, JSON.stringify(visitors, null, 2));

  return {
    count: Object.keys(visitors).length,
    mode: "local",
  };
}

async function incrementSupabaseVisitor(visitorKey: string): Promise<VisitorResponse | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  const { data, error } = await supabase.rpc("record_site_visit", {
    visitor_key_arg: visitorKey,
    source_arg: "coming_soon_landing_page",
  });

  if (error || typeof data !== "number") {
    return null;
  }

  return {
    count: data,
    mode: "supabase",
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const visitorKey = typeof body.visitorKey === "string" ? body.visitorKey : "";

  if (visitorKey.length < 12 || visitorKey.length > 160) {
    return NextResponse.json({ error: "Invalid visitor key." }, { status: 400 });
  }

  const supabaseResult = await incrementSupabaseVisitor(visitorKey);
  const result = supabaseResult || (await incrementLocalVisitor(visitorKey));

  return NextResponse.json(result);
}
