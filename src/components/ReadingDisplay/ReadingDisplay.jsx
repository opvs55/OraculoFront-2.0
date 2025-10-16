// src/components/ReadingDisplay/ReadingDisplay.jsx

import React from 'react';
import styles from './ReadingDisplay.module.css';

// Componente para renderizar a interpretação estruturada (3 cartas)
const StructuredInterpretation = ({ data }) => {
  const { contexto_escolhido, interpretacao } = data;

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

// NOVO: Componente dedicado a renderizar a interpretação do Templo de Afrodite
const TempleOfAphroditeInterpretation = ({ data }) => {
  const { titulo_leitura, resumo_geral, analise_voce, analise_outro, resultado_conselho } = data;
  return (
    <>
      <div className={styles.header}>
        <h3 className={styles.contextTitle}>Templo de Afrodite</h3>
        <h2 className={styles.mainTitle}>{titulo_leitura}</h2>
        <p className={styles.summary}>"{resumo_geral}"</p>
      </div>

      <div className={styles.aphroditeGrid}>
        {/* Coluna para "Você" */}
        <div className={styles.perspectiveSection}>
          <h3 className={styles.perspectiveTitle}>{analise_voce.titulo}</h3>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>O que Pensa</h4>
            <p>{analise_voce.pensamentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>O que Sente</h4>
            <p>{analise_voce.sentimentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Atração / Desejo</h4>
            <p>{analise_voce.desejo}</p>
          </div>
        </div>

        {/* Coluna para "O Outro" */}
        <div className={styles.perspectiveSection}>
          <h3 className={styles.perspectiveTitle}>{analise_outro.titulo}</h3>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>O que Pensa</h4>
            <p>{analise_outro.pensamentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>O que Sente</h4>
            <p>{analise_outro.sentimentos}</p>
          </div>
          <div className={styles.analysisCard}>
            <h4 className={styles.cardPositionTitle}>Atração / Desejo</h4>
            <p>{analise_outro.desejo}</p>
          </div>
        </div>
      </div>

      <div className={styles.finalAdvice}>
        <h4 className={styles.adviceTitle}>{resultado_conselho.titulo}</h4>
        <p>{resultado_conselho.texto}</p>
      </div>
    </>
  );
}

// NOVO: Componente dedicado a renderizar a Escolha de Caminho
const PathChoiceInterpretation = ({ data }) => {
  const { titulo_leitura, caminho1, caminho2, comparativo_final } = data;

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


// Componente para renderizar a interpretação simples (Cruz Celta e antigas)
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


function ReadingDisplay({ readingData }) {
  if (!readingData) {
    return <div className={styles.container}><p>Carregando interpretação...</p></div>;
  }

  const { interpretation_data, main_interpretation, spread_type } = readingData;

  if (interpretation_data?.interpretationType === 'structured') {
    if (spread_type === 'templeOfAphrodite') {
      return <div className={styles.container}><TempleOfAphroditeInterpretation data={interpretation_data.data} /></div>;
    }
    if (spread_type === 'pathChoice') {
      return <div className={styles.container}><PathChoiceInterpretation data={interpretation_data.data} /></div>;
    }
    return <div className={styles.container}><StructuredInterpretation data={interpretation_data.data} /></div>;
  }

  return <div className={styles.container}><SimpleInterpretation text={main_interpretation || 'Nenhuma interpretação disponível.'} /></div>;
}

export default ReadingDisplay;