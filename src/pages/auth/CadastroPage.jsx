import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
import { translateSupabaseError } from '../../utils/authErrorUtils';
import {
  MIN_PASSWORD_LENGTH_VALUE,
  normalizeIdentifier,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
} from '../../utils/authValidation';

function CadastroPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [msgSucesso, setMsgSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/meu-grimorio');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsgSucesso('');

    const normalizedUsername = normalizeIdentifier(username);
    const normalizedEmail = normalizeIdentifier(email).toLowerCase();

    const usernameError = validateUsername(normalizedUsername);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    const emailError = validateEmail(normalizedEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const confirmPasswordError = validatePasswordMatch(password, confirmPassword);
    if (confirmPasswordError) {
      setError(confirmPasswordError);
      return;
    }

    setLoading(true);

    try {
      const { data: existingUser, error: usernameLookupError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', normalizedUsername)
        .maybeSingle();

      if (usernameLookupError) {
        throw usernameLookupError;
      }

      if (existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            username: normalizedUsername,
          },
          emailRedirectTo: `${window.location.origin}/meu-grimorio`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user && !data.session) {
        setMsgSucesso(
          `Cadastro realizado! Enviamos um link de confirmação para ${normalizedEmail}. Verifique sua caixa de entrada (e spam).`
        );
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else if (data.session) {
        navigate('/meu-grimorio');
      }
    } catch (err) {
      setError(translateSupabaseError(err));
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (user) return null;

  return (
    <main>
      <div className="content_wrapper">
        <div className={styles.authContainer}>
          <h1 className={styles.title}>Criar Conta</h1>
          <p className={styles.subtitle}>
            Use um e-mail válido e crie uma senha segura para iniciar.
          </p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="username">Nome de Usuário</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
              <span className={styles.helperText}>
                3-20 caracteres, letras, números ou _ . -
              </span>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">
                Senha (mínimo {MIN_PASSWORD_LENGTH_VALUE} caracteres)
              </label>
              <div className={styles.inputWithAction}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <div className={styles.inputWithAction}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Criando...' : 'Cadastrar'}
            </button>
          </form>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          {msgSucesso && (
            <div className={styles.successMessage} role="status">
              {msgSucesso}
            </div>
          )}

          <p className={styles.link}>
            Já tem uma conta? <Link to="/login">Faça Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default CadastroPage;
