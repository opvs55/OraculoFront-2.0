// src/components/numerology/NumerologyResults.jsx (NOVO COMPONENTE)
import React from 'react';
import styles from '../../pages/NumerologyPage.module.css'; // Reutiliza os estilos da página

// --- Função Auxiliar (Movida para cá) ---
// Função para renderizar texto com quebras de linha e destaques (**negrito**)
const renderFormattedText = (text) => {
  if (!text) return null; // Retorna null em vez de <p> para não renderizar secções vazias
  const regex = /\*\*(.*?)\*\*/g;
  
  // Adiciona a classe meaningText aqui
  return (
    <div className={styles.meaningText}>
      {text.split('\n').map((paragraph, pIndex) => {
        const trimmedParagraph = paragraph.trim();
        if (!trimmedParagraph) return null;
        
        const parts = trimmedParagraph.split(regex);
        return (
          <p key={pIndex}>
            {parts.map((part, partIndex) =>
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
};

// --- Componente de Resultados ---
function NumerologyResults({ resultData, onReset, isResetting, errorResetting }) {

  // --- 1. Lógica de Parsing (Caminho de Vida) ---
  const lifePathParts = {
    essence: resultData?.life_path_meaning?.split('* **')[0]?.trim() || '',
    light: resultData?.life_path_meaning?.match(/\* \*\*Luz:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || '',
    shadow: resultData?.life_path_meaning?.match(/\* \*\*Sombra:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || '',
    mission: resultData?.life_path_meaning?.match(/\* \*\*Missão:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || ''
  };
  // Limpeza extra (como no teu original)
  if (lifePathParts.light.startsWith('Luz:**')) lifePathParts.light = lifePathParts.light.substring(6).trim();
  if (lifePathParts.shadow.startsWith('Sombra:**')) lifePathParts.shadow = lifePathParts.shadow.substring(9).trim();
  if (lifePathParts.mission.startsWith('Missão:**')) lifePathParts.mission = lifePathParts.mission.substring(9).trim();

  // --- 2. Lógica de Parsing (Data) ---
  const dateStr = resultData?.input_birth_date;
  const dateObj = dateStr ? new Date(dateStr + 'T00:00:00') : null;
  const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
  const formattedDate = isValidDate ? dateObj.toLocaleString('pt-BR') : 'Data Inválida';
  const dayOfMonth = isValidDate ? dateObj.getDate() : 'NaN';

  // --- 3. LÓGICA DE PARSING (Arquétipo Secreto) ---
  // Esta é a chave: lida com JSON novo e texto antigo
  let archetypeData = null;
  let archetypeParseError = null;
  const rawArchetypeText = resultData?.birthday_secret_meaning;

  if (rawArchetypeText) {
    try {
      // Tenta parsear como JSON (novo formato)
      archetypeData = JSON.parse(rawArchetypeText);
    } catch (error) {
      // Falhou? É texto antigo (retrocompatibilidade)
      // ou um JSON de erro do backend
      if (rawArchetypeText.startsWith('{"error":')) {
         archetypeParseError = JSON.parse(rawArchetypeText).error;
      } else {
         // É só texto antigo
         archetypeData = { 
           archetype_title: "O Arquétipo do Seu Dia de Nascimento",
           archetype_description: rawArchetypeText,
           // Define os outros campos como null para não renderizar
           numerology_details: null,
           tarot_card: null,
           advice: null,
           strengths: [],
           weaknesses: []
         };
      }
      console.warn('Falha ao interpretar o arquétipo secreto:', error);
    }
  }

  // --- Componentes de Renderização Internos ---

  const renderArchetypeCard = () => {
    if (archetypeParseError) {
      return (
        <div className={`${styles.resultCard} ${styles.secretMeaningCard}`}>
          <h3 className={styles.cardTitle}>O Arquétipo do Seu Dia de Nascimento</h3>
          <p className={styles.errorMessage}>{archetypeParseError}</p>
        </div>
      );
    }

    if (!archetypeData) return null;

    // Se é texto antigo, usa o estilo antigo
    if (!archetypeData.numerology_details) {
      return (
         <div className={`${styles.resultCard} ${styles.secretMeaningCard}`}>
           <h3 className={styles.cardTitle}>{archetypeData.archetype_title}</h3>
           <div className={styles.cardSubSection}>
             {renderFormattedText(archetypeData.archetype_description)}
           </div>
         </div>
      );
    }

    // --- Se for JSON (NOVO LAYOUT DE GRELHA) ---
    return (
      <div className={`${styles.resultCard} ${styles.secretMeaningCard}`}>
        <h3 className={styles.cardTitle}>{archetypeData.archetype_title || "O Arquétipo do Seu Dia de Nascimento"}</h3>
        
        {/* Container da Grelha */}
        <div className={styles.archetypeGridContainer}>
          
          {/* Coluna Principal (Esquerda) */}
          <div className={styles.archetypeMain}>
            <div className={styles.archetypeSection}>
              {renderFormattedText(archetypeData.archetype_description)}
            </div>
            
            {archetypeData.numerology_details && (
              <div className={styles.archetypeSection}>
                <h4>Numerologia e Planetas</h4>
                {renderFormattedText(archetypeData.numerology_details)}
              </div>
            )}
            
            {archetypeData.tarot_card && (
              <div className={styles.archetypeSection}>
                <h4>Tarot</h4>
                {renderFormattedText(archetypeData.tarot_card)}
              </div>
            )}
          </div>
          
          {/* Coluna Lateral (Direita) */}
          <div className={styles.archetypeSidebar}>
            {archetypeData.advice && (
              <div className={`${styles.archetypeListCard} ${styles.adviceCard}`}>
                <h5>Conselho</h5>
                {renderFormattedText(archetypeData.advice)}
              </div>
            )}
            
            {archetypeData.strengths?.length > 0 && (
              <div className={`${styles.archetypeListCard} ${styles.strengthsCard}`}>
                <h5>Pontos Fortes</h5>
                <ul className={styles.archetypeList}>
                  {archetypeData.strengths.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
            
            {archetypeData.weaknesses?.length > 0 && (
              <div className={`${styles.archetypeListCard} ${styles.weaknessesCard}`}>
                <h5>Pontos Fracos</h5>
                <ul className={styles.archetypeList}>
                  {archetypeData.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
          
        </div> {/* Fim .archetypeGridContainer */}
      </div>
    );
  };


  // --- Renderização Principal dos Resultados ---
  return (
    <div className={styles.resultsContainer}>
      <div className={styles.lifePathNumberDisplay}>
        {resultData?.life_path_number ?? '?'}
      </div>
      <div className={styles.resultContent}>
        <h2 className={styles.resultTitle}>Sua Análise Numerológica</h2>
        <p className={styles.resultDate}>Data Analisada: {formattedDate}</p>
        {resultData?.warning && <p className={styles.warningMessage}>{resultData.warning}</p>}

        {/* Card: Caminho de Vida (sempre primeiro) */}
        <div className={`${styles.resultCard} ${styles.lifePathCard}`}>
          <h3 className={styles.cardTitle}>
            Caminho de Vida: {resultData?.life_path_number ?? 'N/A'}
          </h3>
          <div className={styles.cardSubSection}>
            <h4>Essência da Jornada:</h4>
            {renderFormattedText(lifePathParts.essence)}
          </div>
          {lifePathParts.light && (<div className={styles.cardSubSection}> <h4 className={styles.lightTitle}>Luz:</h4> {renderFormattedText(lifePathParts.light)} </div>)}
          {lifePathParts.shadow && (<div className={styles.cardSubSection}> <h4 className={styles.shadowTitle}>Sombra:</h4> {renderFormattedText(lifePathParts.shadow)} </div>)}
          {lifePathParts.mission && (<div className={styles.cardSubSection}> <h4 className={styles.missionTitle}>Missão:</h4> {renderFormattedText(lifePathParts.mission)} </div>)}
        </div>

        {/* Card: Número do Aniversário */}
        <div className={`${styles.resultCard} ${styles.birthdayCard}`}>
          <h3 className={styles.cardTitle}>Número do Aniversário: {resultData?.birthday_number ?? 'N/A'} (Dia {dayOfMonth})</h3>
          <div className={styles.cardSubSection}>
            {renderFormattedText(resultData?.birthday_meaning || 'Significado não disponível.')}
          </div>
        </div>
        
        {/* Card: Significado Secreto (Agora com Grelha) */}
        {renderArchetypeCard()}

      </div> {/* Fim .resultContent */}

      {/* Botão Reset */}
      <div className={styles.resultActions}>
        <button onClick={onReset} className={styles.resetButton} disabled={isResetting}>
          {isResetting ? 'Apagando...' : 'Apagar Leitura (Resetar)'}
        </button>
      </div>
      {errorResetting && <p className={`${styles.errorMessage} ${styles.resetError}`}>Erro ao apagar: {errorResetting.message}</p>}
    </div> // Fim .resultsContainer
  );
}

export default NumerologyResults;
