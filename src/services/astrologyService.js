const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('ERRO: A variável de ambiente VITE_BACKEND_URL não está definida.');
}

export async function getAstralChart(payload) {
  const API_ENDPOINT = `${BACKEND_URL}/api/astral-chart`;
  console.log('astrologyService: Chamando o endpoint externo:', API_ENDPOINT);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Erro no servidor: ${response.statusText}` }));
      throw new Error(errorData.message || errorData.error || `Erro no servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no astrologyService ao chamar o backend:', error);
    throw error;
  }
}
