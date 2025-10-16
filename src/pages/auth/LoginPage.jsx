import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
import Loader from '../../components/common/Loader/Loader';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) navigate('/painel');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: userEmail, error: rpcError } = await supabase.rpc(
        'get_email_by_username', 
        { p_username: username }
      );
      
      if (rpcError || !userEmail) {
        throw new Error('Nome de usuário ou senha inválidos.');
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: password,
      });

      if (signInError) {
        throw new Error('Nome de usuário ou senha inválidos.');
      }

      navigate('/painel');

    } catch (err) {
      setError(err.message);
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
          {/* NOVO LINK ADICIONADO AQUI */}
          <p className={styles.link}><Link to="/recuperar-senha">Esqueci minha senha</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;