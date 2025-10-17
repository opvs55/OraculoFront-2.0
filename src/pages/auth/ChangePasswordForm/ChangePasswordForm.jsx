import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import { useAuth } from '../../../context/AuthContext'; // Precisamos do e-mail do usuário atual
import styles from './ChangePasswordForm.module.css';

function ChangePasswordForm() {
  const { user } = useAuth(); // Pega os dados do usuário logado
  const [currentPassword, setCurrentPassword] = useState(''); // NOVO campo
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (!currentPassword) {
      setError('Por favor, digite sua senha atual.');
      return;
    }
    if (!user?.email) {
      setError('Erro: Não foi possível identificar o usuário.'); // Segurança extra
      return;
    }

    setLoading(true);
    try {
      // 1. Tenta reautenticar com a senha atual para verificar
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (reauthError) {
        // Se a senha atual estiver incorreta, signInWithPassword retorna um erro
        throw new Error('Senha atual incorreta.');
      }
      
      // 2. Se a senha atual estiver correta, atualiza para a nova senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError; // Lança outros erros do Supabase
      }

      setMessage('Senha alterada com sucesso!');
      setCurrentPassword(''); // Limpa todos os campos
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      // Aqui podemos usar nosso tradutor se quisermos, ou mensagens específicas
      setError(err.message === 'Senha atual incorreta.' ? err.message : 'Não foi possível alterar a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* NOVO CAMPO */}
      <div className={styles.inputGroup}>
        <label htmlFor="current-password">Senha Atual</label>
        <input 
          id="current-password" 
          type="password" 
          value={currentPassword} 
          onChange={(e) => setCurrentPassword(e.target.value)} 
          required 
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="new-password">Nova Senha</label>
        <input 
          id="new-password" 
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
          placeholder="Mínimo de 6 caracteres"
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="confirm-password">Confirmar Nova Senha</label>
        <input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Nova Senha'}
      </button>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}

export default ChangePasswordForm;