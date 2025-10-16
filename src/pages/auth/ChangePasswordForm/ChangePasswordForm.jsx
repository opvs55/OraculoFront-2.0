import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import styles from './ChangePasswordForm.module.css';

function ChangePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage('Senha alterada com sucesso!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Não foi possível alterar a senha. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="new-password">Nova Senha</label>
        <input 
          id="new-password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
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