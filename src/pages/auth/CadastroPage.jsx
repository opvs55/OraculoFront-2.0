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
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Se o AuthContext detectar um usuário, redireciona.
  // Isso serve tanto para quem já estava logado quanto para quando o 
  // signUp for concluído com sucesso e o estado atualizar.
  useEffect(() => {
    if (user) {
      navigate('/meu-grimorio');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações básicas de frontend
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
      // OBS: Isso requer que a tabela 'profiles' tenha permissão de leitura pública (RLS)
      const { data: existingUser, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      // Se encontrou um usuário com esse nome, bloqueia
      if (existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
      }
      
      // Se deu erro na busca, verificamos se é apenas "não encontrado" (o que é bom)
      if (usernameError && usernameError.code !== 'PGRST116') {
        throw usernameError; // Outros erros de conexão ou permissão
      }

      // 2. Tenta criar o usuário e logar automaticamente
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username: username 
          }
          // REMOVIDO: emailRedirectTo (pois não há mais link de confirmação)
        }
      });

      if (signUpError) {
        throw signUpError;
      } 

      // SUCESSO:
      // Como a confirmação de email está desligada, data.session já vem preenchido.
      // Não precisamos de alert. O useEffect lá em cima vai detectar o usuário e redirecionar.
      // Mas para garantir uma resposta imediata na UI, podemos forçar aqui também:
      if (data.session) {
          navigate('/meu-grimorio');
      }

    } catch (err) {
      // Traduz o erro (ex: senha fraca, email inválido, etc)
      setError(translateSupabaseError(err));
      console.error("Erro no cadastro:", err);
    } finally {
      setLoading(false);
    }
  };

  // Se já estiver logado (e o useEffect ainda não tiver redirecionado por latência), não mostra o form
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
          
          {error && <p className={styles.error}>{error}</p>}
          
          <p className={styles.link}>
            Já tem uma conta? <Link to="/login">Faça Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default CadastroPage;
