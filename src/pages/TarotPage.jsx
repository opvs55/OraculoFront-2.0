import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGenerateReading } from '../hooks/useReadings';
import Loader from '../components/common/Loader/Loader';
import { suggestedQuestions } from '../constants/suggestionConstants';
import styles from './TarotPage.module.css';

const listaDeVideos = [
  '/assets/video1.mp4',
  '/assets/video2.mp4',
  '/assets/video3.mp4',
  '/assets/video4.mp4',
  '/assets/video5.mp4',
];

const VISITOR_READING_KEY = 'visitorReadingDone';
const mysticPhrase = 'O que o destino deseja revelar hoje?';

function TarotPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: generateReading, isPending, error: mutationError, reset } = useGenerateReading();
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * listaDeVideos.length));

  const [formType, setFormType] = useState('default');
  const [question, setQuestion] = useState('');
  const [path1, setPath1] = useState('');
  const [path2, setPath2] = useState('');
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [visitorHasRead, setVisitorHasRead] = useState(false);
  const [formError, setFormError] = useState(null);
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  useEffect(() => {
    if (!user) {
      const hasDoneReading = localStorage.getItem(VISITOR_READING_KEY);
      if (hasDoneReading === 'true') {
        setVisitorHasRead(true);
      }
    }
  }, [user]);

  const stableReset = useCallback(reset, [reset]);

  useEffect(() => {
    setQuestion('');
    setPath1('');
    setPath2('');
    setName1('');
    setName2('');
    stableReset();
    setFormError(null);
  }, [selectedSpread, formType, stableReset]);

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };

  const handleGenerateReading = useCallback((spreadType, questionData) => {
    setFormError(null);
    reset();

    if (!user && visitorHasRead) {
      setFormError('Você já realizou sua leitura de teste gratuita. Cadastre-se ou faça login para leituras ilimitadas!');
      return;
    }

    console.log(`Iniciando leitura do tipo: ${spreadType}`);

    generateReading({ question: questionData, user: user || null, spreadType: spreadType }, {
      onSuccess: (data) => {
        if (data.id && data.id.startsWith('temp-')) {
          localStorage.setItem(VISITOR_READING_KEY, 'true');
          setVisitorHasRead(true);
          navigate(`/leitura/${data.id}`, { state: { readingData: data } });
        } else {
          navigate(`/leitura/${data.id}`);
        }
      },
      onError: (err) => {
        console.error('Erro no generateReading:', err);
      }
    });
  }, [user, visitorHasRead, generateReading, navigate, reset]);

  const handleStartReading = () => {
    let questionData;
    let isValid = true;

    if (selectedSpread === 'templeOfAphrodite') {
      if (name1.trim() === '' || name2.trim() === '') {
        setFormError('Por favor, preencha o seu nome e o nome da pessoa.');
        isValid = false;
      }
      questionData = { name1, name2 };
    } else {
      if (!selectedSpread) {
        setFormError('Por favor, selecione um tipo de tiragem.');
        isValid = false;
      } else if (question.trim() === '') {
        setFormError('Por favor, digite sua pergunta ou escolha uma sugestão.');
        isValid = false;
      }
      questionData = question;
    }

    if (!isValid) return;
    handleGenerateReading(selectedSpread, questionData);
  };

  const handlePathChoiceReading = () => {
    if (path1.trim() === '' || path2.trim() === '') {
      setFormError('Por favor, descreva os dois caminhos.');
      return;
    }
    const questionToSend = { path1, path2 };
    handleGenerateReading('pathChoice', questionToSend);
  };

  if (isPending) {
    return <Loader customText="Canalizando a sabedoria dos arcanos..." />;
  }

  // --- RENDERIZAÇÃO DOS FORMULÁRIOS ---

  // Formulário Padrão
  const defaultForm = (
    <div className={styles.formContainer}>
      <p className={styles.subtitle}>Selecione um método de leitura abaixo.</p>
      <div className={styles.buttonGroup}>
        <button onClick={() => setSelectedSpread('celticCross')} className={`${styles.submitButton} ${selectedSpread === 'celticCross' ? styles.activeButton : ''}`}>Cruz Celta</button>
        <button onClick={() => setSelectedSpread('threeCards')} className={`${styles.submitButton} ${selectedSpread === 'threeCards' ? styles.activeButton : ''}`}>3 Cartas</button>
        <button onClick={() => setSelectedSpread('templeOfAphrodite')} className={`${styles.submitButton} ${selectedSpread === 'templeOfAphrodite' ? styles.activeButton : ''}`}>Templo de Afrodite</button>
        <button onClick={() => setFormType('pathChoice')} className={styles.submitButton}>Escolha de Caminho</button>
      </div>

      {/* Mostra SÓ se uma tiragem for selecionada E NÃO FOR o Templo de Afrodite */}
      {selectedSpread && selectedSpread !== 'templeOfAphrodite' && (
        <>
          {suggestedQuestions[selectedSpread]?.length > 0 && (
            <div className={styles.suggestionsContainer}>
              <h4 className={styles.suggestionTitle}>Não sabe o que perguntar? Tente uma destas:</h4>
              <ul className={styles.suggestionList}>
                {suggestedQuestions[selectedSpread].map((q, index) => (
                  <li key={index} onClick={() => setQuestion(q)} className={styles.suggestionItem}>"{q}"</li>
                ))}
              </ul>
            </div>
          )}
          <textarea
            className={styles.questionTextarea}
            placeholder="Digite sua pergunta aqui ou clique em uma sugestão acima..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isPending || (!user && visitorHasRead)}
          />
        </>
      )}

      {/* Mostra SÓ SE FOR Templo de Afrodite */}
      {selectedSpread === 'templeOfAphrodite' && (
        <div className={styles.pathChoiceContainer}>
          <p className={styles.subtitle}>Insira os nomes para a análise da relação:</p>
          <input
            type="text"
            className={styles.pathInput}
            placeholder="Seu nome (ou 'Eu')"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            disabled={isPending || (!user && visitorHasRead)}
          />
          <input
            type="text"
            className={styles.pathInput}
            placeholder="Nome da outra pessoa"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            disabled={isPending || (!user && visitorHasRead)}
          />
        </div>
      )}

      {/* Mostra o botão de submeter se QUALQUER tiragem estiver selecionada */}
      {selectedSpread && (
        <button
          onClick={handleStartReading}
          disabled={isPending || (!user && visitorHasRead)}
          className={styles.mainSubmitButton}
        >
          {(!user && visitorHasRead) ? 'Limite de teste atingido' : 'Revelar Leitura'}
        </button>
      )}
    </div>
  );

  // Formulário de Escolha de Caminho (CORRIGIDO)
  const pathChoiceForm = (
    <div className={styles.formContainer}>
      <p className={styles.subtitle}>Descreva os dois caminhos que você está considerando.</p>
      <input type="text" className={styles.pathInput} placeholder="Caminho 1 (ex: Ficar no emprego atual)" value={path1} onChange={(e) => setPath1(e.target.value)} disabled={isPending || (!user && visitorHasRead)} />
      <input type="text" className={styles.pathInput} placeholder="Caminho 2 (ex: Aceitar a nova proposta)" value={path2} onChange={(e) => setPath2(e.target.value)} disabled={isPending || (!user && visitorHasRead)} />

      {/* <<< O TEXTO INDESEJADO FOI REMOVIDO DAQUI >>> */}

      <div className={styles.buttonGroup}>
        <button onClick={handlePathChoiceReading} disabled={isPending || (!user && visitorHasRead)} className={styles.mainSubmitButton}>
          {(!user && visitorHasRead) ? 'Limite de teste atingido' : 'Revelar os Caminhos'}
        </button>
        <button onClick={() => { setFormType('default'); setSelectedSpread(null); }} disabled={isPending} className={styles.secondaryButton}>Voltar</button>
      </div>
    </div>
  );

  // --- RENDERIZAÇÃO DA PÁGINA ---

  return (
    <div className={styles.homeContainer}>
      <video key={videoAtualIndex} autoPlay muted playsInline onEnded={handleVideoEnd} className={styles.videoFundo}>
        <source src={listaDeVideos[videoAtualIndex]} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <div className={styles.videoOverlay}></div>
      <div className={styles.conteudoCentralizado}>
        <h1 className={styles.mainTitleLogo}>ORÁCULO</h1>
        <p className={styles.mysticText} aria-live="polite">
          {mysticPhrase}
        </p>

        {formType === 'default' ? defaultForm : pathChoiceForm}

        {/* --- MOSTRAR ERROS --- */}
        {formError && <p className={styles.errorMessage}>{formError}</p>}
        {mutationError && <p className={styles.errorMessage}>Falha ao iniciar leitura: {mutationError.message}</p>}

        {!user && visitorHasRead && formType !== 'pathChoice' && !selectedSpread && (
          <p className={styles.limitMessage}>Você já utilizou sua leitura de teste gratuita. <Link to="/cadastro">Cadastre-se</Link> ou <Link to="/login">faça login</Link> para leituras ilimitadas.</p>
        )}
      </div>
    </div>
  );
}

export default TarotPage;
