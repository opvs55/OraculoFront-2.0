import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';
import { translateSupabaseError } from '../../utils/authErrorUtils';

function CadastroPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [msgSucesso, setMsgSucesso] = useState(''); // NOVO: Estado para mensagem de sucesso
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

    if (password !== confirmPassword) {
      setError('As senhas não correspondem.');
      return;
    }
    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    setLoading(true);

    try {
      // 1. Verifica se o username já existe
      const { data: existingUser, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
      }
      
      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError;
      }

      // 2. Cria o usuário
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username: username 
          },
          // IMPORTANTE: Define para onde o usuário volta após clicar no link do email
          emailRedirectTo: `${window.location.origin}/meu-grimorio`, 
        }
      });

      if (signUpError) {
        throw signUpError;
      } 

      // LÓGICA DE SUCESSO CORRIGIDA:
      
      // Cenário A: Confirmação de email ATIVADA (O que você quer)
      // O usuário é criado, mas data.session é null.
      if (data.user && !data.session) {
         setMsgSucesso(`Cadastro realizado! Enviamos um link de confirmação para ${email}. Verifique sua caixa de entrada (e spam).`);
         // Limpa o formulário
         setUsername('');
         setEmail('');
         setPassword('');
         setConfirmPassword('');
      } 
      // Cenário B: Caso a confirmação esteja desligada (fallback)
      else if (data.session) {
         navigate('/meu-grimorio');
      }

    } catch (err) {
      setError(translateSupabaseError(err));
      console.error("Erro no cadastro:", err);
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
              <input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Senha (mínimo 6 caracteres)</label>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Criando...' : 'Cadastrar'}
            </button>
          </form>
          
          {/* Exibe erro se houver */}
          {error && <p className={styles.error}>{error}</p>}
          
          {/* EXIBE MENSAGEM DE SUCESSO (Verde) */}
          {msgSucesso && (
            <div style={{
              marginTop: '1rem', 
              padding: '10px', 
              background: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px',
              border: '1px solid #c3e6cb'
            }}>
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
