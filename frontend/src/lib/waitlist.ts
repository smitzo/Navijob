import { getBrowserSupabase } from "./supabase";

export type WaitlistLeadInput = {
  full_name: string;
  email: string;
  phone?: string;
  current_status?: string;
  interest?: string;
  source?: string;
};

export async function submitWaitlistLead(input: WaitlistLeadInput) {
  const supabase = getBrowserSupabase();

  const { error } = await supabase.from("waitlist_leads").insert({
    full_name: input.full_name,
    email: input.email,
    phone: input.phone || null,
    current_status: input.current_status || null,
    interest: input.interest || null,
    source: input.source || "landing_page",
  });

  if (error) {
    throw error;
  }
}
