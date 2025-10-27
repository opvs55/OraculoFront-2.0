// src/components/common/NumberLoader/NumberLoader.jsx
import React, { useState, useEffect } from 'react';
import styles from './NumberLoader.module.css'; // Criaremos este CSS a seguir

function NumberLoader({ customText = "Calculando..." }) {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    // Intervalo para mudar o número rapidamente
    const intervalId = setInterval(() => {
      setNumber(prevNumber => (prevNumber + 1) % 10); // Cicla de 0 a 9
    }, 100); // Muda a cada 100ms (ajuste a velocidade se quiser)

    // Função de limpeza: para o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId); 
  }, []); // O array vazio [] garante que o efeito só corre uma vez (montagem/desmontagem)

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.numberDisplay}>{number}</div>
      <p className={styles.loadingText}>{customText}</p>
    </div>
  );
}

export default NumberLoader;