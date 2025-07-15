// src/pages/HomePage.jsx - VERSÃO CORRIGIDA E FINAL

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
  // 1. Pega o usuário do nosso AuthContext estável
  const { user } = useAuth();
  
  // 2. Prepara a mutação
  const { mutate: generateReading, isPending, error } = useGenerateReading();

  const [videoAtualIndex, setVideoAtualIndex] = useState(0);

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };

  const handleStartReading = (question) => {
    // 3. VERIFICAÇÃO DE SEGURANÇA: Garante que temos um usuário antes de prosseguir.
    if (!user) {
      alert("Você precisa estar logado para fazer uma leitura. Por favor, faça o login.");
      navigate('/login');
      return;
    }

    // 4. CHAMA A MUTATE DA FORMA CORRETA:
    // Passamos os dados necessários (question e o objeto user)
    // e definimos o que acontece em caso de sucesso ou erro.
    generateReading({ question, user }, {
      onSuccess: (data) => {
        // 'data' é o retorno da nossa mutationFn (a newReading)
        navigate(`/leitura/${data.id}`);
      },
      onError: (err) => {
        // 'err' é o erro que foi lançado na mutationFn
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
        <h1 className={styles.mainTitle}>Oráculo de Tarot IA</h1>
        <p className={styles.subtitle}>
          Desvende as energias que te cercam. Faça uma pergunta, concentre-se e permita que as cartas revelem seus insights.
        </p>
        <QuestionForm onSubmit={handleStartReading} disabled={isPending} />
        {/* Mostra um erro se a última mutação falhou */}
        {error && <p style={{color: 'red', marginTop: '1rem'}}>Falha ao iniciar leitura: {error.message}</p>}
      </div>
    </div>
  );
}

export default HomePage;