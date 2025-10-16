import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { baralhoDetalhado } from '../../tarotDeck';
import CardPreview from '../../components/CardPreview/CardPreview'; // Importamos o novo componente
import styles from './CardLibraryPage.module.css';

function CardLibraryPage() {
  const [activeTab, setActiveTab] = useState('maiores');

  const tabs = useMemo(() => ({
    maiores: {
      title: "Arcanos Maiores",
      cards: baralhoDetalhado.filter(carta => carta.tipo === 'Arcano Maior')
    },
    paus: {
      title: "Naipe de Paus",
      cards: baralhoDetalhado.filter(carta => carta.naipe === 'Paus')
    },
    copas: {
      title: "Naipe de Copas",
      cards: baralhoDetalhado.filter(carta => carta.naipe === 'Copas')
    },
    espadas: {
      title: "Naipe de Espadas",
      cards: baralhoDetalhado.filter(carta => carta.naipe === 'Espadas')
    },
    ouros: {
      title: "Naipe de Ouros",
      cards: baralhoDetalhado.filter(carta => carta.naipe === 'Ouros')
    }
  }), []);

  // Uma função auxiliar para renderizar a seção de cartas
  const renderCardSection = (title, cards) => (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.cardGrid}>
        {cards.map(card => (
          // Usamos o novo componente CardPreview aqui
          <CardPreview key={card.id} card={card} />
        ))}
      </div>
    </section>
  );

  return (
    <div className={`content_wrapper ${styles.libraryContainer}`}>
      <h1 className={styles.mainTitle}>Biblioteca de Cartas</h1>
      <p className={styles.subtitle}>Explore o significado de cada uma das 78 cartas do Tarot de Rider-Waite.</p>
      
      {/* Barra de navegação com as abas */}
      <nav className={styles.tabNav}>
        {Object.keys(tabs).map(tabKey => (
          <button 
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`${styles.tabButton} ${activeTab === tabKey ? styles.activeTab : ''}`}
          >
            {tabs[tabKey].title}
          </button>
        ))}
      </nav>

      {/* Renderiza APENAS a seção da aba ativa */}
      <div className={styles.contentContainer}>
        {tabs[activeTab] && renderCardSection(tabs[activeTab].title, tabs[activeTab].cards)}
      </div>
    </div>
  );
}

export default CardLibraryPage;