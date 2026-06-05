import { createClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      waitlist_leads: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          current_status: string | null;
          interest: string | null;
          source: string;
          created_at: string;
        };
        Insert: {
          full_name: string;
          email: string;
          phone?: string | null;
          current_status?: string | null;
          interest?: string | null;
          source?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getBrowserSupabase() {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  browserClient = createClient<Database>(supabaseUrl, supabaseKey);
  return browserClient;
}
