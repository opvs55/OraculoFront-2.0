const isJsonString = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.startsWith('{') && trimmed.endsWith('}');
};

export const getQuestionText = (question, spreadType) => {
  if (!question) return 'Pergunta não disponível';
  if (typeof question === 'string' && !isJsonString(question)) {
    return question;
  }

  let questionObj = question;
  if (typeof question === 'string') {
    try {
      questionObj = JSON.parse(question);
    } catch {
      return question;
    }
  }

  if (!questionObj) return 'Pergunta não disponível';

  if (spreadType === 'pathChoice' && questionObj?.path1) {
    return `Escolha entre '${questionObj.path1}' e '${questionObj.path2}'`;
  }

  if (spreadType === 'templeOfAphrodite' && (questionObj?.name1 || questionObj?.NAME1)) {
    const name1 = questionObj.name1 || questionObj.NAME1;
    const name2 = questionObj.name2 || questionObj.NAME2;
    return `Análise de relação entre ${name1} e ${name2}`;
  }

  if (typeof questionObj === 'string') return questionObj;
  return JSON.stringify(questionObj);
};
