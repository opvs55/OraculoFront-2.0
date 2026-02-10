import { oraclesApi } from './api/oraclesApi';

export async function getInterpretation(question, cards, spreadType) {
  return oraclesApi.createTarotReading({ question, cards, spreadType });
}

export async function getChatResponse(userMessage, chatContext) {
  return oraclesApi.chatTarot({ userMessage, chatContext });
}

export async function getDidacticMeaning(cardName, cardOrientation, positionName) {
  return oraclesApi.getTarotCardMeaning({ cardName, cardOrientation, positionName });
}
