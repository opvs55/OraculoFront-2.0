// src/components/numerology/NumerologyForm.jsx (NOVO COMPONENTE)
import React from 'react';
import styles from '../../pages/NumerologyPage.module.css'; // Reutiliza os estilos da página

// Este é um "componente burro", apenas recebe props e renderiza o form
function NumerologyForm({
  birthDate,
  setBirthDate,
  formError,
  handleSubmit,
  isCalculating,
  isSuccessResetting
}) {
  return (
    <form onSubmit={handleSubmit} className={styles.numerologyForm}>
      <label htmlFor="birthDate" className={styles.dateLabel}>
        {isSuccessResetting ? "Insira sua data correta para recalcular:" : "Digite sua Data de Nascimento:"}
      </label>
      <input
        type="date"
        id="birthDate"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        className={styles.dateInput}
        required
        pattern="\d{4}-\d{2}-\d{2}"
        disabled={isCalculating}
      />
      <button
        type="submit"
        disabled={isCalculating}
        className={styles.submitButton}
      >
        {isCalculating ? 'Calculando...' : 'Revelar meus Números'}
      </button>
      {formError && <p className={styles.errorMessage}>{formError}</p>}
    </form>
  );
}

export default NumerologyForm;