import React from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (fundo escuro) que fecha o modal ao clicar fora
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Conteúdo do modal - impede que o clique feche */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {title && <h2 className={styles.modalTitle}>{title}</h2>}
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          {children} {/* Aqui entra o conteúdo específico (ex: formulário) */}
        </div>
      </div>
    </div>
  );
}

export default Modal;