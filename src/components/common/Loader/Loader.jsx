// src/components/common/Loader/Loader.jsx

import React, { useState, useEffect } from 'react'; // Importamos os hooks
import styles from './Loader.module.css';

// 1. A nossa lista de frases temáticas. Sinta-se à vontade para adicionar mais!
const frasesDeLoading = [
  "Embaralhando o baralho cósmico...",
  "Concentrando as energias na sua questão...",
  "As cartas estão sendo reveladas...",
  "Interpretando os sussurros do destino...",
  "Canalizando a sabedoria dos arcanos...",
  "Aguardando a conexão com o astral..."
];

function Loader() {
  // 2. Criamos um estado para guardar o índice da frase atual
  const [indiceFrase, setIndiceFrase] = useState(0);

  // 3. Este hook controla a lógica de troca de frases
  useEffect(() => {
    // Inicia um "timer" que executa a cada 3 segundos (3000 milissegundos)
    const timer = setInterval(() => {
      // Atualiza o índice para o próximo da lista, voltando ao início se chegar ao fim
      setIndiceFrase((prevIndex) => (prevIndex + 1) % frasesDeLoading.length);
    }, 3000);

    // Função de "limpeza": Isso é crucial! Quando o loading terminar e o componente
    // for removido da tela, o timer será desligado para não consumir recursos.
    return () => clearInterval(timer);
  }, []); // O array vazio [] garante que este efeito só rode uma vez, quando o componente aparece

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      {/* O parágrafo agora exibe a frase do nosso estado, que muda com o tempo */}
      {/* A 'key' ajuda o React a aplicar a animação de CSS a cada troca de texto */}
      <p key={indiceFrase} className={styles.loadingText}>
        {frasesDeLoading[indiceFrase]}
      </p>
    </div>
  );
}

export default Loader;