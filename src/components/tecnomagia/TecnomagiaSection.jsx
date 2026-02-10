import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TecnomagiaSection.module.css';

export default function TecnomagiaSection() {
  return (
    <section className={styles.section} aria-labelledby="tecnomagia-title">
      <h2 id="tecnomagia-title">Tecnomagia: símbolo, dados e consciência</h2>
      <p>
        Nossa proposta integra múltiplos oráculos em leituras responsáveis: intuição simbólica,
        estrutura de dados e clareza prática para apoiar decisões reais.
      </p>

      <div className={styles.pillars}>
        <article><h3>Ritual com clareza</h3><p>Experiência guiada com começo, meio e integração final.</p></article>
        <article><h3>Profundidade com estrutura</h3><p>Camadas de interpretação sem perder objetividade.</p></article>
        <article><h3>Misticismo com confiança</h3><p>Histórico, contexto e consistência para acompanhar sua evolução.</p></article>
      </div>

      <Link to="/leitura-unificada" className={styles.cta}>Conhecer a proposta</Link>
    </section>
  );
}
