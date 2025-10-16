import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGenerateReading } from '../hooks/useReadings';
import Loader from '../components/common/Loader/Loader';
import { suggestedQuestions } from '../constants/suggestionConstants'; // NOVO: Importamos as perguntas
import styles from './HomePage.module.css';

const listaDeVideos = [
  '/assets/video1.mp4',
  '/assets/video2.mp4',
  '/assets/video3.mp4',
  '/assets/video4.mp4',
  '/assets/video5.mp4',
  '/assets/video6.mp4'
];

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: generateReading, isPending, error } = useGenerateReading();
  const [videoAtualIndex, setVideoAtualIndex] = useState(0);
  
  const [formType, setFormType] = useState('default');
  const [question, setQuestion] = useState('');
  const [path1, setPath1] = useState('');
  const [path2, setPath2] = useState('');

  // NOVO: Estado para controlar qual tiragem está selecionada
  const [selectedSpread, setSelectedSpread] = useState(null);

  // Efeito para limpar a pergunta quando a tiragem selecionada muda
  useEffect(() => {
    setQuestion('');
  }, [selectedSpread]);

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };

  const handleStartReading = () => {
    if (!selectedSpread) {
      alert('Por favor, selecione um tipo de tiragem.');
      return;
    }
    
    let questionToSend = question;
    if (question.trim() === '') {
      alert('Por favor, digite sua pergunta ou escolha uma sugestão.');
      return;
    }

    console.log(`Iniciando leitura do tipo: ${selectedSpread}`);
    
    generateReading({ question: questionToSend, user: user || null, spreadType: selectedSpread }, {
      onSuccess: (data) => {
        navigate(`/leitura/${data.id}`);
      },
      onError: (err) => {
        alert(`Ocorreu um erro ao gerar sua leitura: ${err.message}`);
      }
    });
  };
  
  // A lógica do formulário de Escolha de Caminho permanece a mesma
  const handlePathChoiceReading = () => {
    if (path1.trim() === '' || path2.trim() === '') {
      alert('Por favor, descreva os dois caminhos.');
      return;
    }
    const questionToSend = { path1, path2 };
    generateReading({ question: questionToSend, user: user || null, spreadType: 'pathChoice' }, {
      onSuccess: (data) => navigate(`/leitura/${data.id}`),
      onError: (err) => alert(`Ocorreu um erro: ${err.message}`),
    });
  };

  if (isPending) {
    return <Loader customText="Analisando os fios do destino..." />;
  }

  // Formulário Padrão Refatorado
  const defaultForm = (
    <div className={styles.formContainer}>
      <p className={styles.subtitle}>Selecione um método de leitura abaixo.</p>
      <div className={styles.buttonGroup}>
        <button onClick={() => setSelectedSpread('celticCross')} className={`${styles.submitButton} ${selectedSpread === 'celticCross' ? styles.activeButton : ''}`}>Cruz Celta</button>
        <button onClick={() => setSelectedSpread('threeCards')} className={`${styles.submitButton} ${selectedSpread === 'threeCards' ? styles.activeButton : ''}`}>3 Cartas</button>
        <button onClick={() => setSelectedSpread('templeOfAphrodite')} className={`${styles.submitButton} ${selectedSpread === 'templeOfAphrodite' ? styles.activeButton : ''}`}>Templo de Afrodite</button>
        <button onClick={() => setFormType('pathChoice')} className={styles.submitButton}>Escolha de Caminho</button>
      </div>

      {/* Seção de Perguntas - aparece quando uma tiragem é selecionada */}
      {selectedSpread && suggestedQuestions[selectedSpread]?.length > 0 && (
        <div className={styles.suggestionsContainer}>
          <h4 className={styles.suggestionTitle}>Não sabe o que perguntar? Tente uma destas:</h4>
          <ul className={styles.suggestionList}>
            {suggestedQuestions[selectedSpread].map((q, index) => (
              <li key={index} onClick={() => setQuestion(q)} className={styles.suggestionItem}>
                "{q}"
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* A caixa de texto e o botão de revelar só aparecem se uma tiragem for selecionada */}
      {selectedSpread && (
        <>
          <textarea
            className={styles.questionTextarea}
            placeholder="Digite sua pergunta aqui ou clique em uma sugestão acima..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isPending}
            rows="3"
          />
          <button onClick={handleStartReading} disabled={isPending} className={styles.mainSubmitButton}>
            Revelar Leitura
          </button>
        </>
      )}
    </div>
  );

  // Formulário de Escolha de Caminho (sem alterações)
  const pathChoiceForm = (
    <div className={styles.formContainer}>
       <p className={styles.subtitle}>Descreva os dois caminhos que você está considerando.</p>
       <input type="text" className={styles.pathInput} placeholder="Caminho 1 (ex: Ficar no emprego atual)" value={path1} onChange={(e) => setPath1(e.target.value)} disabled={isPending} />
       <input type="text" className={styles.pathInput} placeholder="Caminho 2 (ex: Aceitar a nova proposta)" value={path2} onChange={(e) => setPath2(e.target.value)} disabled={isPending} />
      <div className={styles.buttonGroup}>
        <button onClick={handlePathChoiceReading} disabled={isPending} className={styles.mainSubmitButton}>Revelar os Caminhos</button>
        <button onClick={() => { setFormType('default'); setSelectedSpread(null); }} disabled={isPending} className={styles.secondaryButton}>Voltar</button>
      </div>
    </div>
  );

  return (
    <div className={styles.homeContainer}>
      <video key={videoAtualIndex} autoPlay muted playsInline onEnded={handleVideoEnd} className={styles.videoFundo}>
        <source src={listaDeVideos[videoAtualIndex]} type="video/mp4" />
      </video>
      <div className={styles.videoOverlay}></div>
      <div className={styles.conteudoCentralizado}>
        <h1 className={styles.mainTitleLogo}>ORÁCULO IA</h1>
        {formType === 'default' ? defaultForm : pathChoiceForm}
        {error && <p className={styles.errorMessage}>Falha ao iniciar leitura: {error.message}</p>}
      </div>
    </div>
  );
}

export default HomePage;