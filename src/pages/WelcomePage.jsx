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
        <h1 className={styles.mainTitle}>ESOTERICON</h1>
        <p className={styles.subtitle}>
          Um portal para desvendar os mistérios do oculto. Explore oráculos, grimórios e sabedorias ancestrais.
        </p>
        
        <Link to="/tarot" className={styles.ctaButton}>
          Consultar o Oráculo de Tarot
        </Link>

        <Link 
          to="/numerologia" 
          className={`${styles.secondaryLink} ${styles.numerologyLink}`}
        >
          Analisar Meus Números
        </Link>
        
        <Link to="/biblioteca" className={styles.secondaryLink}>
          Explorar a Biblioteca de Cartas
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;