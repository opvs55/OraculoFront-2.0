import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGenerateReading } from '../hooks/useReadings';
import Loader from '../components/common/Loader/Loader';
import { suggestedQuestions } from '../constants/suggestionConstants'; 
import styles from './TarotPage.module.css'; // Certifique-se que o nome do CSS está correto aqui

const listaDeVideos = [
  '/assets/video1.mp4',
  '/assets/video2.mp4',
  '/assets/video3.mp4',
  '/assets/video4.mp4',
  '/assets/video5.mp4',
  // '/assets/video6.mp4' // Descomente se tiver o vídeo 6
];

// Chave para o localStorage
const VISITOR_READING_KEY = 'visitorReadingDone';

function TarotPage() { // Renomeado de HomePage para TarotPage
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: generateReading, isPending, error, reset } = useGenerateReading(); // Adicionado reset
  const [videoAtualIndex, setVideoAtualIndex] = useState(() => Math.floor(Math.random() * listaDeVideos.length)); // Inicia aleatório
  
  const [formType, setFormType] = useState('default');
  const [question, setQuestion] = useState('');
  const [path1, setPath1] = useState('');
  const [path2, setPath2] = useState('');
  const [selectedSpread, setSelectedSpread] = useState(null);
  
  // NOVO: Estado para controlar se o visitante já fez a leitura
  const [visitorHasRead, setVisitorHasRead] = useState(false);

  // Verifica o localStorage ao carregar a página
  useEffect(() => {
    if (!user) { // Só verifica para visitantes
      const hasDoneReading = localStorage.getItem(VISITOR_READING_KEY);
      if (hasDoneReading === 'true') {
        setVisitorHasRead(true);
      }
    }
  }, [user]);

  // Limpa pergunta e erro ao mudar tipo de tiragem ou formulário
  useEffect(() => {
    setQuestion('');
    reset(); // Limpa o estado de erro da mutação
  }, [selectedSpread, formType, reset]);

  const handleVideoEnd = () => {
    setVideoAtualIndex((prevIndex) => (prevIndex + 1) % listaDeVideos.length);
  };

  // Função PRINCIPAL para iniciar leitura (tiragens padrão)
  const handleStartReading = () => {
    // 1. Verifica se pode fazer leitura (logado ou visitante que não leu)
    if (!user && visitorHasRead) {
      alert('Você já realizou sua leitura de teste gratuita. Cadastre-se ou faça login para leituras ilimitadas!');
      return;
    }
    if (!selectedSpread) {
      alert('Por favor, selecione um tipo de tiragem.');
      return;
    }
    if (question.trim() === '') {
      alert('Por favor, digite sua pergunta ou escolha uma sugestão.');
      return;
    }

    console.log(`Iniciando leitura do tipo: ${selectedSpread}`);
    reset(); // Limpa erros anteriores

    generateReading({ question, user: user || null, spreadType: selectedSpread }, {
      onSuccess: (data) => {
        // --- NAVEGAÇÃO INTELIGENTE ---
        if (data.id && data.id.startsWith('temp-')) {
          // VISITANTE: Navega passando os dados no estado
          localStorage.setItem(VISITOR_READING_KEY, 'true'); // Marca que o visitante leu
          setVisitorHasRead(true); // Atualiza o estado local
          navigate(`/leitura/${data.id}`, { state: { readingData: data } });
        } else {
          // LOGADO: Navega normalmente apenas com o ID
          navigate(`/leitura/${data.id}`);
        }
      },
      onError: (err) => {
        // O erro já será exibido pelo 'error' da mutação
        console.error("Erro no generateReading:", err); 
        // alert(`Ocorreu um erro ao gerar sua leitura: ${err.message}`); // Pode remover o alert se o erro já aparece
      }
    });
  };
  
  // Função para Escolha de Caminho (lógica similar)
  const handlePathChoiceReading = () => {
     if (!user && visitorHasRead) {
      alert('Você já realizou sua leitura de teste gratuita. Cadastre-se ou faça login para leituras ilimitadas!');
      return;
    }
    if (path1.trim() === '' || path2.trim() === '') {
      alert('Por favor, descreva os dois caminhos.');
      return;
    }
    const questionToSend = { path1, path2 };
    reset(); // Limpa erros anteriores

    generateReading({ question: questionToSend, user: user || null, spreadType: 'pathChoice' }, {
      onSuccess: (data) => {
         if (data.id && data.id.startsWith('temp-')) {
          localStorage.setItem(VISITOR_READING_KEY, 'true'); 
          setVisitorHasRead(true); 
          navigate(`/leitura/${data.id}`, { state: { readingData: data } });
        } else {
          navigate(`/leitura/${data.id}`);
        }
      },
      onError: (err) => console.error("Erro no generateReading (PathChoice):", err),
    });
  };

  if (isPending) {
    return <Loader customText="Canalizando a sabedoria dos arcanos..." />;
  }

  // Formulário Padrão
  const defaultForm = (
    <div className={styles.formContainer}>
      <p className={styles.subtitle}>Selecione um método de leitura abaixo.</p>
      <div className={styles.buttonGroup}>
        {/* Botões de seleção de tiragem */}
        <button onClick={() => setSelectedSpread('celticCross')} className={`${styles.submitButton} ${selectedSpread === 'celticCross' ? styles.activeButton : ''}`}>Cruz Celta</button>
        <button onClick={() => setSelectedSpread('threeCards')} className={`${styles.submitButton} ${selectedSpread === 'threeCards' ? styles.activeButton : ''}`}>3 Cartas</button>
        <button onClick={() => setSelectedSpread('templeOfAphrodite')} className={`${styles.submitButton} ${selectedSpread === 'templeOfAphrodite' ? styles.activeButton : ''}`}>Templo de Afrodite</button>
        <button onClick={() => setFormType('pathChoice')} className={styles.submitButton}>Escolha de Caminho</button>
      </div>

      {/* Seção de Sugestões */}
      {selectedSpread && suggestedQuestions[selectedSpread]?.length > 0 && (
        <div className={styles.suggestionsContainer}>
          <h4 className={styles.suggestionTitle}>Não sabe o que perguntar? Tente uma destas:</h4>
          <ul className={styles.suggestionList}>
            {suggestedQuestions[selectedSpread].map((q, index) => (
              <li key={index} onClick={() => setQuestion(q)} className={styles.suggestionItem}>"{q}"</li>
            ))}
          </ul>
        </div>
      )}

      {/* Caixa de Pergunta e Botão Principal (só aparecem se tiragem selecionada) */}
      {selectedSpread && (
        <>
          <textarea
            className={styles.questionTextarea}
            placeholder="Digite sua pergunta aqui ou clique em uma sugestão acima..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isPending || (!user && visitorHasRead)} // Desabilita se for visitante e já leu
          />
          <button 
            onClick={handleStartReading} 
            disabled={isPending || (!user && visitorHasRead)} // Desabilita se for visitante e já leu
            className={styles.mainSubmitButton}
          >
            {(!user && visitorHasRead) ? 'Limite de teste atingido' : 'Revelar Leitura'}
          </button>
        </>
      )}
    </div>
  );

  // Formulário de Escolha de Caminho
  const pathChoiceForm = (
    <div className={styles.formContainer}>
       <p className={styles.subtitle}>Descreva os dois caminhos que você está considerando.</p>
       <input type="text" className={styles.pathInput} placeholder="Caminho 1 (ex: Ficar no emprego atual)" value={path1} onChange={(e) => setPath1(e.target.value)} disabled={isPending || (!user && visitorHasRead)} />
       <input type="text" className={styles.pathInput} placeholder="Caminho 2 (ex: Aceitar a nova proposta)" value={path2} onChange={(e) => setPath2(e.target.value)} disabled={isPending || (!user && visitorHasRead)} />
      <div className={styles.buttonGroup}>
        <button onClick={handlePathChoiceReading} disabled={isPending || (!user && visitorHasRead)} className={styles.mainSubmitButton}>
           {(!user && visitorHasRead) ? 'Limite de teste atingido' : 'Revelar os Caminhos'}
        </button>
        <button onClick={() => { setFormType('default'); setSelectedSpread(null); }} disabled={isPending} className={styles.secondaryButton}>Voltar</button>
      </div>
    </div>
  );

  return (
    <div className={styles.homeContainer}>
      <video key={videoAtualIndex} autoPlay muted playsInline onEnded={handleVideoEnd} className={styles.videoFundo}>
        <source src={listaDeVideos[videoAtualIndex]} type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>
      <div className={styles.videoOverlay}></div>
      <div className={styles.conteudoCentralizado}>
        <h1 className={styles.mainTitleLogo}>ORÁCULO IA</h1>
        {formType === 'default' ? defaultForm : pathChoiceForm}
        {/* Mostra mensagem de limite para visitantes */}
        {!user && visitorHasRead && formType !== 'pathChoice' && !selectedSpread && (
             <p className={styles.limitMessage}>Você já utilizou sua leitura de teste gratuita. <Link to="/cadastro">Cadastre-se</Link> ou <Link to="/login">faça login</Link> para leituras ilimitadas.</p>
        )}
        {/* Mostra erro da mutação */}
        {error && <p className={styles.errorMessage}>Falha ao iniciar leitura: {error.message}</p>} 
      </div>
    </div>
  );
}

// ATENÇÃO: Renomeie a exportação padrão se o nome da função mudou
export default TarotPage; // Ou HomePage se você manteve o nome da função