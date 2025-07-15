// src/components/Chat/Chat.jsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { getChatResponse } from '../../services/aiService';
import { supabase } from '../../supabaseClient';

// NOTE: Não precisamos mais do useAuth aqui, pois o user_id será definido pelo DB
function Chat({ chatContext, readingId, cardName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messageListRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('reading_id', readingId)
        .eq('card_name', cardName)
        .order('created_at', { ascending: true });
      
      if (fetchError) {
        console.error("ERRO AO BUSCAR HISTÓRICO DO CHAT:", fetchError);
        setError("Não foi possível carregar o histórico da conversa.");
      } else {
        const formattedMessages = data.flatMap(item => [
          { role: 'user', text: item.user_message },
          { role: 'model', text: item.ai_response }
        ]);
        setMessages([{ role: 'model', text: 'Pergunte o que quiser sobre esta carta e sua posição...' }, ...formattedMessages]);
      }
    };
    if(readingId && cardName) { // Garante que temos os IDs antes de buscar
        fetchChatHistory();
    }
  }, [readingId, cardName]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageText = input;
    const userMessage = { role: 'user', text: userMessageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const { aiResponse } = await getChatResponse(userMessageText, chatContext);
      const modelMessage = { role: 'model', text: aiResponse };

      // ===================================================================
      // A MUDANÇA ESTÁ AQUI: Removemos o user_id do objeto de inserção
      // ===================================================================
      const { error: insertError } = await supabase.from('chat_messages').insert({
        reading_id: readingId,
        card_name: cardName,
        user_message: userMessageText,
        ai_response: aiResponse,
        // A coluna 'user_id' será preenchida automaticamente pelo Supabase
        // graças ao "Default Value" que definimos na tabela.
      });
      
      if (insertError) {
        throw insertError; // Lança o erro para ser pego pelo bloco catch
      }
      
      setMessages(prev => [...prev, modelMessage]);

    } catch (err) {
      console.error("Erro no handleSendMessage:", err);
      setError('Desculpe, não consegui processar ou salvar sua pergunta agora.');
      setMessages(prev => prev.slice(0, -1)); // Remove a mensagem do usuário da tela se deu erro
    } finally {
      setIsLoading(false);
    }
  };
  
  const userMessagesCount = messages.filter(msg => msg.role === 'user').length;
  const hasReachedLimit = userMessagesCount >= 3;

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageList} ref={messageListRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className={`${styles.message} ${styles.model} ${styles.loading}`}><span>.</span><span>.</span><span>.</span></div>}
      </div>
      
      {error && <p className={styles.error}>{error}</p>}

      {hasReachedLimit ? (
        <div className={styles.limitMessage}>Você atingiu o limite de 3 perguntas para esta carta.</div>
      ) : (
        <form onSubmit={handleSendMessage} className={styles.inputForm}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Sua pergunta... (${userMessagesCount}/3)`}
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