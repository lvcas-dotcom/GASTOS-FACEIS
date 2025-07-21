import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Cria o client **apenas uma vez** (padrão singleton) para evitar múltiplas instâncias
 * quando o bundle é reexecutado no browser em HMR ou navegação.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY precisam estar definidas.",
  )
}

/**
 * Client compartilhado para toda a aplicação (client-side).
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnon)

/**
 * Alias antigos mantidos por compatibilidade.
 * db  ➜ usado no código novo
 * pool ➜ usado em partes legadas
 */
export const db = supabase
export const pool = supabase
