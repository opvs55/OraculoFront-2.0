// src/tarotDeck.js
// ATUALIZADO PARA FUNCIONAR COM A ESTRUTURA: public/assets/cartas/

// --- Arcanos Maiores ---
const arcano00 = '/assets/cartas/RWS1909_-_00_Fool.jpeg';
const arcano01 = '/assets/cartas/RWS1909_-_01_Magician.jpeg';
const arcano02 = '/assets/cartas/RWS1909_-_02_High_Priestess.jpeg';
const arcano03 = '/assets/cartas/RWS1909_-_03_Empress.jpeg';
const arcano04 = '/assets/cartas/RWS1909_-_04_Emperor.jpeg';
const arcano05 = '/assets/cartas/RWS1909_-_05_Hierophant.jpeg';
const arcano06 = '/assets/cartas/RWS1909_-_06_Lovers.jpeg';
const arcano07 = '/assets/cartas/RWS1909_-_07_Chariot.jpeg';
const arcano08 = '/assets/cartas/RWS1909_-_08_Strength.jpeg';
const arcano09 = '/assets/cartas/RWS1909_-_09_Hermit.jpeg';
const arcano10 = '/assets/cartas/RWS1909_-_10_Wheel_of_Fortune.jpeg';
const arcano11 = '/assets/cartas/RWS1909_-_11_Justice.jpeg';
const arcano12 = '/assets/cartas/RWS1909_-_12_Hanged_Man.jpeg';
const arcano13 = '/assets/cartas/RWS1909_-_13_Death.jpeg';
const arcano14 = '/assets/cartas/RWS1909_-_14_Temperance.jpeg';
const arcano15 = '/assets/cartas/RWS1909_-_15_Devil.jpeg';
const arcano16 = '/assets/cartas/RWS1909_-_16_Tower.jpeg';
const arcano17 = '/assets/cartas/RWS1909_-_17_Star.jpeg';
const arcano18 = '/assets/cartas/RWS1909_-_18_Moon.jpeg';
const arcano19 = '/assets/cartas/RWS1909_-_19_Sun.jpeg';
const arcano20 = '/assets/cartas/RWS1909_-_20_Judgement.jpeg';
const arcano21 = '/assets/cartas/RWS1909_-_21_World.jpeg';

// --- Naipe de Paus (Wands) ---
const paus01 = '/assets/cartas/RWS1909_-_Wands_01.jpeg';
const paus02 = '/assets/cartas/RWS1909_-_Wands_02.jpeg';
const paus03 = '/assets/cartas/RWS1909_-_Wands_03.jpeg';
const paus04 = '/assets/cartas/RWS1909_-_Wands_04.jpeg';
const paus05 = '/assets/cartas/RWS1909_-_Wands_05.jpeg';
const paus06 = '/assets/cartas/RWS1909_-_Wands_06.jpeg';
const paus07 = '/assets/cartas/RWS1909_-_Wands_07.jpeg';
const paus08 = '/assets/cartas/RWS1909_-_Wands_08.jpeg';
const paus09 = '/assets/cartas/RWS1909_-_Wands_09.jpeg';
const paus10 = '/assets/cartas/RWS1909_-_Wands_10.jpeg';
const paus11 = '/assets/cartas/RWS1909_-_Wands_11.jpeg'; // Valete
const paus12 = '/assets/cartas/RWS1909_-_Wands_12.jpeg'; // Cavaleiro
const paus13 = '/assets/cartas/RWS1909_-_Wands_13.jpeg'; // Rainha
const paus14 = '/assets/cartas/RWS1909_-_Wands_14.jpeg'; // Rei

// --- Naipe de Copas (Cups) ---
const copas01 = '/assets/cartas/RWS1909_-_Cups_01.jpeg';
const copas02 = '/assets/cartas/RWS1909_-_Cups_02.jpeg';
const copas03 = '/assets/cartas/RWS1909_-_Cups_03.jpeg';
const copas04 = '/assets/cartas/RWS1909_-_Cups_04.jpeg';
const copas05 = '/assets/cartas/RWS1909_-_Cups_05.jpeg';
const copas06 = '/assets/cartas/RWS1909_-_Cups_06.jpeg';
const copas07 = '/assets/cartas/RWS1909_-_Cups_07.jpeg';
const copas08 = '/assets/cartas/RWS1909_-_Cups_08.jpeg';
const copas09 = '/assets/cartas/RWS1909_-_Cups_09.jpeg';
const copas10 = '/assets/cartas/RWS1909_-_Cups_10.jpeg';
const copas11 = '/assets/cartas/RWS1909_-_Cups_11.jpeg'; // Valete
const copas12 = '/assets/cartas/RWS1909_-_Cups_12.jpeg'; // Cavaleiro
const copas13 = '/assets/cartas/RWS1909_-_Cups_13.jpeg'; // Rainha
const copas14 = '/assets/cartas/RWS1909_-_Cups_14.jpeg'; // Rei

// --- Naipe de Espadas (Swords) ---
const espadas01 = '/assets/cartas/RWS1909_-_Swords_01.jpeg';
const espadas02 = '/assets/cartas/RWS1909_-_Swords_02.jpeg';
const espadas03 = '/assets/cartas/RWS1909_-_Swords_03.jpeg';
const espadas04 = '/assets/cartas/RWS1909_-_Swords_04.jpeg';
const espadas05 = '/assets/cartas/RWS1909_-_Swords_05.jpeg';
const espadas06 = '/assets/cartas/RWS1909_-_Swords_06.jpeg';
const espadas07 = '/assets/cartas/RWS1909_-_Swords_07.jpeg';
const espadas08 = '/assets/cartas/RWS1909_-_Swords_08.jpeg';
const espadas09 = '/assets/cartas/RWS1909_-_Swords_09.jpeg';
const espadas10 = '/assets/cartas/RWS1909_-_Swords_10.jpeg';
const espadas11 = '/assets/cartas/RWS1909_-_Swords_11.jpeg'; // Valete
const espadas12 = '/assets/cartas/RWS1909_-_Swords_12.jpeg'; // Cavaleiro
const espadas13 = '/assets/cartas/RWS1909_-_Swords_13.jpeg'; // Rainha
const espadas14 = '/assets/cartas/RWS1909_-_Swords_14.jpeg'; // Rei

// --- Naipe de Ouros (Pentacles) ---
const ouros01 = '/assets/cartas/RWS1909_-_Pentacles_01.jpeg';
const ouros02 = '/assets/cartas/RWS1909_-_Pentacles_02.jpeg';
const ouros03 = '/assets/cartas/RWS1909_-_Pentacles_03.jpeg';
const ouros04 = '/assets/cartas/RWS1909_-_Pentacles_04.jpeg';
const ouros05 = '/assets/cartas/RWS1909_-_Pentacles_05.jpeg';
const ouros06 = '/assets/cartas/RWS1909_-_Pentacles_06.jpeg';
const ouros07 = '/assets/cartas/RWS1909_-_Pentacles_07.jpeg';
const ouros08 = '/assets/cartas/RWS1909_-_Pentacles_08.jpeg';
const ouros09 = '/assets/cartas/RWS1909_-_Pentacles_09.jpeg';
const ouros10 = '/assets/cartas/RWS1909_-_Pentacles_10.jpeg';
const ouros11 = '/assets/cartas/RWS1909_-_Pentacles_11.jpeg'; // Valete
const ouros12 = '/assets/cartas/RWS1909_-_Pentacles_12.jpeg'; // Cavaleiro
const ouros13 = '/assets/cartas/RWS1909_-_Pentacles_13.jpeg'; // Rainha
const ouros14 = '/assets/cartas/RWS1909_-_Pentacles_14.jpeg'; // Rei

export const baralho = [
  // Arcanos Maiores
  { id: 0, nome: "O Louco", img: arcano00 },
  { id: 1, nome: "O Mago", img: arcano01 },
  { id: 2, nome: "A Sacerdotisa", img: arcano02 },
  { id: 3, nome: "A Imperatriz", img: arcano03 },
  { id: 4, nome: "O Imperador", img: arcano04 },
  { id: 5, nome: "O Hierofante", img: arcano05 },
  { id: 6, nome: "Os Amantes", img: arcano06 },
  { id: 7, nome: "O Carro", img: arcano07 },
  { id: 8, nome: "A Força", img: arcano08 },
  { id: 9, nome: "O Eremita", img: arcano09 },
  { id: 10, nome: "A Roda da Fortuna", img: arcano10 },
  { id: 11, nome: "A Justiça", img: arcano11 },
  { id: 12, nome: "O Enforcado", img: arcano12 },
  { id: 13, nome: "A Morte", img: arcano13 },
  { id: 14, nome: "A Temperança", img: arcano14 },
  { id: 15, nome: "O Diabo", img: arcano15 },
  { id: 16, nome: "A Torre", img: arcano16 },
  { id: 17, nome: "A Estrela", img: arcano17 },
  { id: 18, nome: "A Lua", img: arcano18 },
  { id: 19, nome: "O Sol", img: arcano19 },
  { id: 20, nome: "O Julgamento", img: arcano20 },
  { id: 21, nome: "O Mundo", img: arcano21 },
  // Naipe de Paus
  { id: 22, nome: "Ás de Paus", img: paus01 },
  { id: 23, nome: "Dois de Paus", img: paus02 },
  { id: 24, nome: "Três de Paus", img: paus03 },
  { id: 25, nome: "Quatro de Paus", img: paus04 },
  { id: 26, nome: "Cinco de Paus", img: paus05 },
  { id: 27, nome: "Seis de Paus", img: paus06 },
  { id: 28, nome: "Sete de Paus", img: paus07 },
  { id: 29, nome: "Oito de Paus", img: paus08 },
  { id: 30, nome: "Nove de Paus", img: paus09 },
  { id: 31, nome: "Dez de Paus", img: paus10 },
  { id: 32, nome: "Valete de Paus", img: paus11 },
  { id: 33, nome: "Cavaleiro de Paus", img: paus12 },
  { id: 34, nome: "Rainha de Paus", img: paus13 },
  { id: 35, nome: "Rei de Paus", img: paus14 },
  // Naipe de Copas
  { id: 36, nome: "Ás de Copas", img: copas01 },
  { id: 37, nome: "Dois de Copas", img: copas02 },
  { id: 38, nome: "Três de Copas", img: copas03 },
  { id: 39, nome: "Quatro de Copas", img: copas04 },
  { id: 40, nome: "Cinco de Copas", img: copas05 },
  { id: 41, nome: "Seis de Copas", img: copas06 },
  { id: 42, nome: "Sete de Copas", img: copas07 },
  { id: 43, nome: "Oito de Copas", img: copas08 },
  { id: 44, nome: "Nove de Copas", img: copas09 },
  { id: 45, nome: "Dez de Copas", img: copas10 },
  { id: 46, nome: "Valete de Copas", img: copas11 },
  { id: 47, nome: "Cavaleiro de Copas", img: copas12 },
  { id: 48, nome: "Rainha de Copas", img: copas13 },
  { id: 49, nome: "Rei de Copas", img: copas14 },
  // Naipe de Espadas
  { id: 50, nome: "Ás de Espadas", img: espadas01 },
  { id: 51, nome: "Dois de Espadas", img: espadas02 },
  { id: 52, nome: "Três de Espadas", img: espadas03 },
  { id: 53, nome: "Quatro de Espadas", img: espadas04 },
  { id: 54, nome: "Cinco de Espadas", img: espadas05 },
  { id: 55, nome: "Seis de Espadas", img: espadas06 },
  { id: 56, nome: "Sete de Espadas", img: espadas07 },
  { id: 57, nome: "Oito de Espadas", img: espadas08 },
  { id: 58, nome: "Nove de Espadas", img: espadas09 },
  { id: 59, nome: "Dez de Espadas", img: espadas10 },
  { id: 60, nome: "Valete de Espadas", img: espadas11 },
  { id: 61, nome: "Cavaleiro de Espadas", img: espadas12 },
  { id: 62, nome: "Rainha de Espadas", img: espadas13 },
  { id: 63, nome: "Rei de Espadas", img: espadas14 },
  // Naipe de Ouros
  { id: 64, nome: "Ás de Ouros", img: ouros01 },
  { id: 65, nome: "Dois de Ouros", img: ouros02 },
  { id: 66, nome: "Três de Ouros", img: ouros03 },
  { id: 67, nome: "Quatro de Ouros", img: ouros04 },
  { id: 68, nome: "Cinco de Ouros", img: ouros05 },
  { id: 69, nome: "Seis de Ouros", img: ouros06 },
  { id: 70, nome: "Sete de Ouros", img: ouros07 },
  { id: 71, nome: "Oito de Ouros", img: ouros08 },
  { id: 72, nome: "Nove de Ouros", img: ouros09 },
  { id: 73, nome: "Dez de Ouros", img: ouros10 },
  { id: 74, nome: "Valete de Ouros", img: ouros11 },
  { id: 75, nome: "Cavaleiro de Ouros", img: ouros12 },
  { id: 76, nome: "Rainha de Ouros", img: ouros13 },
  { id: 77, nome: "Rei de Ouros", img: ouros14 },
];

// Opcional: exportar a imagem do verso da carta
const versoCartaImg = '/assets/cartas/Waite–Smith_Tarot_Roses_and_Lilies.jpg';
export { versoCartaImg };