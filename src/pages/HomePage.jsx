// src/pages/HomePage.jsx - VERSÃO COM O LOGO

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGenerateReading } from '../hooks/useReadings';
import QuestionForm from '../components/QuestionForm/QuestionForm';
import Loader from '../components/common/Loader/Loader';
import styles from './HomePage.module.css';

const listaDeVideos = [
  '/assets/video1.mp4',
  '/assets/video2.mp4',
  '/assets/video3.mp4',
  '/assets/video4.mp4',
  '/assets/video5.mp4'
];

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: generateReading, isPending, error } = useGenerateReading();
  const [videoAtualIndex, setVideoAtualIndex] = useState(0);

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };

  const handleStartReading = (question) => {
    if (!user) {
      alert("Você precisa estar logado para fazer uma leitura. Por favor, faça o login.");
      navigate('/login');
      return;
    }
    generateReading({ question, user }, {
      onSuccess: (data) => {
        navigate(`/leitura/${data.id}`);
      },
      onError: (err) => {
        alert(`Ocorreu um erro ao gerar sua leitura: ${err.message}`);
      }
    });
  };

  if (isPending) {
    return <Loader customText="Forjando seu destino nas estrelas..." />;
  }

  return (
    <div className={styles.homeContainer}>
      <video
        key={videoAtualIndex}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className={styles.videoFundo}
      >
        <source src={listaDeVideos[videoAtualIndex]} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <div className={styles.videoOverlay}></div>
      <div className={styles.conteudoCentralizado}>
        {/* ALTERADO: O título principal agora tem a classe do logo */}
        <h1 className={styles.mainTitleLogo}>ORÁCULO IA</h1>

        <p className={styles.subtitle}>
          Desvende as energias que te cercam. Faça uma pergunta, concentre-se e permita que as cartas revelem seus insights.
        </p>
        <QuestionForm onSubmit={handleStartReading} disabled={isPending} />
        {error && <p style={{color: 'red', marginTop: '1rem'}}>Falha ao iniciar leitura: {error.message}</p>}
      </div>
    </div>
  );
}

export default HomePage;