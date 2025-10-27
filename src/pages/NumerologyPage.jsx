// src/pages/numerology/NumerologyPage.jsx (EXIBINDO SIGNIFICADO SECRETO)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Verifique o caminho
import { useNumerologyReading } from '../hooks/useNumerologyReading'; // Verifique o caminho
import NumberLoader from '../components/common/NumberLoader/NumberLoader'; // Verifique o caminho
import styles from './NumerologyPage.module.css';

// --- Função Auxiliar Fora do Componente ---
// Função para renderizar texto com quebras de linha e destaques (**negrito**)
const renderFormattedText = (text) => {
  if (!text) return <p>Informação não disponível.</p>;
  const regex = /\*\*(.*?)\*\*/g;
  return text.split('\n').map((paragraph, pIndex) => {
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
  });
};

// --- Componente Principal ---
function NumerologyPage() {
  const { user } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const [formError, setFormError] = useState(null);

  // Usa o hook refatorado com useQuery + useMutation
  const {
    numerologyData, isLoadingReading, errorLoadingReading, refetchReading,
    calculateNumerology, isCalculating, errorCalculating, isSuccessCalculating, resetCalculationState,
    resetNumerology, isResetting, errorResetting, isSuccessResetting, resetResetState
  } = useNumerologyReading();

  // Efeito para limpar o formulário após reset bem-sucedido
  useEffect(() => {
    if (isSuccessResetting) {
      setBirthDate('');
      setFormError(null);
    }
  }, [isSuccessResetting]);

  // Handler para submeter form (calcular)
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    resetCalculationState();
    resetResetState();

    if (!birthDate) { setFormError("Insira sua data."); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) { setFormError("Formato inválido."); return; }

    if (user) {
      calculateNumerology({ birthDate, user });
    } else {
      setFormError("Você precisa estar logado para calcular.");
    }
  };

  // Handler para resetar leitura
  const handleResetReading = () => {
    if (!user) { alert("Você precisa estar logado."); return; }
    if (window.confirm("Tem certeza que deseja apagar sua leitura? Poderá calcular uma nova.")) {
      resetNumerology({ user });
    }
  };

  // Handler para "Tentar Novamente" / Recarregar
  const handleRetry = () => {
    setBirthDate('');
    setFormError(null);
    resetCalculationState();
    resetResetState();
    if (errorLoadingReading) {
        refetchReading();
    }
  };

  // --- Componentes de Renderização Internos ---

  const renderForm = () => (
    <form onSubmit={handleSubmit} className={styles.numerologyForm}>
      <label htmlFor="birthDate" className={styles.dateLabel}>
        {isSuccessResetting ? "Insira sua data correta para recalcular:" : "Digite sua Data de Nascimento:"}
      </label>
      <input
        type="date" id="birthDate" value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className={styles.dateInput} required pattern="\d{4}-\d{2}-\d{2}"
        disabled={isCalculating || isResetting || isLoadingReading}
      />
      <button
        type="submit"
        disabled={isCalculating || isResetting || isLoadingReading}
        className={styles.submitButton}
      >
        {isCalculating ? 'Calculando...' : 'Revelar meus Números'}
      </button>
      {formError && <p className={styles.errorMessage}>{formError}</p>}
    </form>
  );

  const renderResult = (resultData) => {
    const dateStr = resultData?.input_birth_date;
    const dateObj = dateStr ? new Date(dateStr + 'T00:00:00') : null;
    const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());
    const formattedDate = isValidDate ? dateObj.toLocaleDateString('pt-BR') : 'Data Inválida';
    const dayOfMonth = isValidDate ? dateObj.getDate() : 'NaN';

    // Separa partes do Caminho de Vida
    const lifePathParts = {
        essence: resultData?.life_path_meaning?.split('* **')[0]?.trim() || '',
        light: resultData?.life_path_meaning?.match(/\* \*\*Luz:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || '',
        shadow: resultData?.life_path_meaning?.match(/\* \*\*Sombra:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || '',
        mission: resultData?.life_path_meaning?.match(/\* \*\*Missão:\*\*(.*?)(?=\* \*\*|$)/s)?.[1]?.trim() || ''
    };
    // Limpeza extra
    if (lifePathParts.light.startsWith('Luz:**')) lifePathParts.light = lifePathParts.light.substring(6).trim();
    if (lifePathParts.shadow.startsWith('Sombra:**')) lifePathParts.shadow = lifePathParts.shadow.substring(9).trim();
    if (lifePathParts.mission.startsWith('Missão:**')) lifePathParts.mission = lifePathParts.mission.substring(9).trim();


console.log("--- Birthday Secret Meaning RAW ---");
console.log(resultData?.birthday_secret_meaning);
console.log("--- END RAW ---");

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.lifePathNumberDisplay}>
          {resultData?.life_path_number ?? '?'}
        </div>
        <div className={styles.resultContent}>
          <h2 className={styles.resultTitle}>Sua Análise Numerológica</h2>
          <p className={styles.resultDate}>Data Analisada: {formattedDate}</p>
          {resultData?.warning && <p className={styles.warningMessage}>{resultData.warning}</p>}

          {/* Card: Caminho de Vida */}
          <div className={`${styles.resultCard} ${styles.lifePathCard}`}>
            <h3 className={styles.cardTitle}>
              Caminho de Vida: {resultData?.life_path_number ?? 'N/A'}
            </h3>
            <div className={styles.cardSubSection}>
              <h4>Essência da Jornada:</h4>
              {renderFormattedText(lifePathParts.essence)}
            </div>
            {lifePathParts.light && ( <div className={styles.cardSubSection}> <h4 className={styles.lightTitle}>Luz:</h4> {renderFormattedText(lifePathParts.light)} </div> )}
            {lifePathParts.shadow && ( <div className={styles.cardSubSection}> <h4 className={styles.shadowTitle}>Sombra:</h4> {renderFormattedText(lifePathParts.shadow)} </div> )}
            {lifePathParts.mission && ( <div className={styles.cardSubSection}> <h4 className={styles.missionTitle}>Missão:</h4> {renderFormattedText(lifePathParts.mission)} </div> )}
          </div>

          {/* Card: Número do Aniversário */}
          <div className={`${styles.resultCard} ${styles.birthdayCard}`}>
            <h3 className={styles.cardTitle}>Número do Aniversário: {resultData?.birthday_number ?? 'N/A'} (Dia {dayOfMonth})</h3>
            <div className={styles.cardSubSection}>
              {renderFormattedText(resultData?.birthday_meaning || 'Significado não disponível.')}
            </div>
          </div>

          {/* <<< MUDANÇA AQUI: Renderiza o Significado Secreto >>> */}
          {/* Card: Significado Secreto do Aniversário */}
          {resultData?.birthday_secret_meaning && ( // Só mostra se a IA retornou algo
            <div className={`${styles.resultCard} ${styles.secretMeaningCard}`}>
               <h3 className={styles.cardTitle}>O Arquétipo do Seu Dia de Nascimento</h3>
               <div className={styles.cardSubSection}>
                  {/* Usa a mesma função para formatar o texto vindo da IA */}
                  {renderFormattedText(resultData.birthday_secret_meaning)}
               </div>
            </div>
          )}
          {/* <<< FIM DA MUDANÇA >>> */}

        </div> {/* Fim .resultContent */}

        {/* Botão Reset */}
        <div className={styles.resultActions}>
          <button onClick={handleResetReading} className={styles.resetButton} disabled={isResetting || isCalculating}>
            {isResetting ? 'Apagando...' : 'Apagar Leitura (Resetar)'}
          </button>
        </div>
        {errorResetting && <p className={`${styles.errorMessage} ${styles.resetError}`}>Erro ao apagar: {errorResetting.message}</p>}
      </div> // Fim .resultsContainer
    );
  };

  // --- Renderização Principal da Página ---
  return (
    <div className={`content_wrapper ${styles.pageContainer}`}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>Numerologia Pessoal</h1>
        <p className={styles.subtitle}>Descubra os números que guiam sua jornada através da sua data de nascimento.</p>

        {/* Loading */}
        {(isLoadingReading || isCalculating || isResetting) && <NumberLoader /* ... */ />}

        {/* Erro */}
        { !isLoadingReading && !isCalculating && !isResetting && (errorLoadingReading || errorCalculating || errorResetting) && (
          <div className={styles.errorContainer}> <p>{/*...*/}</p> <button onClick={handleRetry}>{/*...*/}</button> </div>
        )}

        {/* Resultado OU Formulário */}
        { !isLoadingReading && !isCalculating && !isResetting && !errorLoadingReading && !errorCalculating && !errorResetting && (
          numerologyData && !isSuccessResetting ? renderResult(numerologyData) : renderForm()
        )}
      </div>
    </div>
  );
}

export default NumerologyPage;