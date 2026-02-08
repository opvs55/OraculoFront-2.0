import React from 'react';
import styles from '../MeuGrimorioPage.module.css';

const getCardImageUrl = (image) =>
  image ? `${import.meta.env.BASE_URL}${image.startsWith('/') ? image.slice(1) : image}` : null;

const getShortRecommendation = (card) => {
  const meaning = card?.significados?.direito;
  if (!meaning) return 'Observe os sinais da semana e registre suas emoções mais claras.';
  const [firstSentence, secondSentence] = meaning.split('. ');
  return [firstSentence, secondSentence].filter(Boolean).join('. ').trim();
};

export default function WeeklyCardRitual({
  cardDetails,
  revealAllowed,
  onReveal,
  isRevealing,
  isSessionLoading,
  errorMessage,
  onFilterByCard,
  onRelateRecent,
}) {
  const keyword = cardDetails?.palavras_chave?.direito?.[0];
  const imageUrl = getCardImageUrl(cardDetails?.img);
  const revealLabel = isSessionLoading
    ? 'Carregando sessão...'
    : isRevealing
      ? 'Revelando...'
      : 'Revelar minha carta da semana';
  const handleReveal = () => {
    if (!revealAllowed) return;
    onReveal?.();
  };

  return (
    <section className={styles.ritualSection}>
      <div className={styles.ritualHeader}>
        <div>
          <p className={styles.ritualEyebrow}>Ritual da semana</p>
          <h2 className={styles.ritualTitle}>Carta da Semana</h2>
          <p className={styles.ritualSubtitle}>
            Um portal único. Uma mensagem para atravessar seus próximos dias.
          </p>
        </div>
      </div>

      <div className={styles.ritualBody}>
        <div className={styles.ritualCardFrame}>
          {cardDetails ? (
            <>
              {imageUrl ? (
                <img src={imageUrl} alt={cardDetails.nome} className={styles.ritualCardImage} />
              ) : (
                <div className={styles.ritualCardPlaceholder} />
              )}
              <div className={styles.ritualCardGlow} />
            </>
          ) : (
            <div className={styles.ritualCardBack}>
              <div className={styles.ritualCardSigil} />
            </div>
          )}
        </div>

        <div className={styles.ritualContent}>
          {!cardDetails && (
            <>
              <p className={styles.ritualCopy}>
                Respire fundo, alinhe sua intenção e permita que apenas uma carta revele a energia da sua semana.
              </p>
              <button
                type="button"
                className={styles.ritualRevealButton}
                onClick={handleReveal}
                disabled={!revealAllowed}
              >
                {revealLabel}
              </button>
              {errorMessage && (
                <p className={styles.ritualRecommendation}>{errorMessage}</p>
              )}
            </>
          )}

          {cardDetails && (
            <>
              <p className={styles.ritualKeyword}>Palavra-chave: {keyword || 'Introspecção'}</p>
              <p className={styles.ritualRecommendation}>{getShortRecommendation(cardDetails)}</p>
              <div className={styles.ritualLinks}>
                <button
                  type="button"
                  className={styles.ritualLinkButton}
                  onClick={() => onFilterByCard(cardDetails.nome)}
                >
                  Ver leituras com esta carta
                </button>
                <button
                  type="button"
                  className={styles.ritualLinkButton}
                  onClick={onRelateRecent}
                >
                  Relacionar com minhas últimas leituras
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
