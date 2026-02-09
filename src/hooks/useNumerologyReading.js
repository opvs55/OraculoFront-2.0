// src/hooks/useNumerologyReading.js (REFATORADO com useQuery, useMutation e ENVIO DE TOKEN)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Importa o cliente Supabase e o hook de autenticação (VERIFIQUE OS CAMINHOS!)
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, parseApiResponse, buildApiUrl } from '../services/apiClient';

// Define a URL base da API de numerologia
const API_ENDPOINT = API_ENDPOINTS.numerologyReading; // Endpoint base
const RESET_ENDPOINT = API_ENDPOINTS.numerologyReset;

// --- Função da API: BUSCAR Leitura Existente ---
// Usa o cliente Supabase diretamente, respeitando RLS automaticamente se configurado corretamente
const fetchNumerologyReadingAPI = async (userId) => {
  if (!userId) {
    console.log("[useNumerologyReading] fetch: Usuário não logado, retornando null.");
    return null;
  }

  console.log(`[useNumerologyReading] fetch: Buscando leitura existente para user ${userId} via Supabase client`);
  const { data, error } = await supabase
    .from('numerology_readings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error("[useNumerologyReading] fetch: Erro ao buscar leitura existente via client:", error);
    throw new Error('Erro ao buscar sua leitura numerológica.');
  }

  console.log("[useNumerologyReading] fetch: Leitura existente encontrada (ou null):", data);
  return data;
};

// --- Função da API: CALCULAR Nova Leitura (Envia Token) ---
const calculateNumerologyAPI = async ({ birthDate, user }) => {
  if (!user || !user.id) throw new Error("Usuário não autenticado para calcular.");
  if (!birthDate) throw new Error("Data de nascimento é obrigatória para calcular.");

  // Obtém o token da sessão atual do Supabase
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error("[useNumerologyReading] calculate API: Erro ao obter sessão", sessionError);
    throw new Error("Não foi possível obter a sessão do usuário.");
  }
  const token = session.access_token;
  console.log("[useNumerologyReading] calculate API: Token obtido."); // Log para depuração

  console.log("[useNumerologyReading] calculate API: Chamando backend para CALCULAR:", { birthDate, userId: user.id });

  try {
    const response = await fetch(buildApiUrl(API_ENDPOINT), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Envia o token JWT no cabeçalho Authorization
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ birthDate, user }), // Envia data e usuário (backend pode usar ID do token)
    });

    if (response.status === 404) {
      await response.json().catch(() => null);
      console.log("[useNumerologyReading] calculate API: Backend retornou 404 (leitura não existe).");
      return null; // Indica que precisa calcular (ou que data era inválida)
    }

    const data = await parseApiResponse(response);
    console.log("[useNumerologyReading] calculate API: Nova leitura calculada:", data);
    return data;
  } catch (error) {
    console.error("[useNumerologyReading] calculate API: Erro no fetch:", error);
    throw error;
  }
};

// --- Função da API: Resetar Numerologia (Envia Token) ---
const resetNumerologyAPI = async ({ user }) => {
  if (!user || !user.id) throw new Error("Usuário não autenticado para resetar.");

  // Obtém o token da sessão atual do Supabase
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error("[useNumerologyReading] reset API: Erro ao obter sessão", sessionError);
    throw new Error("Não foi possível obter a sessão do usuário.");
  }
  const token = session.access_token;
  console.log("[useNumerologyReading] reset API: Token obtido."); // Log para depuração

  console.log("[useNumerologyReading] reset API: Chamando backend para RESET para user:", user.id);

  try {
    const response = await fetch(buildApiUrl(RESET_ENDPOINT), { // Chama a sub-rota /reset
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Envia o token JWT no cabeçalho Authorization
        'Authorization': `Bearer ${token}`
      },
      // Envia user no corpo (backend pode usar ID do token ou do body)
      body: JSON.stringify({ user }),
    });

    const data = await parseApiResponse(response);
    console.log("[useNumerologyReading] reset API: Reset bem-sucedido:", data);
    return data; // Retorna a mensagem de sucesso
  } catch (error) {
    console.error("[useNumerologyReading] reset API: Erro no fetch:", error);
    throw error;
  }
};

// --- O Hook Customizado (REFATORADO com useQuery + useMutation) ---
export function useNumerologyReading() {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Pega o usuário logado
  const userId = user?.id; // Extrai o ID

  // 1. QUERY para BUSCAR a leitura existente
  const {
    data: numerologyData,
    isLoading: isLoadingReading,
    error: errorLoadingReading,
    refetch: refetchReading
  } = useQuery({
    queryKey: ['numerologyReading', userId], // Chave única por usuário
    queryFn: () => fetchNumerologyReadingAPI(userId), // Função de busca
    enabled: !!userId, // Só busca se logado
    staleTime: 1000 * 60 * 15,
    cacheTime: 1000 * 60 * 60,
    retry: 1
  });

  // 2. MUTATION para CALCULAR uma nova leitura
  const calculationMutation = useMutation({
    mutationFn: calculateNumerologyAPI, // Função que faz o POST com token
    onSuccess: (calculatedData, variables) => {
      console.log("[useNumerologyReading] Mutate Calculate Success:", calculatedData);
      // Atualiza o cache da query com os novos dados
      if (calculatedData) { // Só atualiza se o cálculo retornou dados (não null por 404)
        queryClient.setQueryData(['numerologyReading', variables.user.id], calculatedData);
      }
      // Invalida o perfil para buscar os números atualizados
      queryClient.invalidateQueries({ queryKey: ['profile', variables.user.id] });
    },
    onError: (error) => {
      console.error("[useNumerologyReading] Mutate Calculate Error:", error);
    },
  });

  // 3. MUTATION para RESETAR a leitura
  const resetMutation = useMutation({
    mutationFn: resetNumerologyAPI, // Função que faz o DELETE com token
    onSuccess: (resetResponse, variables) => {
      console.log("[useNumerologyReading] Mutate Reset Success:", resetResponse);
      // Limpa o cache da query (define como null)
      queryClient.setQueryData(['numerologyReading', variables.user.id], null);
      // Invalida o perfil para remover os números
      queryClient.invalidateQueries({ queryKey: ['profile', variables.user.id] });
    },
    onError: (error) => {
      console.error("[useNumerologyReading] Mutate Reset Error:", error);
    },
  });

  // 4. Retorna os estados da query e as funções/estados das mutações
  return {
    // Dados e estados da Query (Busca inicial)
    numerologyData,
    isLoadingReading,
    errorLoadingReading,
    refetchReading,

    // Funções e estados da Mutação de Cálculo
    calculateNumerology: calculationMutation.mutate,
    isCalculating: calculationMutation.isPending,
    errorCalculating: calculationMutation.error,
    isSuccessCalculating: calculationMutation.isSuccess,
    resetCalculationState: calculationMutation.reset,

    // Funções e estados da Mutação de Reset
    resetNumerology: resetMutation.mutate,
    isResetting: resetMutation.isPending,
    errorResetting: resetMutation.error,
    isSuccessResetting: resetMutation.isSuccess,
    resetResetState: resetMutation.reset
  };
}
