import React from 'react';
// 1. Importar useLocation
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'; 
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabaseClient';
import Loader from '../../components/common/Loader/Loader';

import styles from './ProfilePage.module.css';

// Hook para buscar perfil PÚBLICO pelo username
function usePublicProfile(username) {
  return useQuery({
    // A chave inclui o username para buscar dados específicos
    queryKey: ['publicProfile', username], 
    queryFn: async () => {
      if (!username) return null;
      
      // Buscamos na tabela 'profiles' onde o username bate
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          username,
          full_name,
          avatar_url,
          bio,
          minha_historia,
          entidade_cultuada 
        `) // Selecionamos apenas os campos que queremos mostrar publicamente
        .eq('username', username)
        .single(); // Esperamos apenas um resultado

      // Tratamento de erro se o perfil não for encontrado
      if (error && error.code === 'PGRST116') {
        throw new Error('Perfil não encontrado.'); // Lança erro 404
      } else if (error) {
        throw new Error(error.message); // Outros erros
      }
      
      return data;
    },
    enabled: !!username, // Só executa se tivermos um username
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
}


function ProfilePage() {
  const { username } = useParams(); // Pega o username da URL
  const navigate = useNavigate(); // Hook para navegação programática
  // 2. Inicializar o useLocation
  const location = useLocation(); 
  const { data: profile, isLoading, isError, error } = usePublicProfile(username);

  // 3. Criar a função de "Voltar" com fallback
  const handleBackClick = () => {
    // O 'location.key' ajuda a saber se esta é a primeira página na pilha de navegação.
    // Se for "default", significa que não há "onde" voltar (entrada direta na URL).
    if (location.key !== "default") {
      navigate(-1); // Comportamento normal: Volta para a página anterior (ex: /comunidade)
    } else {
      navigate('/'); // Fallback: vai para a Home
    }
  };

  if (isLoading) return <Loader customText={`Carregando perfil de @${username}...`} />;
  
  // Renderização de erro
  if (isError) {
    return (
      // Aplicamos o grid wrapper aqui também para consistência
      <div className={`content_wrapper ${styles.profileGridWrapper}`}>
        <div className={`${styles.profileContainer} ${styles.notFound}`}>
          <h1>Erro</h1>
          <p>{error.message === 'Perfil não encontrado.' ? `O perfil @${username} não existe.` : 'Ocorreu um erro ao carregar o perfil.'}</p>
          {/* 4. Usar a nova função no onClick */}
          <button onClick={handleBackClick} className={styles.backButton}>Voltar</button> 
        </div>
      </div>
    );
  }

  // Renderização principal do perfil
  return (
    // Usamos o content_wrapper global e adicionamos nosso grid específico
    <div className={`content_wrapper ${styles.profileGridWrapper}`}> 
      {/* Este container agora fica na coluna central do grid em telas grandes */}
      <div className={styles.profileContainer}> 
        {/* 4. Usar a nova função no onClick */}
        <button onClick={handleBackClick} className={styles.backButton}>← Voltar</button> 

        {/* Seção do Header do Perfil */}
        <header className={styles.profileHeader}>
          <img 
            src={profile.avatar_url || 'https://i.imgur.com/6VBx3io.png'} 
            alt={`Avatar de ${profile.username}`}
            className={styles.profileAvatar}
          />
          <div className={styles.profileTitles}>
            <h1>{profile.full_name || profile.username}</h1>
            <p className={styles.profileUsername}>@{profile.username}</p>
          </div>
        </header>

        {/* Seção da Bio */}
        {profile.bio && (
          <section className={styles.profileSection}>
            <p className={styles.bioText}>"{profile.bio}"</p>
          </section>
        )}

        {/* Seção da Entidade Cultuada */}
        {profile.entidade_cultuada && (
          <section className={styles.profileSection}>
            <h2>Cultua / Admira</h2>
            <p>{profile.entidade_cultuada}</p>
          </section>
        )}

        {/* Seção Minha História */}
        {profile.minha_historia && (
          <section className={styles.profileSection}>
            <h2>Minha História</h2>
            {/* Dividimos a história em parágulos para melhor leitura */}
            <div className={styles.storyText}>
              {profile.minha_historia.split('\n').map((paragraph, index) => (
                // Renderiza parágrafo ou um espaço não quebrável se for linha vazia, para manter espaçamento
                <p key={index}>{paragraph || '\u00A0'}</p> 
              ))}
            </div>
          </section>
        )}

        {/* Adicionar mais seções aqui no futuro (Signo, etc.) */}

        {/* Botão Voltar no final também (opcional, mas bom para páginas longas) */}
        {/* 4. Usar a nova função no onClick */}
        <button onClick={handleBackClick} className={styles.backButton} style={{ marginTop: '2rem' }}>← Voltar</button> 

      </div> {/* Fim do profileContainer */}
    </div> // Fim do profileGridWrapper
  );
}

export default ProfilePage;