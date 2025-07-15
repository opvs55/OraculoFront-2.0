// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Esta verificação garante que a aplicação pare com um erro claro se as chaves não forem definidas.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("ERRO CRÍTICO: Variáveis de ambiente do Supabase (VITE_SUPABASE_URL e/ou VITE_SUPABASE_ANON_KEY) não foram encontradas. Verifique seu arquivo .env e reinicie o servidor.");
}

// Esta linha cria e exporta uma ÚNICA instância do cliente para toda a sua aplicação.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)