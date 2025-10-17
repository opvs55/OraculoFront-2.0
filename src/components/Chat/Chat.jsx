import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { getChatResponse } from '../../services/aiService';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext'; // Precisamos do usuário para contar

// Limite de perguntas por usuário
const MAX_USER_QUESTIONS = 3;

function Chat({ chatContext, readingId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messageListRef = useRef(null);
  const { user } = useAuth(); // Pegamos o usuário logado

  // Estado para contar quantas perguntas o usuário já fez NESTA sessão
  const [userQuestionsCount, setUserQuestionsCount] = useState(0);
  const hasReachedLimit = userQuestionsCount >= MAX_USER_QUESTIONS;

  // Busca o histórico do chat para esta leitura específica
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!readingId) return; // Só busca se tivermos o ID da leitura

      setIsLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('reading_id', readingId)
          // ALTERAÇÃO: Não filtramos mais por card_name
          .order('created_at', { ascending: true });
        
        if (fetchError) throw fetchError;

        // Formata as mensagens e conta quantas perguntas o usuário fez
        let count = 0;
        const formattedMessages = data.flatMap(item => {
          count++; // Cada par (pergunta/resposta) conta como 1 pergunta feita
          return [
            { role: 'user', text: item.user_message },
            { role: 'model', text: item.ai_response }
          ];
        });

        setMessages([{ role: 'model', text: 'Tem alguma dúvida sobre sua leitura? Pergunte!' }, ...formattedMessages]);
        setUserQuestionsCount(count); // Atualiza a contagem

      } catch (err) {
        console.error("ERRO AO BUSCAR HISTÓRICO DO CHAT:", err);
        setError("Não foi possível carregar o histórico da conversa.");
        setMessages([{ role: 'model', text: 'Tem alguma dúvida sobre sua leitura? Pergunte!' }]);
        setUserQuestionsCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistory();
  }, [readingId]);

  // Rola para o final da lista de mensagens
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Envia a mensagem do usuário
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || hasReachedLimit || !user) return; // Não envia se limite atingido ou deslogado

    const userMessageText = input;
    const userMessage = { role: 'user', text: userMessageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      // Chama a IA
      const { aiResponse } = await getChatResponse(userMessageText, chatContext);
      const modelMessage = { role: 'model', text: aiResponse };

      // Salva no banco (agora sem card_name)
      const { error: insertError } = await supabase.from('chat_messages').insert({
        reading_id: readingId,
        user_id: user.id, // Adicionamos o user_id aqui explicitamente
        user_message: userMessageText,
        ai_response: aiResponse,
        // card_name: null, // Não precisamos mais disso
      });
      
      if (insertError) throw insertError;
      
      setMessages(prev => [...prev, modelMessage]);
      setUserQuestionsCount(prev => prev + 1); // Incrementa a contagem

    } catch (err) {
      console.error("Erro no handleSendMessage:", err);
      setError('Desculpe, não consegui processar ou salvar sua pergunta agora.');
      setMessages(prev => prev.slice(0, -1)); // Remove a mensagem do usuário da tela
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h4>Aprofunde sua Leitura</h4>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className={`${styles.message} ${styles.model} ${styles.loading}`}><span>.</span><span>.</span><span>.</span></div>}
      </div>
      
      {error && <p className={styles.error}>{error}</p>}

      {!user ? (
          <div className={styles.limitMessage}>Você precisa estar logado para usar o chat.</div>
      ) : hasReachedLimit ? (
        <div className={styles.limitMessage}>Você atingiu o limite de {MAX_USER_QUESTIONS} perguntas para esta leitura.</div>
      ) : (
        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Sua pergunta... (${userQuestionsCount}/${MAX_USER_QUESTIONS})`}
            disabled={isLoading}
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading}>Enviar</button>
        </form>
      )}
    </div>
  );
}

export default Chat;