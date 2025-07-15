// src/pages/auth/CadastroPage.jsx - VERSÃO COM REDIRECIONAMENTO CORRETO

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';

function CadastroPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate('/painel');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }

    setLoading(true);

    const { data: existingUser, error: usernameError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      setError('Este nome de usuário já está em uso.');
      setLoading(false);
      return;
    }
    if (usernameError && usernameError.code !== 'PGRST116') {
      setError(usernameError.message);
      setLoading(false);
      return;
    }

    // 2. Cria o usuário, passando o 'username' e a URL de redirecionamento.
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          username: username 
        },
        // NOVO: Aqui está a mágica! Especificamos para onde o link de confirmação deve levar.
        // Ele vai usar a URL base do seu site e adicionar o caminho '/painel'.
        // Isso funciona tanto em localhost quanto em produção!
        emailRedirectTo: `${window.location.origin}/painel`,
      }
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // ALTERADO: Mensagem mais clara para o usuário.
      alert('Cadastro realizado! ✨ Enviamos um link de confirmação para o seu e-mail. Clique nele para validar sua conta e acessar seu painel.');
      // Removemos o navigate('/login') para que o usuário foque em checar o e-mail.
    }
    setLoading(false);
  };

  if (user) return null;

  return (
    <main>
      <div className="content_wrapper">
        <div className={styles.authContainer}>
          <h1 className={styles.title}>Criar Conta</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* ... o resto do seu formulário JSX continua o mesmo ... */}
            <div className={styles.inputGroup}>
              <label htmlFor="username">Nome de Usuário</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha (mínimo 6 caracteres)</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Criando...' : 'Cadastrar'}
            </button>
          </form>
          {error && <p className={styles.error}>{error}</p>}
          <p className={styles.link}>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
        </div>
      </div>
    </main>
  );
}

export default CadastroPage;