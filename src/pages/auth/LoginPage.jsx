import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
import Loader from '../../components/common/Loader/Loader';
import { translateSupabaseError } from '../../utils/authErrorUtils';
import { isEmail, normalizeIdentifier } from '../../utils/authValidation';

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) navigate('/meu-grimorio');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedIdentifier = normalizeIdentifier(identifier);

    try {
      const email = isEmail(normalizedIdentifier)
        ? normalizedIdentifier
        : await resolveEmailByUsername(normalizedIdentifier);

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

  const resolveEmailByUsername = async (username) => {
    if (!username) {
      throw new Error('Invalid login credentials');
    }

    const { data: userEmail, error: rpcError } = await supabase.rpc(
      'get_email_by_username',
      { p_username: username }
    );

    if (rpcError || !userEmail) {
      throw new Error('Invalid login credentials');
    }

    return userEmail;
  };

  if (authLoading) return <Loader />;

  return (
    <div className="content_wrapper">
      <div className={styles.authContainer}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>
          Entre com seu e-mail ou nome de usuário para acessar sua conta.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="identifier">E-mail ou usuário</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWithAction}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.linksContainer}>
          <p className={styles.link}>
            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
          <p className={styles.link}>
            <Link to="/recuperar-senha">Esqueci minha senha</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
