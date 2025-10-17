import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
// NOVO: Importamos nosso tradutor
import { translateSupabaseError } from '../../utils/authErrorUtils';

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
    // CORREÇÃO: Redirecionar para /meu-grimorio
    if (user) navigate('/meu-grimorio'); 
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }
    // Adicionando validação de comprimento da senha no frontend
    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setLoading(true);

    try {
      // 1. Verifica se o username já existe (lógica mantida)
      const { data: existingUser, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
      }
      // Ignora o erro 'PGRST116' (nenhuma linha encontrada), que é o esperado se o user não existe
      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError; // Lança outros erros do Supabase
      }

      // 2. Tenta criar o usuário
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username: username 
          },
          // CORREÇÃO: Usar a URL base dinâmica e o caminho correto
          emailRedirectTo: `${window.location.origin}/meu-grimorio`, 
        }
      });

      if (signUpError) {
        throw signUpError; // Lança o erro do Supabase para ser traduzido
      } else {
        alert('Cadastro realizado! ✨ Enviamos um link de confirmação para o seu e-mail. Clique nele para validar sua conta.');
        // Limpa o formulário após sucesso
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }

    } catch (err) {
      // ALTERAÇÃO: Usamos o tradutor para definir a mensagem de erro
      setError(translateSupabaseError(err)); 
      console.error("Erro no cadastro:", err); // Mantém o log detalhado no console
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
          <form onSubmit={handleSubmit} className={styles.form}>
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