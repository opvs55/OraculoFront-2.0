// src/pages/NumerologyPage.jsx (O NOVO GESTOR)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Verifique o caminho
import { useNumerologyReading } from '../hooks/useNumerologyReading'; // Verifique o caminho
import NumberLoader from '../components/common/NumberLoader/NumberLoader'; // Verifique o caminho
import NumerologyForm from '../components/numerology/NumerologyForm'; // <<< NOVO
import NumerologyResults from '../components/numerology/NumerologyResults'; // <<< NOVO
import styles from './NumerologyPage.module.css';

function NumerologyPage() {
  const { user } = useAuth();
  const [birthDate, setBirthDate] = useState('');
  const [formError, setFormError] = useState(null);

  // O hook de dados (sem alterações)
  const {
    numerologyData, isLoadingReading, errorLoadingReading, refetchReading,
    calculateNumerology, isCalculating, errorCalculating, resetCalculationState,
    resetNumerology, isResetting, errorResetting, isSuccessResetting, resetResetState
  } = useNumerologyReading();

  // Efeito para limpar o formulário (sem alterações)
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

  // --- Renderização Principal da Página ---
  
  // Função interna para decidir o que renderizar
  const renderContent = () => {
    // 1. Loading
    if (isLoadingReading || isCalculating || isResetting) {
      return <NumberLoader />;
    }

    // 2. Erro
    // (Lógica de erro combinada para simplificar)
    const combinedError = errorLoadingReading || errorCalculating || errorResetting;
    if (combinedError) {
      return (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            Ocorreu um erro: {combinedError.message}
          </p>
          <button onClick={handleRetry} className={styles.secondaryButton}>
            Tentar Novamente
          </button>
        </div>
      );
    }

    // 3. Resultados ou Formulário
    // Se temos dados E não acabámos de resetar, mostra os resultados
    if (numerologyData && !isSuccessResetting) {
      return (
        <NumerologyResults
          resultData={numerologyData}
          onReset={handleResetReading}
          isResetting={isResetting}
          errorResetting={errorResetting}
        />
      );
    }

    // 4. Se não, mostra o formulário
    return (
      <NumerologyForm
        birthDate={birthDate}
        setBirthDate={setBirthDate}
        formError={formError}
        handleSubmit={handleSubmit}
        isCalculating={isCalculating}
        isSuccessResetting={isSuccessResetting}
      />
    );
  };

  return (
    <div className={`content_wrapper ${styles.pageContainer}`}>
      <div className={styles.content}>
        <h1 className={styles.mainTitle}>Numerologia Pessoal</h1>
        <p className={styles.subtitle}>Descubra os números que guiam sua jornada através da sua data de nascimento.</p>
        
        {/* Renderiza o conteúdo (Loading, Erro, Form ou Resultados) */}
        {renderContent()}
      </div>
    </div>
  );
}

export default NumerologyPage;
