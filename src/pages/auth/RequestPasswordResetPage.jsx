// src/pages/auth/RequestPasswordResetPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import styles from './AuthPage.module.css'; // Reutilizamos o mesmo estilo!

function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // URL para onde o usuário será redirecionado APÓS clicar no link do e-mail.
    // Ela precisa corresponder à URL configurada no seu painel do Supabase.
    // E também à rota que criaremos no nosso App.jsx no próximo passo.
    const redirectTo = `${window.location.origin}/resetar-senha`;

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (resetError) {
        throw resetError;
      }

      setMessage('Se existir uma conta com este e-mail, um link de recuperação foi enviado. Por favor, verifique sua caixa de entrada e spam.');

    } catch (err) {
      setError('Não foi possível enviar o e-mail de recuperação. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Recuperar Senha</h1>
          <p className={styles.subtitle}>Digite seu e-mail para receber um link de redefinição de senha.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
            <span className={styles.helperText}>
              Se o e-mail estiver cadastrado, você receberá a mensagem em instantes.
            </span>
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link'}
          </button>
        </form>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.linksContainer}>
          <p className={styles.link}><Link to="/login">Voltar para o Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RequestPasswordResetPage;
