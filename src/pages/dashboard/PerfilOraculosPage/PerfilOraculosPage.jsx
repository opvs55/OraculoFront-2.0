import React from 'react';
import OracleStatusPanel from '../../../components/profile/OracleStatusPanel';
import styles from './PerfilOraculosPage.module.css';

export default function PerfilOraculosPage() {
  return (
    <div className={`content_wrapper ${styles.container}`}>
      <div className={styles.content}>
        <h1>Meu Perfil Místico</h1>
        <p>Um retrato vivo do seu avanço nos oráculos do ESOTERICON.</p>
        <OracleStatusPanel />
      </div>
    </div>
  );
}
