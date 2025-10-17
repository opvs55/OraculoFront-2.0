import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
import Loader from '../../components/common/Loader/Loader';
// Importamos o tradutor (embora usemos menos aqui)
import { translateSupabaseError } from '../../utils/authErrorUtils';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // CORREÇÃO: Redirecionar para /meu-grimorio
    if (user) navigate('/meu-grimorio'); 
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Busca o e-mail pelo username
      const { data: userEmail, error: rpcError } = await supabase.rpc(
        'get_email_by_username', 
        { p_username: username }
      );
      
      // Se não encontrar o usuário ou der erro na busca, mostra erro genérico
      if (rpcError || !userEmail) {
        // Usamos a mensagem padrão de credenciais inválidas
        throw new Error('Invalid login credentials'); 
      }
      
      // 2. Tenta o login com e-mail e senha
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });

      // Se o login falhar, mostra o erro genérico
      if (signInError) {
        throw signInError; // Lança o erro para ser traduzido
      }

      // Se tudo deu certo, redireciona
      navigate('/meu-grimorio'); // CORREÇÃO: Redirecionar para /meu-grimorio

    } catch (err) {
      // ALTERAÇÃO: Usamos o tradutor para garantir a mensagem padrão de login inválido
      setError(translateSupabaseError(err)); 
      console.error("Erro no login:", err); // Mantém o log detalhado
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Loader />;

  return (
    <div className="content_wrapper">
      <div className={styles.authContainer}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Nome de Usuário</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.linksContainer}>
          <p className={styles.link}>Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
          <p className={styles.link}><Link to="/recuperar-senha">Esqueci minha senha</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;