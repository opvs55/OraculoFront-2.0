import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const listaDeVideos = ['/assets/video_welcome2.mp4', '/assets/video_welcome2.mp4'];

const mobileOracles = [
  { title: 'Tarot', description: 'Pergunta direta com leitura simbólica.', to: '/tarot' },
  { title: 'Numerologia', description: 'Descubra seu número de jornada.', to: '/numerologia' },
  { title: 'Mapa Astral', description: 'Leitura natal com foco no agora.', to: '/mapa-astral' },
];

function WelcomePage() {
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * listaDeVideos.length));

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };

  return (
    <div className={styles.welcomeContainer}>
      <video key={videoAtualIndex} autoPlay muted playsInline onEnded={handleVideoEnd} className={styles.videoFundo}>
        <source src={listaDeVideos[videoAtualIndex]} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      <div className={styles.videoOverlay} />

      <div className={styles.content}>
        <div className={styles.heroCard}>
          <h1 className={styles.mainTitle}>ESOTERICON</h1>
          <p className={styles.subtitle}>
            Descubra respostas com leituras guiadas e conteúdo esotérico curado para sua jornada espiritual.
          </p>

          <div className={styles.monologue}>
            <p>
              Aqui, cada leitura é um convite ao silêncio interno: um espaço para ouvir símbolos,
              perceber padrões e transformar perguntas em direção.
            </p>
            <p>
              O ESOTERICON foi criado para guiar sua jornada com beleza, profundidade e respeito —
              uma experiência íntima de autoconhecimento, sem pressa, sem ruído.
            </p>
            <Link to="/tarot" className={styles.monologueLink}>Iniciar minha leitura agora</Link>
          </div>

          <div className={styles.mobileOraclesSection}>
            <h2>Escolha seu oráculo</h2>
            <div className={styles.mobileOraclesScroller}>
              {mobileOracles.map((oracle) => (
                <article key={oracle.title} className={styles.oracleCard}>
                  <h3>{oracle.title}</h3>
                  <p>{oracle.description}</p>
                  <Link to={oracle.to} className={styles.oracleCta}>Iniciar leitura</Link>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.trustSignals}>
            <span>+2.000 leituras realizadas</span>
            <span>Privacidade garantida</span>
            <span>Resposta imediata</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
