import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAstralChart } from '../services/astrologyService';
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
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

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
    setResult(null);

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

    setIsLoading(true);
    try {
      const data = await getAstralChart(buildPayload());
      setResult(data);
    } catch (error) {
      setFormError(error.message || 'Não foi possível gerar o mapa astral.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormState);
    setResult(null);
    setFormError('');
  };

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
            <label className={styles.field}>
              <span>Nome</span>
              <input
                type="text"
                name="name"
                value={displayName}
                onChange={handleChange}
                placeholder="Como você prefere ser chamado"
              />
            </label>

            <label className={styles.field}>
              <span>Data de nascimento</span>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </label>

            <label className={styles.field}>
              <span>Hora de nascimento (opcional)</span>
              <input
                type="time"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleChange}
              />
            </label>

            <label className={styles.field}>
              <span>Cidade de nascimento</span>
              <input
                type="text"
                name="birthCity"
                value={formData.birthCity}
                onChange={handleChange}
                placeholder="Ex: São Paulo, BR"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Fuso horário</span>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                placeholder="Ex: America/Sao_Paulo"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Signo solar (opcional)</span>
              <input
                type="text"
                name="sunSign"
                value={formData.sunSign}
                onChange={handleChange}
                placeholder="Ex: Aquário"
              />
            </label>

            <label className={styles.field}>
              <span>Área de foco</span>
              <select name="focusArea" value={formData.focusArea} onChange={handleChange}>
                <option value="geral">Geral</option>
                <option value="amor">Amor</option>
                <option value="carreira">Carreira</option>
                <option value="bem-estar">Bem-estar</option>
              </select>
            </label>
          </div>

          {formError && <p className={styles.error}>{formError}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} disabled={isLoading}>
              {isLoading ? 'Gerando mapa...' : 'Gerar mapa astral'}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={handleReset}>
              Limpar
            </button>
          </div>
        </form>

        <section className={styles.resultSection} aria-live="polite">
          {isLoading && (
            <div className={styles.loadingCard}>
              <span className={styles.loadingPulse} />
              <p>Interpretando seu mapa astral. Aguarde alguns instantes.</p>
            </div>
          )}

          {!isLoading && result && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <h2>Seu resumo astral</h2>
                <p>Confira a leitura completa e salve os pontos-chave.</p>
              </div>
              <pre className={styles.resultContent}>{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          {!isLoading && !result && !formError && (
            <div className={styles.helperCard}>
              <h2>Antes de começar</h2>
              <ul>
                <li>Inclua a hora de nascimento para um mapa mais preciso.</li>
                <li>Use o fuso horário no formato IANA (ex: America/Sao_Paulo).</li>
                <li>Você pode ajustar o foco da leitura conforme o momento atual.</li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AstrologyPage;
