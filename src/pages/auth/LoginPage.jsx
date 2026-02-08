import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
import Loader from '../../components/common/Loader/Loader';
import { translateSupabaseError } from '../../utils/authErrorUtils';

const SOCIAL_PROVIDERS = [
  { id: 'google', label: 'Continuar com Google' },
  { id: 'facebook', label: 'Continuar com Facebook' },
];

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOauthLoading, setIsOauthLoading] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) navigate('/meu-grimorio');
  }, [user, navigate]);

  const resolveEmailFromIdentifier = async (value) => {
    if (value.includes('@')) return value;

    const { data: userEmail, error: rpcError } = await supabase.rpc(
      'get_email_by_username',
      { p_username: value }
    );

    if (rpcError || !userEmail) {
      throw new Error('Invalid login credentials');
    }

    return userEmail;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedIdentifier = identifier.trim();
      if (!normalizedIdentifier || !password.trim()) {
        setError('Preencha seu usuário/e-mail e senha para continuar.');
        setLoading(false);
        return;
      }

      const email = await resolveEmailFromIdentifier(normalizedIdentifier);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      navigate('/meu-grimorio');
    } catch (err) {
      setError(translateSupabaseError(err));
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setError('');
    setIsOauthLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/meu-grimorio`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      setError(translateSupabaseError(err));
      console.error('Erro no login social:', err);
    } finally {
      setIsOauthLoading(false);
    }
  };

  if (authLoading) return <Loader />;

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Entrar na sua conta</h1>
          <p className={styles.subtitle}>Acesse seu oráculo pessoal de forma segura.</p>
        </div>

        <div className={styles.socialSection}>
          {SOCIAL_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              type="button"
              className={styles.socialButton}
              onClick={() => handleOAuthLogin(provider.id)}
              disabled={isOauthLoading || loading}
            >
              {isOauthLoading ? 'Aguarde...' : provider.label}
            </button>
          ))}
        </div>

        <div className={styles.divider}>
          <span>ou</span>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">Usuário ou e-mail</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="seu@email.com ou seu usuário"
              autoComplete="username"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading || isOauthLoading}>
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
