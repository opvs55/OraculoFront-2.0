/**
 * Converte uma string para um formato seguro para URLs e nomes de arquivos.
 * Ex: "Ás de Copas" => "as-de-copas"
 * @param {string} text O texto a ser normalizado.
 * @returns {string} O texto normalizado.
 */
export function normalizeTextForPath(text) {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    // Remove acentos e diacríticos
    .normalize('NFD') 
    .replace(/[\u0300-\u036f]/g, '')
    // Substitui espaços por hífens
    .replace(/\s+/g, '-')
    // Remove qualquer caractere que não seja letra, número ou hífen
    .replace(/[^a-z0-9-]/g, '');
}