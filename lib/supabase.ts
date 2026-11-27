import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface EventRecord {
  id: string;
  session_id: string;
  event: string;
  payload: Record<string, unknown>;
  created_at: string;
}

// In-memory fallback stores when Supabase credentials are not yet configured
const inMemoryContacts: ContactRecord[] = [];
const inMemoryEvents: EventRecord[] = [];

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseUrl && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey);
  }
  return null;
}

export async function insertContact(
  name: string,
  email: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    const { error } = await client
      .from("contacts")
      .insert([{ name, email, message }]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Fallback to in-memory store
  inMemoryContacts.unshift({
    id: crypto.randomUUID(),
    name,
    email,
    message,
    created_at: new Date().toISOString(),
  });
  return { success: true };
}

export async function insertEvent(
  sessionId: string,
  event: string,
  payload: Record<string, unknown> = {},
): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    const { error } = await client
      .from("events")
      .insert([{ session_id: sessionId, event, payload }]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Fallback to in-memory store
  inMemoryEvents.push({
    id: crypto.randomUUID(),
    session_id: sessionId,
    event,
    payload,
    created_at: new Date().toISOString(),
  });
  return { success: true };
}

export async function getAdminData(): Promise<{
  contacts: ContactRecord[];
  events: EventRecord[];
}> {
  const client = getSupabaseClient();
  if (client) {
    const [{ data: contacts }, { data: events }] = await Promise.all([
      client.from("contacts").select("*").order("created_at", { ascending: false }),
      client.from("events").select("*").order("created_at", { ascending: false }),
    ]);

    return {
      contacts: (contacts as ContactRecord[]) || [],
      events: (events as EventRecord[]) || [],
    };
  }

  return {
    contacts: [...inMemoryContacts],
    events: [...inMemoryEvents],
  };
}
