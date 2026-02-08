// src/pages/auth/ResetPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './AuthPage.module.css'; // Reutilizamos o mesmo estilo!

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [canReset, setCanReset] = useState(false);
  const navigate = useNavigate();

  // Este useEffect é a parte mais importante.
  // Ele escuta o evento de autenticação que acontece quando o usuário
  // chega nesta página através do link de recuperação de senha.
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Se o evento for de recuperação de senha, o Supabase já criou uma sessão segura.
        // Agora, permitimos que o formulário seja exibido para o usuário.
        setCanReset(true);
      }
    });

    // Limpa a "escuta" do evento quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Como já estamos em uma sessão de "PASSWORD_RECOVERY",
      // o Supabase sabe qual usuário deve ser atualizado.
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage(
        'Sua senha foi redefinida com sucesso! Você será redirecionado para o login em 5 segundos.'
      );

      // Redireciona para o login após 5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      setError(
        'Não foi possível redefinir a senha. O link pode ter expirado. Por favor, tente novamente.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!canReset) {
    return (
      <div className={`content_wrapper ${styles.authPageWrapper}`}>
        <div className={styles.authContainer}>
          <p>Verificando o link de recuperação...</p>
          <p>
            Se você não foi redirecionado pelo seu e-mail, por favor,{' '}
            <Link to="/recuperar-senha">solicite um novo link</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`content_wrapper ${styles.authPageWrapper}`}>
      <div className={styles.authContainer}>
        <h1 className={styles.title}>Cadastrar Nova Senha</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Nova Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirme a Nova Senha</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button} disabled={loading || message}>
            {loading ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
