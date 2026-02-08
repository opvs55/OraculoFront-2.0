import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

// A lista de vídeos
const listaDeVideos = [
  '/assets/video_welcome2.mp4',
  '/assets/video_welcome2.mp4',
];

function WelcomePage() {
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * listaDeVideos.length));

  // --- ESTA É A FUNÇÃO DO "LOOPING" ---
  // Quando o vídeo termina, esta função é chamada...
  const handleVideoEnd = () => {
    // ...e ela atualiza o estado para o próximo vídeo da lista.
    // O '%' garante que, ao chegar ao fim, volta ao início (índice 0).
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };
  // --- FIM DA LÓGICA DO LOOPING ---

  return (
    <div className={styles.welcomeContainer}>
      
      <video 
        key={videoAtualIndex} 
        autoPlay 
        muted 
        playsInline 
        onEnded={handleVideoEnd} // <-- O "loop" é ativado aqui
        className={styles.videoFundo}
      >
        <source src={listaDeVideos[videoAtualIndex]} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      
      <div className={styles.videoOverlay}></div>

      <div className={styles.content}>
        <div className={styles.heroCard}>
          <h1 className={styles.mainTitle}>ESOTERICON</h1>
          <p className={styles.subtitle}>
            Descubra respostas com leituras guiadas e conteúdo esotérico curado para sua jornada espiritual.
          </p>

          <div className={styles.primaryCtaGroup}>
            <Link to="/tarot" className={styles.ctaButton}>
              Fazer minha leitura
            </Link>
            <span className={styles.ctaMicrocopy}>Leva ~3 min</span>
          </div>

          <div className={styles.secondaryActions}>
            <Link to="/numerologia" className={styles.secondaryButton}>
              Análise Numerológica
            </Link>
            <Link to="/biblioteca" className={styles.secondaryButton}>
              Biblioteca de Cartas
            </Link>
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
