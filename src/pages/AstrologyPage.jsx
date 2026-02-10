import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNatalChart } from '../features/astrology/useNatalChart';
import styles from './AstrologyPage.module.css';

const defaultFormState = {
  name: '',
  birthDate: '',
  birthTime: '',
  birthCity: '',
  timezone: 'America/Sao_Paulo',
  sunSign: '',
  focusArea: 'geral',
};

function AstrologyPage() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState(defaultFormState);
  const [formError, setFormError] = useState('');
  const {
    natalChart,
    isLoadingNatalChart,
    errorNatalChart,
    refetchNatalChart,
    generateNatalChart,
    isGeneratingNatalChart,
    errorGeneratingNatalChart,
  } = useNatalChart();

  const displayName = useMemo(() => {
    return formData.name || profile?.full_name || user?.user_metadata?.full_name || user?.email || '';
  }, [formData.name, profile?.full_name, user?.email, user?.user_metadata?.full_name]);

  useEffect(() => {
    if (!formData.name && profile?.full_name) {
      setFormData((prev) => ({ ...prev, name: profile.full_name }));
    }
  }, [profile?.full_name, formData.name]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => ({
    user: {
      id: user?.id ?? 'guest',
      name: displayName || 'Visitante',
      sun_sign: formData.sunSign || undefined,
      birth_date: formData.birthDate,
      birth_time: formData.birthTime || undefined,
      birth_city: formData.birthCity,
      timezone: formData.timezone,
    },
    focus_area: formData.focusArea,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!formData.birthDate) {
      setFormError('Informe sua data de nascimento.');
      return;
    }

    if (!formData.birthCity) {
      setFormError('Informe a cidade de nascimento.');
      return;
    }

    if (!formData.timezone) {
      setFormError('Informe o fuso horário.');
      return;
    }

    try {
      await generateNatalChart(buildPayload());
    } catch (error) {
      setFormError(error.message || 'Não foi possível gerar o mapa astral.');
    }
  };

  const handleReset = () => {
    setFormData(defaultFormState);
    setFormError('');
  };

  const combinedError = formError || errorNatalChart?.message || errorGeneratingNatalChart?.message;

  return (
    <div className={`content_wrapper ${styles.pageContainer}`}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Oráculos</p>
          <h1 className={styles.title}>Mapa Astral</h1>
          <p className={styles.subtitle}>
            Gere um resumo simbólico do seu mapa astral com base nos dados de nascimento.
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}><span>Nome</span><input type="text" name="name" value={displayName} onChange={handleChange} placeholder="Como você prefere ser chamado" /></label>
            <label className={styles.field}><span>Data de nascimento</span><input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required /></label>
            <label className={styles.field}><span>Hora de nascimento (opcional)</span><input type="time" name="birthTime" value={formData.birthTime} onChange={handleChange} /></label>
            <label className={styles.field}><span>Cidade de nascimento</span><input type="text" name="birthCity" value={formData.birthCity} onChange={handleChange} placeholder="Ex: São Paulo, BR" required /></label>
            <label className={styles.field}><span>Fuso horário</span><input type="text" name="timezone" value={formData.timezone} onChange={handleChange} placeholder="Ex: America/Sao_Paulo" required /></label>
            <label className={styles.field}><span>Signo solar (opcional)</span><input type="text" name="sunSign" value={formData.sunSign} onChange={handleChange} placeholder="Ex: Aquário" /></label>
            <label className={styles.field}><span>Área de foco</span><select name="focusArea" value={formData.focusArea} onChange={handleChange}><option value="geral">Geral</option><option value="amor">Amor</option><option value="carreira">Carreira</option><option value="bem-estar">Bem-estar</option></select></label>
          </div>

          {combinedError && (
            <div className={styles.errorContainer}>
              <p className={styles.error}>{combinedError}</p>
              <button type="button" className={styles.secondaryButton} onClick={() => refetchNatalChart()}>
                Tentar novamente
              </button>
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} disabled={isGeneratingNatalChart}>
              {isGeneratingNatalChart ? 'Gerando mapa...' : 'Gerar mapa astral'}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleReset}>
              Limpar
            </button>
          </div>
        </form>

        <section className={styles.resultSection} aria-live="polite">
          {(isGeneratingNatalChart || isLoadingNatalChart) && (
            <div className={styles.loadingCard}>
              <span className={styles.loadingPulse} />
              <p>Interpretando seu mapa astral. Aguarde alguns instantes.</p>
            </div>
          )}

          {!isGeneratingNatalChart && natalChart && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h2>Seu resumo astral</h2>
                <p>Confira a leitura completa e salve os pontos-chave.</p>
              </div>
              <pre className={styles.resultContent}>{JSON.stringify(natalChart.chart_data || natalChart, null, 2)}</pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AstrologyPage;
