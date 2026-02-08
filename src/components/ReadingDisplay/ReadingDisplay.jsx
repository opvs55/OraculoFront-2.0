// src/components/ReadingDisplay/ReadingDisplay.jsx (VERSÃO COM CRUZ CELTA VERTICAL)

import React from 'react';
import styles from './ReadingDisplay.module.css';

// Componente para renderizar a interpretação estruturada (3 cartas) - SEM MUDANÇAS
const StructuredInterpretation = ({ data }) => {
  const { contexto_escolhido, interpretacao } = data;
  if (!interpretacao) {
    console.error("Erro de Renderização: Dados estruturados inválidos para StructuredInterpretation.", data);
    return <p>Ocorreu um erro ao exibir esta leitura estruturada.</p>;
  }
  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.contextTitle}>{contexto_escolhido.titulo}</h3>
        <h2 className={styles.mainTitle}>{interpretacao.titulo_leitura}</h2>
        <p className={styles.summary}>"{interpretacao.resumo}"</p>
      </div>
      <div className={styles.analysisGrid}>
        {interpretacao.analise_cartas.map((analise, index) => (
          <div key={index} className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>{analise.posicao}</h4>
            <p>{analise.texto}</p>
          </div>
        ))}
      </div>
      <div className={styles.finalAdvice}>
        <h4 className={styles.adviceTitle}>Conselho Final</h4>
        <p>{interpretacao.conselho_final}</p>
      </div>
    </>
  );
};

// Componente do Templo de Afrodite ATUALIZADO - SEM MUDANÇAS
const TempleOfAphroditeInterpretation = ({ data }) => {
  const { titulo_leitura, resumo_geral, analise_pessoa1, analise_pessoa2, futuro_casal } = data;
  if (!analise_pessoa1 || !analise_pessoa2 || !futuro_casal) {
    console.error("Erro de Renderização: Dados inválidos para TempleOfAphrodite.", data);
    return <p>Ocorreu um erro ao exibir a leitura do Templo de Afrodite.</p>;
  }
  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.contextTitle}>Templo de Afrodite</h3>
        <h2 className={styles.mainTitle}>{titulo_leitura}</h2>
        <p className={styles.summary}>"{resumo_geral}"</p>
      </div>
      <div className={styles.aphroditeGrid}>
        {/* Coluna para Pessoa 1 */}
        <div className={styles.perspectiveSection}>
          <h3 className={styles.perspectiveTitle}>{analise_pessoa1.titulo}</h3>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Pensamentos / Intenções</h4>
            <p>{analise_pessoa1.pensamentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Sentimentos / Emoções</h4>
            <p>{analise_pessoa1.sentimentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Atração / Física</h4>
            <p>{analise_pessoa1.atracao}</p>
          </div>
        </div>
        {/* Coluna para Pessoa 2 */}
        <div className={styles.perspectiveSection}>
          <h3 className={styles.perspectiveTitle}>{analise_pessoa2.titulo}</h3>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Pensamentos / Intenções</h4>
            <p>{analise_pessoa2.pensamentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Sentimentos / Emoções</h4>
            <p>{analise_pessoa2.sentimentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Atração / Física</h4>
            <p>{analise_pessoa2.atracao}</p>
          </div>
        </div>
      </div>
      <div className={styles.finalAdvice}>
        <h4 className={styles.adviceTitle}>{futuro_casal.titulo}</h4>
        <p>{futuro_casal.texto}</p>
      </div>
    </>
  );
};

// Componente da Escolha de Caminho - SEM MUDANÇAS
const PathChoiceInterpretation = ({ data }) => {
  const { titulo_leitura, caminho1, caminho2, comparativo_final } = data;
  if (!caminho1 || !caminho2) {
    console.error("Erro de Renderização: Dados inválidos para PathChoice.", data);
    return <p>Ocorreu um erro ao exibir a leitura de Escolha de Caminho.</p>;
  }
  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.contextTitle}>Escolha de Caminho</h3>
        <h2 className={styles.mainTitle}>{titulo_leitura}</h2>
      </div>
      <div className={styles.pathChoiceGrid}>
        {/* Coluna do Caminho 1 */}
        <div className={styles.pathChoiceColumn}>
          <h3 className={styles.pathChoiceTitle}>{caminho1.titulo}</h3>
          {caminho1.analises.map((analise, index) => (
            <div key={index} className={styles.analysisCard}>
              <h4 className={styles.cardPositionTitle}>{analise.posicao}</h4>
              <p>{analise.texto}</p>
            </div>
          ))}
        </div>
        {/* Coluna do Caminho 2 */}
        <div className={styles.pathChoiceColumn}>
          <h3 className={styles.pathChoiceTitle}>{caminho2.titulo}</h3>
          {caminho2.analises.map((analise, index) => (
            <div key={index} className={styles.analysisCard}>
              <h4 className={styles.cardPositionTitle}>{analise.posicao}</h4>
              <p>{analise.texto}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.finalAdvice}>
        <h4 className={styles.adviceTitle}>Síntese Comparativa</h4>
        <p>{comparativo_final}</p>
      </div>
    </>
  );
};

// <<< MUDANÇA PRINCIPAL: Componente da Cruz Celta com Layout VERTICAL >>>
const CelticCrossInterpretation = ({ data }) => {
  const { titulo_leitura, resumo_geral, analise_cartas, conselho_final } = data;

  if (!analise_cartas || !resumo_geral) {
    console.error("Erro de Renderização: Dados inválidos para CelticCross.", data);
    return <p>Ocorreu um erro ao exibir a leitura da Cruz Celta.</p>;
  }

  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.contextTitle}>Cruz Celta</h3>
        <h2 className={styles.mainTitle}>{titulo_leitura}</h2>
        <p className={styles.summary}>"{resumo_geral}"</p>
      </div>

      {/* <<< MUDANÇA: Container Vertical em vez de Grid >>> */}
      <div className={styles.verticalAnalysisContainer}>
        {analise_cartas.map((analise, index) => (
          // Usamos React.Fragment para poder adicionar o divisor
          <React.Fragment key={index}>
            {/* Mantemos o card para cada análise */}
            <div className={styles.analysisCard}>
              <h4 className={styles.cardPositionTitle}>{analise.posicao}</h4>
              <p>{analise.texto}</p>
            </div>

            {/* <<< MUDANÇA: Adiciona um divisor entre os cards (exceto após o último) >>> */}
            {index < analise_cartas.length - 1 && (
              <hr className={styles.verticalDivider} />
              // Alternativa: <div className={styles.verticalDivider}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.finalAdvice}>
        <h4 className={styles.adviceTitle}>Conselho Final / Síntese</h4>
        <p>{conselho_final}</p>
      </div>
    </>
  );
};

// Componente para renderizar o "TEXTÃO FEIO" (agora só para leituras antigas) - SEM MUDANÇAS
const SimpleInterpretation = ({ text }) => {
  const renderTextWithHighlights = (paragraphText) => {
    const regex = /\*\*([^*]+)\*\*/g;
    return paragraphText.split(regex).map((part, index) =>
      index % 2 === 1
        ? <span key={index} className={styles.cardNameHighlight}>{part}</span>
        : part
    );
  };
  return (
    <div className={styles.simpleText}>
      {text && text.split('\n').map((paragraph, index) => (
        <p key={index}>{renderTextWithHighlights(paragraph)}</p>
      ))}
    </div>
  );
};

// Lógica principal do ReadingDisplay - SEM MUDANÇAS (já estava correta)
function ReadingDisplay({ readingData }) {
  if (!readingData) {
    return <div className={styles.container}><p>Carregando interpretação...</p></div>;
  }

  const { interpretation_data, main_interpretation, spread_type } = readingData;

  if (interpretation_data?.interpretationType === 'structured') {
    const structuredData = interpretation_data.data;
    if (!structuredData) {
      console.error("Erro de Renderização: 'interpretationType' é 'structured', mas 'data' está em falta.", interpretation_data);
      return <div className={styles.container}><p>Erro ao carregar dados da interpretação.</p></div>;
    }

    switch (spread_type) {
      case 'templeOfAphrodite':
        return <div className={styles.container}><TempleOfAphroditeInterpretation data={structuredData} /></div>;
      case 'pathChoice':
        return <div className={styles.container}><PathChoiceInterpretation data={structuredData} /></div>;
      case 'celticCross':
        return <div className={styles.container}><CelticCrossInterpretation data={structuredData} /></div>;
      case 'threeCards':
      default:
        return <div className={styles.container}><StructuredInterpretation data={structuredData} /></div>;
    }
  }

  return <div className={styles.container}><SimpleInterpretation text={main_interpretation || 'Nenhuma interpretação disponível.'} /></div>;
}

export default ReadingDisplay;
