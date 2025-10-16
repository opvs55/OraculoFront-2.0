// src/tarotDeck.js
// ATUALIZADO PARA FUNCIONAR COM A ESTRUTURA: public/assets/cartas/
const arcanosMaiores = [
  {
    id: 0,
    slug: "o-louco",
    nome: "O Louco",
    img: "/assets/cartas/RWS1909_-_00_Fool.jpeg",
    video: "/assets/videos/o-louco.mp4",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "A carta do Louco representa o início de uma jornada, um salto de fé no desconhecido. Ele caminha despreocupadamente à beira de um precipício, simbolizando a pura potencialidade, a inocência e a espontaneidade. Carrega uma pequena trouxa, indicando que possui tudo o que precisa. Seu cão o acompanha, representando o instinto que o protege e os avisos do mundo material que ele pode estar ignorando.",
    palavras_chave: { direito: ["Inocência", "Novos começos", "Espontaneidade", "Salto de fé", "Potencial"], invertido: ["Imprudência", "Risco desnecessário", "Inconsequência", "Insegurança", "Hesitação"] },
    significados: { direito: "Quando O Louco aparece direito, ele te convida a abraçar o desconhecido com otimismo e um coração aberto. É um sinal para confiar no universo e dar o primeiro passo em uma nova aventura, seja um novo projeto, um relacionamento ou uma jornada espiritual. Deixe de lado os medos e as expectativas, e permita-se ser guiado pela curiosidade e pela alegria do momento presente.", invertido: "Invertido, O Louco serve como um alerta. Pode indicar que você está agindo de forma imprudente, tomando riscos desnecessários sem considerar as consequências. Também pode apontar para uma hesitação paralisante, um medo de dar o salto de fé necessário para o seu crescimento. A energia está bloqueada pela insegurança ou pela falta de confiança no seu caminho." }
  },
  {
    id: 1,
    slug: "o-mago",
    nome: "O Mago",
    img: "/assets/cartas/RWS1909_-_01_Magician.jpeg",
    video: "/assets/videos/o-mago.mp4",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "O Mago está diante de uma mesa com os quatro símbolos dos naipes menores, representando os quatro elementos. Com uma mão apontando para o céu e outra para a terra, ele canaliza a energia do universo para o plano material. Ele simboliza a manifestação, a habilidade de usar as ferramentas disponíveis para criar a realidade desejada. O símbolo do infinito acima de sua cabeça indica seu potencial ilimitado.",
    palavras_chave: { direito: ["Manifestação", "Poder", "Habilidade", "Recursos", "Ação", "Concentração"], invertido: ["Manipulação", "Engano", "Habilidade não utilizada", "Falta de planejamento"] },
    significados: { direito: "A presença do Mago é um sinal poderoso de que você tem todos os recursos e habilidades necessárias para alcançar seus objetivos. É hora de agir com foco e determinação. Sua capacidade de manifestar seus desejos está no auge. Use sua força de vontade e sua criatividade para transformar suas ideias em realidade. A mensagem é clara: o poder está em suas mãos.", invertido: "Quando invertido, O Mago adverte contra a manipulação e o engano. Você pode estar usando seus talentos de forma negativa ou sendo enganado por alguém. Também pode indicar um potencial desperdiçado, uma falta de foco que impede a manifestação. É um chamado para reavaliar suas intenções e garantir que você está usando seu poder de forma ética e construtiva." }
  },
  {
    id: 2,
    slug: "a-sacerdotisa",
    nome: "A Sacerdotisa",
    img: "/assets/cartas/RWS1909_-_02_High_Priestess.jpeg",
    tipo: "Arcano Maior",
    video: "/assets/videos/a-sacerdotisa.mp4",
    naipe: null,
    descricao: "Sentada entre dois pilares, um preto e um branco, A Sacerdotisa guarda o véu do conhecimento oculto. Ela representa a intuição, o subconsciente e os mistérios que não são aparentes. A lua a seus pés e a Torá em seu colo simbolizam sua conexão com o divino feminino e a sabedoria esotérica. Ela nos convida a olhar para dentro e a confiar em nossa voz interior.",
    palavras_chave: { direito: ["Intuição", "Subconsciente", "Segredos", "Sabedoria oculta", "Mistério"], invertido: ["Segredos revelados", "Intuição ignorada", "Confusão", "Informação retida"] },
    significados: { direito: "A Sacerdotisa pede silêncio e introspecção. Há mais coisas acontecendo do que aparenta, e as respostas que você busca não estão no mundo exterior, mas dentro de você. Confie na sua intuição, preste atenção aos seus sonhos e medite sobre as situações. É um momento de quietude, de ouvir mais do que falar, e de se conectar com a sua sabedoria interior.", invertido: "Invertida, esta carta sugere que você pode estar ignorando sua intuição ou que segredos podem estar vindo à tona. Pode haver uma desconexão com sua voz interior, levando a decisões baseadas em lógica superficial ou na opinião dos outros. É um alerta para não reprimir seus verdadeiros sentimentos e para desconfiar de informações que parecem incompletas." }
  },
  {
    id: 3,
    slug: "a-imperatriz",
    nome: "A Imperatriz",
    img: "/assets/cartas/RWS1909_-_03_Empress.jpeg",
    video: "/assets/videos/a-imperatriz.mp4",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "A Imperatriz é a personificação da feminilidade, da natureza, da fertilidade e da abundância. Sentada em um trono luxuoso no meio de um campo fértil, ela está conectada à Terra e à criação. O símbolo de Vênus em seu escudo e as estrelas em sua coroa reforçam sua ligação com o amor, a beleza e a criatividade. Ela é a 'Mãe Terra', nutrindo e gerando vida.",
    palavras_chave: { direito: ["Fertilidade", "Abundância", "Natureza", "Nutrição", "Criatividade", "Beleza"], invertido: ["Bloqueio criativo", "Dependência", "Estagnação", "Negligência"] },
    significados: { direito: "Esta carta anuncia um período de grande criatividade, crescimento e abundância. É um momento fértil para dar à luz novas ideias, projetos ou, literalmente, uma nova vida. Conecte-se com a natureza, cuide de si mesmo e dos outros, e permita que sua criatividade flua. A Imperatriz te encoraja a abraçar a beleza, o prazer e a colher os frutos do seu trabalho.", invertido: "Invertida, A Imperatriz pode indicar estagnação ou um bloqueio criativo. Você pode estar se sentindo desconectado de sua feminilidade ou da natureza. Pode também apontar para uma dependência excessiva dos outros ou para a negligência com seu próprio bem-estar. É um chamado para reencontrar sua fonte de criatividade e a cuidar de si mesmo com mais carinho." }
  },
  {
    id: 4,
    slug: "o-imperador",
    nome: "O Imperador",
    img: "/assets/cartas/RWS1909_-_04_Emperor.jpeg",
    video: "/assets/videos/o-imperador.mp4",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Sentado em um trono de pedra adornado com cabeças de carneiro (símbolo de Áries), O Imperador representa a autoridade, a estrutura, o controle e a paternidade. Ele é o complemento masculino da Imperatriz. Sua armadura simboliza proteção e sua postura rígida denota estabilidade e poder. Ele governa o mundo material com lógica, ordem e disciplina.",
    palavras_chave: { direito: ["Autoridade", "Estrutura", "Controle", "Paternidade", "Ordem", "Liderança"], invertido: ["Tirania", "Rigidez", "Falta de controle", "Figura paterna dominadora"] },
    significados: { direito: "O Imperador indica a necessidade de ordem, estrutura e disciplina em sua vida. É hora de assumir o controle, tomar decisões lógicas e liderar com autoridade e responsabilidade. Esta carta traz estabilidade e sugere que você está no comando da sua situação. Use a razão e o planejamento para construir fundações sólidas para o seu futuro.", invertido: "Invertido, O Imperador pode se manifestar como um excesso de controle, levando à tirania e à rigidez. Pode representar uma figura de autoridade dominadora ou a sua própria dificuldade em lidar com o poder. Por outro lado, também pode indicar uma total falta de controle e disciplina, resultando em caos. É um chamado para encontrar um equilíbrio saudável no uso do poder e da estrutura." }
  },
  {
    id: 5,
    slug: "o-hierofante",
    nome: "O Hierofante",
    img: "/assets/cartas/RWS1909_-_05_Hierophant.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "O Hierofante, ou Papa, é o guardião da tradição, das instituições e do conhecimento formal. Ele representa a educação, a religião organizada e os sistemas de crenças. Abençoando dois acólitos, ele atua como uma ponte entre o divino e a humanidade, transmitindo ensinamentos e dogmas estabelecidos. Ele valoriza a conformidade e a pertença a um grupo.",
    palavras_chave: { direito: ["Tradição", "Instituições", "Crenças", "Educação formal", "Conformidade", "Mentor"], invertido: ["Rebeldia", "Quebra de tradição", "Não conformidade", "Novas abordagens"] },
    significados: { direito: "Esta carta sugere a busca por conhecimento através de meios tradicionais, como instituições, mentores ou grupos estabelecidos. Pode ser um bom momento para estudar, seguir um caminho testado e aprovado, ou se juntar a uma comunidade que compartilha de suas crenças. O Hierofante valoriza a tradição e as regras, indicando que seguir um sistema pode trazer os resultados desejados.", invertido: "Invertido, O Hierofante te convida a questionar as regras e a tradição. É um sinal para pensar por si mesmo e encontrar seu próprio caminho, mesmo que isso signifique ir contra o que é estabelecido. Pode representar um sentimento de restrição por dogmas ou a necessidade de uma abordagem mais flexível e pessoal para a espiritualidade ou o conhecimento. É a carta da rebeldia construtiva." }
  },
  {
    id: 6,
    slug: "os-amantes",
    nome: "Os Amantes",
    img: "/assets/cartas/RWS1909_-_06_Lovers.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Sob o olhar de um anjo, Adão e Eva estão no Jardim do Éden. Esta carta representa a dualidade, as escolhas e a união. Mais do que apenas amor romântico, ela simboliza a harmonia, o alinhamento de valores e as decisões significativas que moldam nosso caminho. É sobre a conexão entre duas entidades, sejam elas pessoas, ideias ou partes de nós mesmos.",
    palavras_chave: { direito: ["União", "Amor", "Escolha", "Harmonia", "Relacionamentos", "Alinhamento de valores"], invertido: ["Desarmonia", "Conflito", "Escolha errada", "Desalinhamento"] },
    significados: { direito: "Os Amantes indicam uma escolha importante em sua vida, geralmente relacionada a relacionamentos ou valores fundamentais. É um convite para buscar a harmonia e a união, seja com outra pessoa ou entre diferentes aspectos de si mesmo. As decisões tomadas sob a influência desta carta têm um peso significativo. Siga seu coração, mas garanta que suas escolhas estejam alinhadas com seus valores mais profundos.", invertido: "Invertida, a carta dos Amantes aponta para conflito e desarmonia. Pode haver um desalinhamento de valores em um relacionamento ou uma luta interna que está causando angústia. Adverte contra tomar decisões precipitadas ou baseadas em desejos superficiais. É um sinal de que uma reavaliação da sua situação e das suas escolhas é necessária para restaurar o equilíbrio." }
  },
  {
    id: 7,
    slug: "o-carro",
    nome: "O Carro",
    img: "/assets/cartas/RWS1909_-_07_Chariot.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Um guerreiro vitorioso em sua carruagem representa o triunfo da vontade e do autocontrole. Ele segura um cetro, mas não há rédeas; ele controla as duas esfinges (uma preta, outra branca) através da pura força de vontade. A carta simboliza o sucesso, a ambição, a determinação e a capacidade de superar obstáculos, movendo-se com confiança em direção a um objetivo.",
    palavras_chave: { direito: ["Vontade", "Autocontrole", "Vitória", "Determinação", "Sucesso", "Ação"], invertido: ["Falta de direção", "Agressividade", "Obstáculos", "Perda de controle"] },
    significados: { direito: "O Carro é um sinal verde para avançar com determinação. Você tem a força de vontade e o foco necessários para superar qualquer desafio e alcançar a vitória. É um momento de ação direcionada e autocontrole. Assuma o comando da sua vida, defina seus objetivos claramente e não deixe que nada o desvie do seu caminho. O sucesso está ao seu alcance.", invertido: "Invertido, O Carro adverte sobre uma falta de controle ou direção. Sua energia pode estar dispersa, ou você pode estar agindo de forma excessivamente agressiva e imprudente. Obstáculos podem parecer intransponíveis. É um chamado para fazer uma pausa, reavaliar sua rota, e encontrar o foco e a disciplina necessários antes de seguir em frente. A força sem controle leva ao fracasso." }
  },
  {
    id: 8,
    slug: "a-forca",
    nome: "A Força",
    img: "/assets/cartas/RWS1909_-_08_Strength.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Uma mulher abre gentilmente a boca de um leão, sem esforço aparente. Esta carta não representa a força bruta, mas sim a força interior, a coragem, a compaixão e a paciência. O símbolo do infinito sobre a cabeça da mulher a conecta ao Mago, indicando que a verdadeira maestria vem do domínio gentil das nossas paixões e instintos (o leão).",
    palavras_chave: { direito: ["Força interior", "Coragem", "Paciência", "Compaixão", "Autocontrole"], invertido: ["Fraqueza", "Insegurança", "Raiva", "Falta de autodisciplina"] },
    significados: { direito: "A Força te lembra que você possui uma imensa reserva de coragem e resiliência interior. O verdadeiro poder não está na dominação, mas na gentileza e na paciência. Enfrente seus medos e desafios com compaixão, tanto por si mesmo quanto pelos outros. Domine seus instintos e impulsos com calma e autoconfiança. Você é mais forte do que imagina.", invertido: "Quando invertida, esta carta aponta para sentimentos de fraqueza, insegurança ou medo. Você pode estar permitindo que seus instintos mais baixos, como raiva ou ciúme, dominem suas ações. É um sinal de que você precisa se reconectar com sua força interior e praticar o autocontrole. Acredite em sua capacidade de lidar com a situação com graça e coragem." }
  },
  {
    id: 9,
    slug: "o-eremita",
    nome: "O Eremita",
    img: "/assets/cartas/RWS1909_-_09_Hermit.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Sozinho no topo de uma montanha, o Eremita segura uma lanterna contendo uma estrela de seis pontas, iluminando seu caminho com a luz da sabedoria. Ele representa a introspecção, a busca pela verdade interior e o afastamento do mundo exterior para encontrar respostas. É a jornada da alma em busca de autoconhecimento.",
    palavras_chave: { direito: ["Introspecção", "Busca interior", "Sabedoria", "Isolamento", "Orientação"], invertido: ["Isolamento excessivo", "Solidão", "Rejeição de ajuda", "Paranoia"] },
    significados: { direito: "O Eremita sinaliza um momento de se afastar do barulho do dia a dia para buscar respostas dentro de si. É um período para introspecção, estudo e meditação. Não tenha medo de ficar sozinho; é na quietude que você encontrará a orientação e a clareza que procura. Esta carta pode também representar a chegada de um mentor sábio ou o seu próprio papel como guia para os outros.", invertido: "Invertido, o Eremita pode indicar um isolamento forçado ou excessivo, que leva à solidão e à tristeza. Você pode estar se recusando a aceitar ajuda ou orientação de outras pessoas. Também pode alertar para um excesso de desconfiança ou paranoia. É um chamado para encontrar um equilíbrio entre a introspecção e a conexão com o mundo exterior." }
  },
  {
    id: 10,
    slug: "a-roda-da-fortuna",
    nome: "A Roda da Fortuna",
    img: "/assets/cartas/RWS1909_-_10_Wheel_of_Fortune.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "A Roda da Fortuna simboliza os ciclos da vida, o destino, as mudanças e os pontos de virada. As figuras ao redor da roda representam as flutuações da sorte e as forças universais em jogo. Nada é permanente. A carta nos lembra que a vida é um fluxo constante de altos e baixos, e que a mudança é a única constante.",
    palavras_chave: { direito: ["Mudança", "Ciclos", "Destino", "Sorte", "Ponto de virada", "Oportunidade"], invertido: ["Má sorte", "Resistência à mudança", "Eventos inesperados negativos", "Estagnação"] },
    significados: { direito: "Prepare-se para uma mudança de ciclo. A Roda está girando a seu favor, trazendo novas oportunidades e um golpe de sorte. Um ponto de virada importante está próximo. Abrace a mudança, pois ela faz parte do fluxo da vida. O que está em baixa vai subir, e o que está em alta pode descer. A mensagem é adaptar-se e confiar que o universo está te movendo na direção certa.", invertido: "Invertida, a Roda da Fortuna sugere um período de má sorte ou mudanças inesperadas e negativas. Você pode estar resistindo a uma mudança necessária, o que está causando estagnação e frustração. Forças externas podem parecer estar contra você. Lembre-se que os ciclos são inevitáveis; esta fase ruim também passará. A chave é não lutar contra a maré e aprender com as dificuldades." }
  },
  {
    id: 11,
    slug: "a-justica",
    nome: "A Justiça",
    img: "/assets/cartas/RWS1909_-_11_Justice.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "A Justiça senta-se em seu trono, segurando uma balança em uma mão e uma espada de dois gumes na outra. A balança simboliza a imparcialidade e o equilíbrio, enquanto a espada representa a clareza da razão, capaz de cortar a confusão. Esta carta rege a causa e o efeito, a verdade, a honestidade e a lei (tanto humana quanto kármica).",
    palavras_chave: { direito: ["Justiça", "Verdade", "Causa e efeito", "Lei", "Equilíbrio", "Clareza"], invertido: ["Injustiça", "Desonestidade", "Desequilíbrio", "Consequências", "Preconceito"] },
    significados: { direito: "A carta da Justiça indica que a verdade prevalecerá. É um momento de clareza mental, onde as decisões devem ser tomadas com imparcialidade e lógica. Você está sendo chamado a ser honesto consigo mesmo e com os outros. Espere arcar com as consequências de suas ações passadas, sejam elas boas ou más. Se você agiu com integridade, a recompensa virá. Questões legais também podem ser resolvidas.", invertido: "Invertida, a Justiça aponta para uma situação de injustiça, mentiras ou desequilíbrio. Você pode estar sofrendo as consequências de ações desonestas (suas ou de outros) ou sendo vítima de preconceito. É um alerta para não tomar decisões importantes agora, pois sua visão pode estar nublada. A verdade está sendo escondida ou distorcida." }
  },
  {
    id: 12,
    slug: "o-enforcado",
    nome: "O Enforcado",
    img: "/assets/cartas/RWS1909_-_12_Hanged_Man.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Um homem está suspenso de cabeça para baixo por um pé, mas sua expressão é serena. O Enforcado representa a suspensão, o sacrifício e a necessidade de ver as coisas por uma nova perspectiva. Ele não está sofrendo; ele escolheu esta posição para obter uma nova visão do mundo. É uma pausa voluntária para iluminação.",
    palavras_chave: { direito: ["Nova perspectiva", "Pausa", "Sacrifício", "Rendição", "Iluminação"], invertido: ["Estagnação", "Sacrifício inútil", "Resistência", "Indecisão"] },
    significados: { direito: "O Enforcado pede que você faça uma pausa e se renda. Pare de lutar contra a maré. A solução para o seu problema não virá da ação, mas da suspensão. Mude sua perspectiva, olhe para a situação de cabeça para baixo. Pode ser necessário um sacrifício de algo (ego, crenças, tempo) para alcançar uma sabedoria maior. É um momento de 'deixar ir' para poder avançar.", invertido: "Invertido, o Enforcado sugere que você está paralisado e estagnado, mas não por escolha. Você pode estar fazendo sacrifícios que não levam a lugar nenhum ou se recusando a mudar sua perspectiva, o que só prolonga o sofrimento. A indecisão está te prendendo. É um sinal de que você precisa agir para se libertar dessa suspensão forçada." }
  },
  {
    id: 13,
    slug: "a-morte",
    nome: "A Morte",
    img: "/assets/cartas/RWS1909_-_13_Death.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Um esqueleto montado em um cavalo branco avança, trazendo o fim a todos, ricos e pobres. A carta da Morte raramente significa morte física. Seu principal simbolismo é o de finais, transformações e a eliminação do que não serve mais. O sol nascendo ao fundo promete que após todo final, há um novo começo.",
    palavras_chave: { direito: ["Fim", "Transformação", "Transição", "Renovação", "Eliminação"], invertido: ["Resistência à mudança", "Estagnação", "Medo do fim", "Apego"] },
    significados: { direito: "Um ciclo importante em sua vida está chegando ao fim. Não tema esta conclusão. A Morte é necessária para abrir espaço para o novo. É hora de eliminar velhos hábitos, crenças ou relacionamentos que não servem mais ao seu crescimento. Aceite este final para que a transformação e a renovação possam acontecer. Um novo amanhecer está esperando.", invertido: "Invertida, a carta da Morte indica uma forte resistência à mudança. Você está se apegando a algo que já deveria ter acabado, e esse apego está causando dor e estagnação. O medo do desconhecido está te impedindo de seguir em frente. A mensagem é clara: você precisa 'deixar morrer' o que já não tem mais vida para que você possa viver plenamente." }
  },
  {
    id: 14,
    slug: "a-temperanca",
    nome: "A Temperança",
    img: "/assets/cartas/RWS1909_-_14_Temperance.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Um anjo com um pé na água e outro na terra despeja água entre duas taças, simbolizando o fluxo e o equilíbrio. A Temperança representa a moderação, a paciência, o propósito e a alquimia de combinar opostos para criar algo novo e harmonioso. É a busca pelo caminho do meio.",
    palavras_chave: { direito: ["Equilíbrio", "Moderação", "Paciência", "Harmonia", "Propósito"], invertido: ["Desequilíbrio", "Excesso", "Impaciência", "Conflito"] },
    significados: { direito: "A Temperança traz uma mensagem de equilíbrio e moderação. É hora de buscar a harmonia em todas as áreas da sua vida, combinando forças opostas para encontrar o caminho do meio. Seja paciente com seu processo e confie que você está no caminho certo. Esta carta indica que você tem um propósito claro e que, através da calma e da cooperação, alcançará seus objetivos.", invertido: "Invertida, a Temperança alerta para o excesso e o desequilíbrio. Você pode estar agindo com impaciência ou vivendo nos extremos, seja no trabalho, nos relacionamentos ou nos seus hábitos. A falta de moderação está causando conflito e estresse. É um chamado urgente para encontrar o seu centro, restaurar a harmonia e buscar o equilíbrio em suas ações e emoções." }
  },
  {
    id: 15,
    slug: "o-diabo",
    nome: "O Diabo",
    img: "/assets/cartas/RWS1909_-_15_Devil.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "O Diabo, em seu pedestal, prende duas figuras humanas com correntes frouxas ao redor de seus pescoços. Esta carta representa o apego, o vício, o materialismo e as crenças limitantes. As correntes estão frouxas, indicando que a prisão é, em grande parte, autoimposta e que a libertação é possível.",
    palavras_chave: { direito: ["Apego", "Vício", "Materialismo", "Crenças limitantes", "Sombra"], invertido: ["Libertação", "Rompimento de padrões", "Consciência", "Independência"] },
    significados: { direito: "O Diabo aponta para uma área da sua vida onde você se sente preso, seja a um vício, um relacionamento tóxico, um emprego sem alma ou a uma mentalidade negativa. Ele te convida a confrontar sua sombra e a reconhecer os padrões de comportamento que te mantém acorrentado. A consciência é o primeiro passo para a libertação. Você tem o poder de quebrar essas correntes.", invertido: "Quando invertido, O Diabo é um sinal extremamente positivo de libertação. Você está se tornando consciente de suas correntes e está no processo de se libertar de apegos e vícios. É um momento de rompimento de padrões negativos e de reivindicar sua independência e seu poder pessoal. Continue neste caminho de autoconsciência para alcançar a liberdade total." }
  },
  {
    id: 16,
    slug: "a-torre",
    nome: "A Torre",
    img: "/assets/cartas/RWS1909_-_16_Tower.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Um raio atinge uma torre, derrubando sua coroa e lançando pessoas ao chão. A Torre representa uma mudança súbita, uma destruição e uma revelação chocante. É o colapso de estruturas, crenças e egos que foram construídos sobre fundações falsas. Embora assustadora, essa destruição é necessária para a libertação.",
    palavras_chave: { direito: ["Mudança súbita", "Destruição", "Revelação", "Caos", "Libertação"], invertido: ["Medo da mudança", "Evitar o desastre", "Atraso", "Crise evitada"] },
    significados: { direito: "Prepare-se para uma mudança abrupta e inevitável. Estruturas em sua vida que não são mais sustentáveis irão desmoronar. Isso pode ser um evento chocante e caótico, mas é fundamentalmente libertador. Crenças falsas serão expostas, e o ego será abalado. Embora o processo seja doloroso, ele está limpando o terreno para que algo novo e mais autêntico possa ser construído em seu lugar.", invertido: "Invertida, A Torre pode indicar que você está resistindo a uma mudança necessária, tentando evitar um desastre inevitável. Isso apenas prolonga a agonia. Por outro lado, pode significar que você passou raspando por uma crise, mas a lição que deveria ter aprendido ainda está pendente. É um alerta para reavaliar as fundações da sua vida antes que a destruição se torne inevitável." }
  },
  {
    id: 17,
    slug: "a-estrela",
    nome: "A Estrela",
    img: "/assets/cartas/RWS1909_-_17_Star.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Após a tempestade da Torre, a Estrela surge como um farol de esperança e inspiração. Uma mulher nua despeja água na terra e em um lago, nutrindo o mundo. As estrelas no céu simbolizam a orientação e a fé no futuro. É uma carta de calma, cura, e renovação espiritual.",
    palavras_chave: { direito: ["Esperança", "Fé", "Inspiração", "Cura", "Renovação", "Calma"], invertido: ["Desespero", "Falta de fé", "Desânimo", "Negatividade"] },
    significados: { direito: "A Estrela é um sinal de que, após um período de dificuldades, a esperança e a cura estão a caminho. É um momento para ter fé no universo e em si mesmo. Você está espiritualmente guiado e inspirado. Permita-se sonhar novamente e acreditar em um futuro brilhante. A calma foi restaurada, e você está em um período de paz e renovação.", invertido: "Invertida, a Estrela aponta para um sentimento de desesperança e desânimo. Você pode ter perdido a fé em si mesmo e no seu caminho. A negatividade pode estar bloqueando sua capacidade de ver a luz no fim do túnel. É um chamado para não desistir. Lembre-se de que mesmo nas noites mais escuras, as estrelas ainda estão lá. Procure ativamente por sinais de esperança e inspiração." }
  },
  {
    id: 18,
    slug: "a-lua",
    nome: "A Lua",
    img: "/assets/cartas/RWS1909_-_18_Moon.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "A Lua ilumina uma paisagem noturna misteriosa, com um caminho que passa entre duas torres. Um lagostim emerge da água, simbolizando o subconsciente profundo. A Lua representa a ilusão, o medo, a ansiedade e o mergulho no inconsciente. Nem tudo é o que parece.",
    palavras_chave: { direito: ["Ilusão", "Medo", "Ansiedade", "Inconsciente", "Intuição"], invertido: ["Clareza", "Medos superados", "Verdade revelada", "Confusão diminuindo"] },
    significados: { direito: "A Lua te convida a explorar o seu mundo interior e a confrontar seus medos e ansiedades. As coisas podem parecer confusas e incertas agora, e você pode estar lidando com ilusões ou informações enganosas. Confie na sua intuição para navegar por esta fase. Preste atenção aos seus sonhos e aos sinais do seu subconsciente. Nem tudo que você teme é real.", invertido: "Quando invertida, A Lua é um sinal de que a confusão está se dissipando e a clareza está surgindo. Segredos são revelados e ilusões são desfeitas. Você está começando a superar seus medos e a entender a verdade da situação. A ansiedade diminui à medida que você ganha mais confiança em sua percepção da realidade. É um momento de libertação da confusão mental." }
  },
  {
    id: 19,
    slug: "o-sol",
    nome: "O Sol",
    img: "/assets/cartas/RWS1909_-_19_Sun.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "O Sol brilha intensamente sobre uma criança feliz montada em um cavalo branco. Esta é uma das cartas mais positivas do baralho. Ela representa a alegria, o sucesso, a vitalidade e a clareza. É a luz da consciência iluminando tudo, trazendo otimismo, energia e a realização de todo o potencial.",
    palavras_chave: { direito: ["Alegria", "Sucesso", "Vitalidade", "Clareza", "Otimismo", "Realização"], invertido: ["Tristeza", "Sucesso adiado", "Falta de entusiasmo", "Pessimismo"] },
    significados: { direito: "O Sol anuncia um período de grande felicidade, sucesso e vitalidade. A clareza mental e o otimismo estão em alta. É um momento para celebrar suas conquistas e aproveitar a vida com a alegria de uma criança. Seus esforços serão recompensados, e você brilhará em tudo o que fizer. Abrace esta energia positiva e compartilhe sua luz com o mundo.", invertido: "Invertido, O Sol pode indicar uma dificuldade temporária em encontrar a alegria. O sucesso pode estar adiado, ou você pode estar se sentindo pessimista e sem energia. A clareza pode estar faltando. No entanto, mesmo invertido, o Sol ainda é uma carta positiva; a nuvem que o cobre é passageira. Procure os pequenos raios de luz em sua vida para reencontrar o caminho da felicidade." }
  },
  {
    id: 20,
    slug: "o-julgamento",
    nome: "O Julgamento",
    img: "/assets/cartas/RWS1909_-_20_Judgement.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Um anjo toca uma trombeta, e os mortos se levantam de seus túmulos para serem julgados. Esta carta simboliza o renascimento, a absolvição e um chamado para um propósito maior. É um momento de autoavaliação, de perdoar o passado e de despertar para um novo nível de consciência.",
    palavras_chave: { direito: ["Renascimento", "Chamado", "Absolvição", "Autoavaliação", "Despertar"], invertido: ["Autocrítica", "Culpa", "Dúvida", "Ignorar o chamado", "Oportunidade perdida"] },
    significados: { direito: "O Julgamento representa um despertar espiritual. Você está sendo chamado para um propósito maior e para um novo capítulo em sua vida. É hora de fazer uma avaliação honesta do seu passado, perdoar a si mesmo e aos outros, e se libertar de qualquer culpa ou arrependimento. Ao fazer isso, você renascerá, pronto para seguir sua verdadeira vocação com clareza e confiança.", invertido: "Invertido, o Julgamento aponta para uma autocrítica severa, culpa e dúvida que te impedem de seguir em frente. Você pode estar ignorando um chamado importante por medo ou por se sentir indigno. É um alerta sobre uma oportunidade de renovação que está sendo perdida. É crucial praticar a autocompaixão e se libertar do peso do passado para poder despertar." }
  },
  {
    id: 21,
    slug: "o-mundo",
    nome: "O Mundo",
    img: "/assets/cartas/RWS1909_-_21_World.jpeg",
    tipo: "Arcano Maior",
    naipe: null,
    descricao: "Uma figura dança dentro de uma grinalda de louros, celebrando a conclusão de um ciclo. O Mundo é a carta final dos Arcanos Maiores e representa a realização, a integração e o sucesso. É o sentimento de ter chegado ao seu lugar, de conclusão bem-sucedida de uma jornada e de harmonia com o universo.",
    palavras_chave: { direito: ["Conclusão", "Realização", "Integração", "Sucesso", "Harmonia", "Fim de ciclo"], invertido: ["Incompletude", "Falta de fechamento", "Atrasos", "atalhos"] },
    significados: { direito: "Parabéns! O Mundo sinaliza a conclusão bem-sucedida de um ciclo importante. Você alcançou um objetivo significativo e chegou a um estado de integração e plenitude. É um momento para celebrar suas conquistas e reconhecer o quão longe você chegou. Você está exatamente onde deveria estar. Aproveite este sentimento de realização antes de iniciar a próxima grande jornada.", invertido: "Quando invertida, a carta do Mundo indica uma sensação de incompletude ou falta de fechamento. Talvez você esteja quase no final de um projeto, mas algo está faltando. Pode haver atrasos ou a sensação de que você pegou atalhos e o resultado não é totalmente satisfatório. É um chamado para revisar os detalhes finais e garantir que você complete este ciclo de forma íntegra antes de seguir em frente." }
  }
];

const arcanosMenoresPaus = [
  {
    id: 22,
    slug: "as-de-paus",
    nome: "Ás de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_01.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Uma mão surge de uma nuvem, segurando um bastão robusto e brotando. Esta carta é a semente da criatividade e da paixão. Representa o potencial puro, a inspiração inicial e a centelha de uma nova ideia ou empreendimento.",
    palavras_chave: { direito: ["Inspiração", "Potencial", "Criação", "Novos começos", "Energia"], invertido: ["Atrasos", "Falta de motivação", "Bloqueio criativo", "Falsos começos"] },
    significados: { direito: "O Ás de Paus é um grande 'sim' do universo. Ele indica o surgimento de uma nova paixão, uma ideia inspiradora ou uma oportunidade para a autoexpressão. A energia está disponível para você começar algo novo com entusiasmo e confiança. Abrace este potencial e dê o primeiro passo.", invertido: "Invertido, sugere que uma nova ideia ou projeto está enfrentando bloqueios. Pode haver uma falta de energia ou direção, levando a atrasos e frustração. É um sinal para reavaliar sua motivação e clarear sua visão antes de forçar o início de algo." }
  },
  {
    id: 23,
    slug: "dois-de-paus",
    nome: "Dois de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_02.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Um homem, no topo de um castelo, segura um globo e olha para o horizonte. Ele já alcançou um certo sucesso, mas agora contempla o futuro e as possibilidades que se estendem além de seu domínio atual. É a carta do planejamento e da decisão de expandir.",
    palavras_chave: { direito: ["Planejamento", "Decisão", "Visão de futuro", "Expansão", "Oportunidade"], invertido: ["Medo do desconhecido", "Falta de planejamento", "Limitação", "Insegurança"] },
    significados: { direito: "Você está em uma posição de poder e estabilidade, mas é hora de olhar para o futuro. O Dois de Paus te encoraja a planejar seus próximos passos e a explorar novas possibilidades. Não se contente com o que você já conquistou. Tenha a coragem de sair da sua zona de conforto e expandir seus horizontes.", invertido: "Invertido, esta carta aponta para um medo do desconhecido que o impede de avançar. A falta de planejamento ou a recusa em explorar novas opções está limitando seu potencial. Pode ser que você esteja se apegando demais à segurança do que já conhece, perdendo grandes oportunidades." }
  },
  {
    id: 24,
    slug: "tres-de-paus",
    nome: "Três de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_03.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Uma figura observa três bastões fincados no chão, olhando para navios que cruzam o mar. Ele deu os primeiros passos, e agora aguarda os resultados de seus esforços iniciais. É a carta da espera ativa, da previsão e da expansão em andamento.",
    palavras_chave: { direito: ["Espera", "Progresso", "Expansão", "Visão", "Comércio"], invertido: ["Atrasos", "Obstáculos", "Falta de visão", "Frustração"] },
    significados: { direito: "Seus planos estão em movimento e os primeiros resultados de seus esforços estão a caminho. O Três de Paus indica que você está em uma fase de espera produtiva, antecipando o progresso. Continue com sua visão de longo prazo, pois as coisas estão se desenvolvendo como planejado. A expansão e as oportunidades estão no horizonte.", invertido: "Invertido, esta carta sinaliza atrasos frustrantes e obstáculos inesperados. Seus navios parecem não chegar. Pode ser que sua visão inicial não fosse clara o suficiente ou que você esteja sendo impaciente. É um momento para reavaliar seus planos e ter paciência, pois o progresso está bloqueado temporariamente." }
  },
  {
    id: 25,
    slug: "quatro-de-paus",
    nome: "Quatro de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_04.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Dois casais celebram sob uma guirlanda suspensa por quatro bastões. Esta é uma das cartas mais felizes do baralho, representando celebração, harmonia, comunidade e a conclusão bem-sucedida de uma fase importante. É um momento de alegria e estabilidade.",
    palavras_chave: { direito: ["Celebração", "Harmonia", "Comunidade", "Lar", "Estabilidade"], invertido: ["Instabilidade", "Falta de harmonia", "Conflito", "Festa cancelada"] },
    significados: { direito: "É tempo de celebrar! O Quatro de Paus anuncia um período de alegria, paz e estabilidade, especialmente em relação ao lar e à comunidade. Pode representar um casamento, uma festa, a compra de uma casa ou simplesmente um momento de felicidade e harmonia com as pessoas que você ama. Aproveite e comemore suas conquistas.", invertido: "Invertido, sugere uma falta de harmonia e estabilidade no lar ou na comunidade. Pode haver conflitos ou tensões que impedem a celebração. Planos podem ser cancelados ou adiados. É um sinal de que as fundações de uma situação não estão tão seguras quanto pareciam, e o trabalho é necessário para restaurar a paz." }
  },
  {
    id: 26,
    slug: "cinco-de-paus",
    nome: "Cinco de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_05.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Cinco homens brandem seus bastões uns contra os outros, mas parece mais uma competição ou um jogo do que uma briga séria. Esta carta representa conflito, competição, desacordo e a luta de diferentes egos ou ideias. É a energia do caos criativo e da tensão.",
    palavras_chave: { direito: ["Conflito", "Competição", "Desacordo", "Tensão", "Debate"], invertido: ["Fim do conflito", "Acordo", "Harmonia", "Evitar conflito"] },
    significados: { direito: "Prepare-se para conflitos e competição. O Cinco de Paus indica um ambiente onde diferentes opiniões e egos estão em choque. Embora possa ser estressante, esse conflito nem sempre é negativo; pode ser um debate saudável que leva a melhores ideias. Esteja pronto para defender seu ponto de vista, mas mantenha a mente aberta.", invertido: "Invertido, esta carta pode ter dois significados. Pode indicar o fim de um conflito e a chegada de um acordo e harmonia. Por outro lado, pode sugerir um medo de conflito tão grande que você está evitando discussões necessárias, o que pode levar a problemas maiores no futuro. Avalie se o conflito está sendo resolvido ou suprimido." }
  },
  {
    id: 27,
    slug: "seis-de-paus",
    nome: "Seis de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_06.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Um homem montado em um cavalo branco, com uma coroa de louros na cabeça, é aclamado por uma multidão. Esta é a carta da vitória, do sucesso, do reconhecimento público e da aclamação. Seus esforços foram notados e estão sendo celebrados.",
    palavras_chave: { direito: ["Vitória", "Sucesso", "Reconhecimento", "Aclamação", "Orgulho"], invertido: ["Derrota", "Falta de reconhecimento", "Orgulho excessivo", "Má notícia"] },
    significados: { direito: "Você alcançou a vitória! O Seis de Paus é um sinal claro de sucesso e reconhecimento público. Seu trabalho duro valeu a pena e agora é hora de receber os aplausos. Sinta-se orgulhoso de suas conquistas e compartilhe seu sucesso com os outros. Você está em uma posição de destaque e liderança.", invertido: "Invertido, a carta pode indicar uma derrota ou, mais comumente, uma falta de reconhecimento pelos seus esforços, o que pode ser frustrante. Também pode alertar contra a arrogância e o orgulho excessivo após uma vitória, o que pode levar a uma queda. Cuidado para que o sucesso não suba à sua cabeça." }
  },
  {
    id: 28,
    slug: "sete-de-paus",
    nome: "Sete de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_07.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Um homem em terreno elevado se defende de seis bastões que vêm de baixo. Ele está em uma posição de vantagem, mas precisa lutar para manter seu terreno. A carta representa desafio, defesa, perseverança e a proteção de suas crenças ou conquistas.",
    palavras_chave: { direito: ["Desafio", "Defesa", "Perseverança", "Proteção", "Coragem"], invertido: ["Desistir", "Ser sobrepujado", "Exaustão", "Insegurança"] },
    significados: { direito: "Você está sendo desafiado e precisará defender sua posição. O Sete de Paus mostra que, embora você possa estar em uma posição de vantagem, a luta será necessária. Mantenha-se firme em suas convicções e não desista. Tenha coragem e perseverança para proteger o que você conquistou ou acredita. Você tem a capacidade de vencer esta batalha.", invertido: "Invertido, esta carta sugere que você está se sentindo sobrepujado e prestes a desistir. A competição ou os desafios podem parecer grandes demais. Pode indicar uma perda de confiança em si mesmo ou a sensação de que a luta não vale mais a pena. É um sinal de que você precisa reencontrar sua força ou reconsiderar sua estratégia." }
  },
  {
    id: 29,
    slug: "oito-de-paus",
    nome: "Oito de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_08.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Oito bastões voam rapidamente pelo ar, em um céu limpo. Esta carta é sinônimo de velocidade, movimento, ação rápida e comunicação. As coisas estão acontecendo rapidamente, e as notícias estão chegando. É a energia do progresso acelerado.",
    palavras_chave: { direito: ["Velocidade", "Ação rápida", "Movimento", "Notícias", "Progresso"], invertido: ["Atrasos", "Frustração", "Estagnação", "Más notícias"] },
    significados: { direito: "Prepare-se para uma aceleração. O Oito de Paus indica que os eventos se desenrolarão rapidamente, trazendo progresso e notícias. Pode ser uma viagem, uma mensagem importante ou a rápida conclusão de um projeto. A energia está fluindo livremente. Esteja pronto para agir rápido e aproveitar o momento.", invertido: "Invertido, a carta sinaliza atrasos, frustração e estagnação. As coisas não estão se movendo na velocidade que você gostaria, e os obstáculos parecem surgir do nada. A comunicação pode estar falhando, ou você pode receber más notícias. É um momento de paciência forçada." }
  },
  {
    id: 30,
    slug: "nove-de-paus",
    nome: "Nove de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_09.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Um homem ferido, mas ainda de pé, se apoia em um bastão, com outros oito bastões atrás dele como uma cerca. Ele já passou por batalhas e está cansado, mas permanece resiliente e pronto para o último desafio. É a carta da resiliência, da perseverança e da força final.",
    palavras_chave: { direito: ["Resiliência", "Perseverança", "Força final", "Defesa", "Cansaço"], invertido: ["Paranoia", "Exaustão", "Desistir", "Recusa em se comprometer"] },
    significados: { direito: "Você está quase lá, mas o último desafio se aproxima. O Nove de Paus mostra que, apesar do cansaço e das feridas de batalhas passadas, você tem a resiliência e a força necessárias para perseverar. Não desista agora. Reúna suas últimas energias, mantenha-se em guarda e você superará este obstáculo final.", invertido: "Invertido, a carta pode indicar uma exaustão tão grande que você está prestes a desistir no último minuto. Também pode apontar para paranoia e a sensação de estar constantemente sob ataque, mesmo quando não há ameaça real. Pode ser um sinal para baixar a guarda e aceitar que a luta acabou, ou para se comprometer com a batalha final." }
  },
  {
    id: 31,
    slug: "dez-de-paus",
    nome: "Dez de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_10.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Um homem carrega um pesado fardo de dez bastões, curvado sob o peso. Ele está quase chegando ao seu destino, mas a jornada é árdua. A carta representa sobrecarga, fardo, responsabilidade e o trabalho duro que finalmente chega ao fim.",
    palavras_chave: { direito: ["Sobrecarga", "Fardo", "Responsabilidade", "Trabalho duro", "Estresse"], invertido: ["Alívio", "Delegar", "Liberar o fardo", "Simplificar"] },
    significados: { direito: "Você está carregando um fardo pesado e se sentindo sobrecarregado por responsabilidades. O Dez de Paus indica que, embora você esteja perto de completar seus objetivos, o estresse e o trabalho duro estão cobrando seu preço. Lembre-se de que o fim está próximo. Persevere um pouco mais, mas também avalie se você não está assumindo mais do que pode suportar.", invertido: "Invertido, esta carta traz uma mensagem de alívio. É hora de liberar o fardo. Você pode estar finalmente delegando tarefas, simplificando sua vida ou se livrando de responsabilidades que não são suas. É um sinal para parar de tentar fazer tudo sozinho e aceitar ajuda. A libertação da sobrecarga está ao seu alcance." }
  },
  {
    id: 32,
    slug: "valete-de-paus",
    nome: "Valete de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_11.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "Um jovem admira seu bastão, pronto para a ação. O Valete de Paus é o mensageiro da energia do fogo. Ele representa a exploração, o entusiasmo, as novas ideias e a energia livre. Ele está animado para descobrir o mundo e iniciar novas aventuras.",
    palavras_chave: { direito: ["Entusiasmo", "Exploração", "Novas ideias", "Energia livre", "Mensagem"], invertido: ["Indecisão", "Apatia", "Más notícias", "Projetos abandonados"] },
    significados: { direito: "Espere uma explosão de energia criativa ou uma mensagem que inspira uma nova aventura. O Valete de Paus te encoraja a explorar novas ideias e a seguir suas paixões com entusiasmo juvenil. Não tenha medo de ser um iniciante. Abrace a curiosidade e permita-se descobrir novos territórios, tanto internos quanto externos.", invertido: "Invertido, o Valete pode indicar que você está se sentindo apático e sem direção. Novas ideias podem não estar se concretizando, ou você pode ter abandonado um projeto por falta de entusiasmo. Pode também representar a chegada de más notícias que te desanimam. É um chamado para reencontrar sua paixão e sua centelha criativa." }
  },
  {
    id: 33,
    slug: "cavaleiro-de-paus",
    nome: "Cavaleiro de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_12.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "O Cavaleiro de Paus avança impetuosamente em seu cavalo, personificando a ação, a aventura e a paixão em movimento. Ele é charmoso e cheio de energia, mas também pode ser impulsivo e impaciente. Ele não hesita em perseguir o que deseja.",
    palavras_chave: { direito: ["Ação", "Aventura", "Energia", "Paixão", "Impulsividade"], invertido: ["Atrasos", "Frustração", "Imprudência", "Perda de energia"] },
    significados: { direito: "É hora de agir com coragem e paixão! O Cavaleiro de Paus representa uma onda de energia que te impulsiona para a frente. Abrace a aventura e não tenha medo de correr riscos calculados para alcançar seus objetivos. As coisas estão se movendo rapidamente. Apenas tome cuidado para que sua impulsividade não se transforme em imprudência.", invertido: "Invertido, este Cavaleiro traz frustração e atrasos. A energia que deveria impulsioná-lo está bloqueada ou sendo usada de forma imprudente e dispersa. Pode haver uma sensação de estagnação ou de que seus esforços não estão levando a lugar nenhum. É um sinal para canalizar sua energia de forma mais focada e paciente." }
  },
  {
    id: 34,
    slug: "rainha-de-paus",
    nome: "Rainha de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_13.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "A Rainha de Paus senta-se em seu trono, segurando um girassol e seu bastão. Ela é a personificação da confiança, do carisma, da independência e da energia social. Ela é vibrante, otimista e inspira os outros com sua paixão e determinação.",
    palavras_chave: { direito: ["Confiança", "Carisma", "Independência", "Otimismo", "Paixão"], invertido: ["Insegurança", "Ciúme", "Intimidação", "Vingança"] },
    significados: { direito: "Incorpore a energia da Rainha de Paus. Seja confiante, extrovertido e apaixonado pela vida. É um momento para brilhar socialmente, liderar com carisma e inspirar os outros. Sua independência e otimismo são suas maiores forças. Acredite em si mesmo e não tenha medo de ocupar o seu espaço no mundo.", invertido: "Invertida, a Rainha de Paus pode se tornar intimidadora ou ciumenta. Pode haver uma tendência a usar seu carisma para manipular ou a sentir inveja do sucesso alheio. Também pode indicar uma profunda insegurança que se mascara com uma falsa confiança. É um chamado para agir com mais generosidade e autenticidade." }
  },
  {
    id: 35,
    slug: "rei-de-paus",
    nome: "Rei de Paus",
    img: "/assets/cartas/RWS1909_-_Wands_14.jpeg",
    tipo: "Arcano Menor",
    naipe: "Paus",
    descricao: "O Rei de Paus é o mestre da energia criativa e da visão. Ele se senta em seu trono com confiança, segurando seu bastão como um líder nato. Ele não é apenas apaixonado, mas também tem a visão e a determinação para transformar suas ideias em um legado duradouro. Ele é um líder visionário.",
    palavras_chave: { direito: ["Visão", "Liderança", "Empreendedorismo", "Honra", "Maestria"], invertido: ["Tirania", "Impulsividade", "Intolerância", "Falta de visão"] },
    significados: { direito: "Você está no auge de seu poder de liderança e visão. O Rei de Paus te encoraja a assumir o papel de líder, a inspirar os outros com sua visão e a agir com honra e determinação. É um excelente momento para iniciar um novo empreendimento ou para assumir o controle de sua vida com maestria. Você sabe o que quer e como chegar lá.", invertido: "Invertido, o Rei de Paus pode se tornar um líder tirânico, impulsivo e intolerante. Ele pode impor sua visão aos outros sem ouvir e agir com uma autoridade impaciente. Também pode indicar uma falta de visão de longo prazo, levando a decisões precipitadas. É um alerta para liderar com mais humildade e planejamento estratégico." }
  }
];

const arcanosMenoresCopas = [
  {
    id: 36,
    slug: "as-de-copas",
    nome: "Ás de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_01.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Uma mão emerge de uma nuvem, oferecendo uma taça da qual transbordam cinco correntes de água. Uma pomba mergulha uma hóstia na taça, simbolizando a bênção do espírito. O Ás de Copas é a semente do amor, da emoção e da intuição. Representa um novo começo emocional, amor incondicional e alegria.",
    palavras_chave: { direito: ["Amor", "Novos relacionamentos", "Compaixão", "Criatividade", "Abertura emocional"], invertido: ["Emoções bloqueadas", "Repressão", "Amor não correspondido", "Tristeza"] },
    significados: { direito: "O Ás de Copas anuncia um transbordamento de emoções positivas. É um sinal para se abrir para o amor, a compaixão e a alegria. Pode indicar o início de um novo relacionamento, uma amizade profunda ou um despertar espiritual. Seu coração está aberto para dar e receber amor. Abrace esta oportunidade para se conectar emocionalmente.", invertido: "Invertido, este Ás sugere que suas emoções estão bloqueadas ou sendo reprimidas. Você pode estar fechando seu coração para o amor ou com dificuldade de expressar o que sente. Pode também indicar um amor não correspondido ou um período de tristeza. É um chamado para olhar para dentro e entender o que está impedindo seu fluxo emocional." }
  },
  {
    id: 37,
    slug: "dois-de-copas",
    nome: "Dois de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_02.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Um homem e uma mulher trocam taças sob um caduceu alado, símbolo de Hermes, representando a união e a parceria. Esta carta é sobre a conexão, a atração mútua e a formação de um vínculo. É a união de duas almas em harmonia.",
    palavras_chave: { direito: ["União", "Parceria", "Atração", "Relacionamento", "Harmonia"], invertido: ["Desconexão", "Desequilíbrio", "Desarmonia", "Fim de relacionamento"] },
    significados: { direito: "O Dois de Copas celebra a união e a parceria. Geralmente aponta para o início de um relacionamento romântico baseado em atração mútua e respeito. Também pode representar uma parceria de negócios bem-sucedida ou uma amizade profunda. A energia é de harmonia, equilíbrio e conexão. É um momento de se unir a outra pessoa.", invertido: "Invertido, esta carta sinaliza desarmonia e desconexão. Um relacionamento ou parceria pode estar passando por dificuldades ou chegando ao fim. Há um desequilíbrio na troca emocional. É um sinal de que a comunicação falhou e a conexão foi perdida, exigindo esforço para ser restaurada ou a aceitação de um término." }
  },
  {
    id: 38,
    slug: "tres-de-copas",
    nome: "Três de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_03.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Três mulheres dançam em círculo, erguendo suas taças em celebração. Elas representam a amizade, a comunidade e a celebração em grupo. A colheita ao redor delas simboliza a abundância e a alegria compartilhada. É a carta da irmandade e da felicidade social.",
    palavras_chave: { direito: ["Celebração", "Amizade", "Comunidade", "Alegria", "Festa"], invertido: ["Isolamento", "Fofoca", "Excesso", "Fim de amizade"] },
    significados: { direito: "É hora de se reunir com seus amigos e celebrar! O Três de Copas anuncia um período de alegria social, festas e colaboração. Reúna-se com sua 'tribo', compartilhe suas conquistas e aproveite a companhia de pessoas queridas. O sucesso é mais doce quando é compartilhado. A energia é de apoio mútuo e felicidade.", invertido: "Invertido, pode indicar isolamento social ou conflitos dentro de um grupo de amigos. Pode haver fofocas ou a sensação de ser excluído. Também pode ser um alerta contra o excesso de festas e a superficialidade. Pode sinalizar o fim de uma amizade ou a necessidade de reavaliar seu círculo social." }
  },
  {
    id: 39,
    slug: "quatro-de-copas",
    nome: "Quatro de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_04.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Um jovem senta-se sob uma árvore, de braços cruzados, ignorando três taças à sua frente enquanto uma quarta é oferecida por uma mão vinda de uma nuvem. Ele está em um estado de apatia, descontentamento e contemplação, cego para as novas oportunidades.",
    palavras_chave: { direito: ["Apatia", "Descontentamento", "Contemplação", "Oportunidade perdida", "Tédio"], invertido: ["Nova perspectiva", "Fim da apatia", "Aceitar ajuda", "Motivação"] },
    significados: { direito: "O Quatro de Copas aponta para um período de apatia e desinteresse. Você pode estar se sentindo entediado ou desconectado emocionalmente, focado apenas no que está faltando. Por causa disso, você pode estar ignorando uma nova oportunidade emocional ou criativa que está bem à sua frente. É um chamado para sair da introspecção melancólica e olhar ao redor.", invertido: "Invertido, esta carta é um sinal positivo de que você está saindo de um período de apatia. Você está pronto para aceitar novas oportunidades e se engajar novamente com o mundo. É um momento de renovação da esperança e da motivação, onde você finalmente percebe e aceita a 'taça' que o universo está te oferecendo." }
  },
  {
    id: 40,
    slug: "cinco-de-copas",
    nome: "Cinco de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_05.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Uma figura encoberta olha para três taças derramadas, simbolizando perda e arrependimento. Ela ignora as duas taças que ainda estão de pé atrás dela. A ponte ao fundo representa a possibilidade de seguir em frente, mas o foco está no que foi perdido.",
    palavras_chave: { direito: ["Perda", "Arrependimento", "Tristeza", "Decepção", "Pessimismo"], invertido: ["Aceitação", "Perdão", "Seguir em frente", "Esperança"] },
    significados: { direito: "O Cinco de Copas indica um período de tristeza e foco na perda. Você está lamentando algo que acabou ou não deu certo, e esse arrependimento está te impedindo de ver o que ainda resta. É normal sentir a dor da decepção, mas esta carta te lembra que nem tudo está perdido. Há esperança e novas possibilidades (as duas taças de pé) quando você estiver pronto para se virar e seguir em frente.", invertido: "Invertido, esta carta mostra que você está no processo de cura. Você está começando a aceitar a perda, a perdoar a si mesmo ou aos outros, e a reconhecer as bênçãos que ainda possui. É um sinal de que você está pronto para deixar o passado para trás e atravessar a ponte em direção a um futuro mais esperançoso." }
  },
  {
    id: 41,
    slug: "seis-de-copas",
    nome: "Seis de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_06.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Duas crianças em um jardim, uma oferecendo à outra uma taça cheia de flores. A cena evoca nostalgia, inocência e memórias da infância. É a carta das doces lembranças, da generosidade e da reconexão com o passado de forma positiva.",
    palavras_chave: { direito: ["Nostalgia", "Inocência", "Memórias da infância", "Generosidade", "Reencontro"], invertido: ["Preso ao passado", "Ingenuidade", "Ressentimento antigo", "Deixar ir"] },
    significados: { direito: "O Seis de Copas te convida a revisitar o passado com carinho. Memórias felizes, amigos de infância ou amores antigos podem ressurgir. É um período de inocência, simplicidade e generosidade. Pode indicar um reencontro com alguém do passado ou a necessidade de se reconectar com a sua criança interior. Abrace a alegria das pequenas coisas.", invertido: "Invertido, alerta para o perigo de ficar preso ao passado, idealizando 'os bons e velhos tempos' e se recusando a viver no presente. Pode também indicar o ressurgimento de questões mal resolvidas da infância ou a dificuldade de perdoar mágoas antigas. É um sinal de que é preciso deixar o passado ir para poder crescer." }
  },
  {
    id: 42,
    slug: "sete-de-copas",
    nome: "Sete de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_07.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Uma figura observa sete taças flutuando em nuvens, cada uma contendo uma visão diferente (riqueza, poder, conhecimento, etc.). A carta representa as múltiplas opções, as fantasias, os sonhos e a ilusão. Há muitas possibilidades, mas nem todas são realistas.",
    palavras_chave: { direito: ["Opções", "Fantasias", "Sonhos", "Ilusão", "Escolha"], invertido: ["Clareza", "Decisão", "Foco", "Realidade"] },
    significados: { direito: "Você está diante de muitas opções e possibilidades, o que pode ser tanto excitante quanto paralisante. O Sete de Copas alerta para não se perder em fantasias e ilusões. É importante sonhar, mas também é preciso ter clareza sobre quais de seus desejos são realistas e quais são apenas distrações. Avalie suas opções com cuidado antes de se comprometer.", invertido: "Invertido, esta carta indica que o período de indecisão está terminando. A ilusão se dissipa, e você está ganhando clareza sobre o que realmente quer. É um momento de focar em um único objetivo e tomar uma decisão baseada na realidade, não em fantasias. A confusão está dando lugar à determinação." }
  },
  {
    id: 43,
    slug: "oito-de-copas",
    nome: "Oito de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_08.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Uma figura se afasta de oito taças cuidadosamente arrumadas, caminhando em direção a uma paisagem montanhosa sob a lua. Ele está abandonando algo que, embora aparentemente estável, já não o satisfaz emocionalmente. É a carta da busca por um significado mais profundo.",
    palavras_chave: { direito: ["Abandono", "Busca por significado", "Seguir em frente", "Decepção", "Jornada interior"], invertido: ["Hesitação", "Medo de mudar", "Ficar por comodismo", "Retorno"] },
    significados: { direito: "O Oito de Copas indica a necessidade de se afastar de uma situação que, apesar de confortável, não te preenche mais. Você sente que 'algo está faltando'. É hora de abandonar o que é familiar em busca de um propósito maior e de um significado mais profundo. Esta jornada pode ser solitária, mas é essencial para o seu crescimento espiritual e emocional.", invertido: "Invertido, mostra uma hesitação em abandonar uma situação insatisfatória. O medo da mudança ou o comodismo estão te prendendo. Você sabe que deveria ir, mas não consegue dar o primeiro passo. A carta te pergunta: 'O que você está esperando?'. A felicidade está em outro lugar, mas você precisa ter a coragem de buscá-la." }
  },
  {
    id: 44,
    slug: "nove-de-copas",
    nome: "Nove de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_09.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Um homem satisfeito senta-se diante de uma mesa com nove taças arrumadas em arco. Conhecida como a 'carta dos desejos', ela representa a satisfação, a realização de desejos, o contentamento e a felicidade material e emocional. É um momento de pura satisfação.",
    palavras_chave: { direito: ["Realização de desejos", "Satisfação", "Contentamento", "Felicidade", "Abundância"], invertido: ["Desejos não realizados", "Insatisfação", "Ganância", "Excesso"] },
    significados: { direito: "Parabéns, seu desejo se realizou (ou está prestes a se realizar)! O Nove de Copas é um sinal de profunda satisfação e contentamento. Você tem tudo o que precisa para ser feliz neste momento. É uma carta de gratidão, de aproveitar os prazeres da vida e de se sentir emocionalmente e materialmente seguro. Aproveite esta fase de plenitude.", invertido: "Invertida, a carta aponta para insatisfação e desejos não realizados. Você pode ter conseguido o que queria, mas descobriu que isso não te trouxe a felicidade esperada. Também pode alertar contra a ganância e o excesso de indulgência. É um sinal para reavaliar o que verdadeiramente te traz satisfação, em vez de buscar prazeres superficiais." }
  },
  {
    id: 45,
    slug: "dez-de-copas",
    nome: "Dez de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_10.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Uma família feliz dança sob um arco-íris de dez taças. Esta é a carta da felicidade suprema, da harmonia familiar e da realização emocional duradoura. Representa a paz no lar, relacionamentos amorosos e um sentimento de 'final feliz'.",
    palavras_chave: { direito: ["Felicidade suprema", "Harmonia familiar", "Realização", "Paz", "Amor duradouro"], invertido: ["Conflito familiar", "Relacionamentos desfeitos", "Desarmonia", "Sonhos desfeitos"] },
    significados: { direito: "O Dez de Copas representa a realização emocional em seu nível mais elevado. É um período de paz, amor e harmonia, especialmente em casa e com a família. Seus relacionamentos são uma fonte de imensa alegria e apoio. Esta carta é o 'felizes para sempre' do tarot, indicando que você alcançou um estado de felicidade duradoura e contentamento.", invertido: "Invertido, esta carta aponta para conflitos e desarmonia no ambiente familiar ou em relacionamentos íntimos. O 'sonho' pode ter sido quebrado, e a comunicação pode ter falhado. É um sinal de que os valores estão desalinhados e que é preciso trabalhar para restaurar a paz e a conexão emocional perdida." }
  },
  {
    id: 46,
    slug: "valete-de-copas",
    nome: "Valete de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_11.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "Um jovem de aparência gentil segura uma taça com um peixe saindo dela. Ele é o mensageiro das emoções. Representa a intuição, as mensagens emocionais, a criatividade e a sensibilidade. Ele é um sonhador, muitas vezes imaturo, mas com o coração aberto.",
    palavras_chave: { direito: ["Mensagem emocional", "Intuição", "Criatividade", "Sensibilidade", "Sonhos"], invertido: ["Imaturidade emocional", "Bloqueio criativo", "Más notícias emocionais", "Insegurança"] },
    significados: { direito: "Esteja aberto a mensagens do seu coração e da sua intuição. O Valete de Copas pode anunciar a chegada de uma notícia emocional (como uma declaração de amor), o início de um projeto criativo ou um convite para explorar seus sentimentos. Abrace sua sensibilidade e sua criança interior. Permita-se sonhar e ser guiado pela intuição.", invertido: "Invertido, o Valete pode indicar imaturidade emocional ou bloqueios criativos. Você pode estar agindo de forma insegura ou tendo dificuldade em lidar com seus sentimentos. Pode também representar uma notícia decepcionante em um relacionamento. É um chamado para amadurecer emocionalmente e a não deixar que a insegurança sufoque sua criatividade." }
  },
  {
    id: 47,
    slug: "cavaleiro-de-copas",
    nome: "Cavaleiro de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_12.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "O Cavaleiro de Copas avança lentamente em seu cavalo, oferecendo uma taça. Ele é o 'Romeu' do baralho, representando o romance, o charme, a idealização e a busca pela beleza e pelo amor. Ele é guiado pela emoção e pela intuição, não pela lógica.",
    palavras_chave: { direito: ["Romance", "Charme", "Convite", "Idealização", "Imaginação"], invertido: ["Falsas promessas", "Ilusão", "Manipulação emocional", "Retraimento"] },
    significados: { direito: "O romance está no ar! O Cavaleiro de Copas pode representar a chegada de um pretendente romântico, um convite para um evento social ou uma oportunidade criativa. Ele te encoraja a seguir seu coração e a agir com charme e gentileza. Deixe-se levar pela imaginação e pela beleza. É um momento para ser guiado pela emoção.", invertido: "Invertido, este Cavaleiro pode ser um alerta contra falsas promessas e manipulação emocional. Alguém (ou você mesmo) pode estar sendo charmoso, mas sem sinceridade. Pode indicar um período de ilusão ou de retraimento emocional. Tenha cuidado para não se deixar levar por idealizações que não correspondem à realidade." }
  },
  {
    id: 48,
    slug: "rainha-de-copas",
    nome: "Rainha de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_13.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "A Rainha de Copas senta-se em seu trono à beira-mar, contemplando uma taça elaborada. Ela é a mestra do reino emocional. Representa a compaixão, a intuição, o cuidado e a inteligência emocional. Ela sente profundamente, mas não é dominada por seus sentimentos; ela os compreende.",
    palavras_chave: { direito: ["Compaixão", "Intuição", "Cuidado", "Inteligência emocional", "Sensibilidade"], invertido: ["Instabilidade emocional", "Dependência", "Manipulação", "Sensibilidade excessiva"] },
    significados: { direito: "Conecte-se com sua intuição e sua capacidade de cuidar. A Rainha de Copas te convida a agir com compaixão e inteligência emocional. Confie nos seus sentimentos, pois eles são guias poderosos. É um bom momento para oferecer apoio emocional a alguém ou para cuidar de suas próprias necessidades. Lidere com o coração.", invertido: "Invertida, a Rainha pode se tornar emocionalmente instável e dependente. Pode haver uma tendência ao drama, à manipulação ou a ser excessivamente sensível, sentindo-se magoado por tudo. É um sinal de que suas emoções estão no controle, e não o contrário. É preciso buscar o equilíbrio e a maturidade emocional." }
  },
  {
    id: 49,
    slug: "rei-de-copas",
    nome: "Rei de Copas",
    img: "/assets/cartas/RWS1909_-_Cups_14.jpeg",
    tipo: "Arcano Menor",
    naipe: "Copas",
    descricao: "O Rei de Copas flutua em seu trono sobre um mar agitado, mas permanece calmo e no controle. Ele é o mestre das emoções. Representa a maturidade emocional, o autocontrole, a compaixão e a diplomacia. Ele equilibra a mente e o coração, agindo com sabedoria e gentileza.",
    palavras_chave: { direito: ["Maturidade emocional", "Compaixão", "Diplomacia", "Controle", "Sabedoria"], invertido: ["Manipulação emocional", "Instabilidade", "Repressão", "Frieza"] },
    significados: { direito: "O Rei de Copas indica maestria sobre o seu mundo emocional. Você está no controle de seus sentimentos e pode agir com calma e sabedoria, mesmo em meio ao caos. É um momento para ser diplomático, compassivo e para liderar com uma autoridade tranquila. Suas decisões, baseadas tanto na lógica quanto na intuição, serão as mais acertadas.", invertido: "Invertido, este Rei pode se tornar um mestre da manipulação emocional, usando sua compreensão dos sentimentos para controlar os outros. Por outro lado, pode indicar uma total instabilidade emocional ou a repressão completa dos sentimentos, levando à frieza e à desconexão. É um chamado para encontrar o equilíbrio autêntico entre sentir e agir." }
  }
];

const arcanosMenoresEspadas = [
  {
    id: 50,
    slug: "as-de-espadas",
    nome: "Ás de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_01.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Uma mão divina segura uma espada coroada, representando a vitória da mente e da verdade. O Ás de Espadas é a semente do intelecto, da clareza e da justiça. É um momento de 'eureka', uma nova ideia poderosa ou uma verdade que corta a confusão.",
    palavras_chave: { direito: ["Clareza", "Verdade", "Justiça", "Nova ideia", "Conquista mental"], invertido: ["Confusão", "Incerteza", "Decisão errada", "Falta de clareza"] },
    significados: { direito: "O Ás de Espadas traz uma clareza mental avassaladora. É um momento de grande insight, onde a verdade se revela e a confusão se dissipa. Use esta energia para tomar decisões importantes, resolver problemas com lógica e comunicar sua verdade com confiança. Pode representar o início de um novo projeto que exige intelecto afiado.", invertido: "Invertido, este Ás indica um período de grande confusão mental. A verdade pode estar sendo distorcida, e suas ideias podem não estar claras. Cuidado ao tomar decisões importantes agora, pois sua percepção pode estar enganada. É um sinal para buscar mais informações e clareza antes de agir." }
  },
  {
    id: 51,
    slug: "dois-de-espadas",
    nome: "Dois de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_02.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Uma mulher de olhos vendados segura duas espadas cruzadas sobre o peito, sentada diante de um mar calmo. Ela está em um impasse, bloqueando emoções e informações para evitar tomar uma decisão difícil. É a carta da indecisão e da trégua forçada.",
    palavras_chave: { direito: ["Indecisão", "Impasse", "Trégua", "Escolha difícil", "Bloqueio"], invertido: ["Decisão", "Fim do impasse", "Confusão", "Escolha esmagadora"] },
    significados: { direito: "Você está evitando uma decisão. O Dois de Espadas mostra que você está em um impasse, possivelmente se recusando a ver a verdade da situação (olhos vendados). É um momento de trégua, mas não pode durar para sempre. A carta pede que você retire a venda, encare os fatos e use sua lógica (espadas) para fazer uma escolha, por mais difícil que seja.", invertido: "Invertido, a carta sugere que o impasse está chegando ao fim, mas não de forma tranquila. Você pode estar se sentindo sobrecarregado pela necessidade de decidir, ou a confusão pode ser tão grande que qualquer escolha parece errada. É um sinal de que a indecisão está se tornando insustentável e uma decisão, mesmo que imperfeita, precisa ser tomada." }
  },
  {
    id: 52,
    slug: "tres-de-espadas",
    nome: "Três de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_03.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Um coração é perfurado por três espadas, sob um céu chuvoso. Esta é a carta da dor, da tristeza e da verdade dolorosa. Representa um coração partido, uma decepção ou uma revelação que causa sofrimento. É a dor necessária para a cura.",
    palavras_chave: { direito: ["Dor", "Coração partido", "Tristeza", "Decepção", "Verdade dolorosa"], invertido: ["Cura", "Perdão", "Superação", "Liberar a dor"] },
    significados: { direito: "O Três de Espadas anuncia um período de dor emocional. Pode ser uma desilusão amorosa, uma traição ou a chegada de uma notícia triste. A verdade da situação é dolorosa, mas precisa ser encarada. Permita-se sentir a tristeza, pois ela é o primeiro passo para a cura. Esta dor, embora aguda, é libertadora e levará a uma maior clareza.", invertido: "Invertido, é um sinal de que o pior já passou e o processo de cura está começando. Você está trabalhando para superar a dor, perdoar e liberar o sofrimento. Também pode alertar para uma tendência de reprimir a dor, o que só prolongará a agonia. Para se curar verdadeiramente, você precisa enfrentar o que te machucou." }
  },
  {
    id: 53,
    slug: "quatro-de-espadas",
    nome: "Quatro de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_04.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "A efígie de um cavaleiro repousa em um túmulo dentro de uma igreja, com três espadas na parede e uma deitada com ele. Esta carta não é de morte, mas de descanso, recuperação e contemplação. É uma pausa necessária após um período de conflito mental.",
    palavras_chave: { direito: ["Descanso", "Recuperação", "Pausa", "Contemplação", "Trégua"], invertido: ["Exaustão", "Esgotamento", "Retorno à atividade", "Estresse"] },
    significados: { direito: "Você precisa de uma pausa. O Quatro de Espadas é um chamado para o descanso e a recuperação, especialmente mental. Após um período de estresse e conflito, é essencial se retirar para recarregar as energias. Medite, contemple e organize seus pensamentos. Esta trégua é necessária para que você possa voltar à ação com força total.", invertido: "Invertido, pode ter dois significados. Pode indicar um estado de esgotamento e exaustão, onde você está se forçando a continuar quando deveria parar. Ou, de forma mais positiva, pode sinalizar o fim de um período de descanso e o retorno gradual à atividade. Avalie se você está ignorando a necessidade de parar ou se está pronto para se mover novamente." }
  },
  {
    id: 54,
    slug: "cinco-de-espadas",
    nome: "Cinco de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_05.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Um homem recolhe as espadas de seus oponentes derrotados, que se afastam humilhados. Ele tem um sorriso presunçoso no rosto. É a carta da vitória a qualquer custo, do conflito, da humilhação e das 'batalhas ganhas, mas guerra perdida'.",
    palavras_chave: { direito: ["Conflito", "Derrota", "Vitória vazia", "Hostilidade", "Humilhação"], invertido: ["Reconciliação", "Fim do conflito", "Perdão", "Vulnerabilidade"] },
    significados: { direito: "O Cinco de Espadas adverte sobre uma vitória vazia. Você pode ter ganhado uma discussão ou uma batalha, mas o custo foi alto, resultando em ressentimento e relações quebradas. A energia é de hostilidade e de 'ganhar a todo custo'. Esta carta te pergunta: valeu a pena? É um sinal para reavaliar suas táticas e o impacto de suas ações nos outros.", invertido: "Invertido, esta carta pode sinalizar a possibilidade de reconciliação após um período de conflito. Pode ser o momento de pedir desculpas, perdoar e seguir em frente. No entanto, também pode indicar uma derrota esmagadora ou a necessidade de aceitar a perda e se retirar de uma batalha que não pode ser vencida. A rendição pode ser a maior vitória." }
  },
  {
    id: 55,
    slug: "seis-de-espadas",
    nome: "Seis de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_06.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Uma mulher e uma criança são levadas em um barco para uma nova margem. Seis espadas estão fincadas no barco, representando as tristezas que estão sendo deixadas para trás. É a carta da transição, da jornada e de seguir em frente para águas mais calmas.",
    palavras_chave: { direito: ["Transição", "Jornada", "Seguir em frente", "Alívio", "Mudança"], invertido: ["Transição difícil", "Preso ao passado", "Viagem cancelada", "Resistência"] },
    significados: { direito: "O Seis de Espadas indica uma transição, muitas vezes após um período difícil. Você está deixando a dor para trás e se movendo em direção a um futuro mais calmo e promissor. Pode ser uma mudança literal (de casa, de emprego) ou uma jornada mental e emocional para longe da tristeza. O pior já passou; continue remando.", invertido: "Invertido, a transição está sendo difícil. Você pode estar se sentindo preso ao passado, incapaz de deixar a bagagem emocional para trás. Pode haver atrasos, cancelamentos ou uma forte resistência interna à mudança. A carta sugere que, para seguir em frente, você primeiro precisa resolver o que está te prendendo." }
  },
  {
    id: 56,
    slug: "sete-de-espadas",
    nome: "Sete de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_07.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Um homem foge sorrateiramente de um acampamento, carregando cinco espadas, enquanto duas permanecem fincadas no chão. É a carta da traição, do engano, do roubo e da estratégia. Ele está tentando se safar com algo, mas pode não ter sucesso completo.",
    palavras_chave: { direito: ["Engano", "Traição", "Estratégia", "Furtividade", "Desonestidade"], invertido: ["Confissão", "Honestidade", "Ser pego", "Devolução"] },
    significados: { direito: "O Sete de Espadas alerta para o engano e a desonestidade. Alguém (talvez você mesmo) está agindo de forma sorrateira ou tentando evitar responsabilidades. Pode ser uma traição, uma mentira ou simplesmente uma estratégia para obter vantagem. Cuidado com ações pelas costas. A carta também pode sugerir a necessidade de agir com estratégia e não revelar todos os seus planos.", invertido: "Invertido, a verdade vem à tona. O engano é revelado e o traidor pode ser pego. Pode ser um momento de confissão e de limpar a consciência. Representa o desejo de agir com mais honestidade ou a devolução de algo que foi pego. O segredo não pode mais ser mantido." }
  },
  {
    id: 57,
    slug: "oito-de-espadas",
    nome: "Oito de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_08.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Uma mulher está de olhos vendados e amarrada, cercada por oito espadas. No entanto, as amarras estão frouxas e há um caminho claro para escapar. A carta representa a auto-sabotagem, a sensação de estar preso, as crenças limitantes e a paralisia por análise.",
    palavras_chave: { direito: ["Crenças limitantes", "Prisão autoimposta", "Auto-sabotagem", "Paralisia", "Isolamento"], invertido: ["Libertação", "Superação", "Nova perspectiva", "Tomar o controle"] },
    significados: { direito: "Você se sente preso, mas a prisão é, em grande parte, mental. O Oito de Espadas mostra que suas próprias crenças limitantes e medos estão te paralisando. Você tem o poder de se libertar (as amarras estão frouxas), mas primeiro precisa tirar a venda e ver a situação com clareza. Pare de se ver como uma vítima e reconheça seu poder de mudar a situação.", invertido: "Invertido, esta carta é um sinal de libertação. Você está começando a desafiar suas crenças limitantes e a perceber que tem o poder de escapar da sua 'prisão'. É um momento de clareza, de superação da auto-sabotagem e de tomar as rédeas da sua vida novamente. A liberdade está ao seu alcance." }
  },
  {
    id: 58,
    slug: "nove-de-espadas",
    nome: "Nove de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_09.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Uma pessoa senta-se na cama, com a cabeça entre as mãos, como se tivesse acabado de acordar de um pesadelo. Nove espadas estão penduradas na parede escura. É a carta da ansiedade, do medo, da preocupação e da angústia mental.",
    palavras_chave: { direito: ["Ansiedade", "Medo", "Preocupação", "Pesadelos", "Angústia", "Culpa"], invertido: ["Recuperação", "Superação do medo", "Buscar ajuda", "Libertação da ansiedade"] },
    significados: { direito: "O Nove de Espadas representa uma profunda angústia mental. Medos, culpas e preocupações estão te atormentando, muitas vezes durante a noite. A sua mente está criando os piores cenários possíveis. Lembre-se que muito desse sofrimento está em sua cabeça, não necessariamente na realidade. A carta é um chamado para confrontar esses pensamentos e, se necessário, buscar ajuda para lidar com a ansiedade.", invertido: "Invertido, indica que o pior da crise de ansiedade está passando. Você está começando a encontrar maneiras de lidar com seus medos e a ver a situação com mais clareza e menos pânico. É um sinal de recuperação e de que é um bom momento para buscar ajuda profissional ou confidenciar a alguém para acelerar a cura." }
  },
  {
    id: 59,
    slug: "dez-de-espadas",
    nome: "Dez de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_10.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Um homem caído no chão, com dez espadas cravadas em suas costas. Apesar da imagem chocante, o céu ao amanhecer promete um novo começo. A carta representa um final doloroso, uma traição, uma derrota e o ponto mais baixo. É o fim absoluto de um ciclo.",
    palavras_chave: { direito: ["Fim doloroso", "Derrota", "Traição", "Ponto mais baixo", "Libertação"], invertido: ["Recuperação", "Sobrevivência", "Resistência", "O pior já passou"] },
    significados: { direito: "Você chegou ao fim inevitável e doloroso de uma situação. Pode ser uma traição, uma perda ou uma derrota esmagadora. Não há como voltar atrás. Embora seja um momento de sofrimento, o Dez de Espadas também é um sinal de libertação. O ciclo terminou. O pior já aconteceu, e agora, a única direção possível é para cima. Aceite o fim para que o novo possa começar.", invertido: "Invertido, a carta mostra que, embora você tenha passado por uma situação terrivelmente difícil, você sobreviveu. É um período de recuperação lenta, de se reerguer após a queda. A dor ainda existe, mas você não foi completamente destruído. O processo de cura está em andamento, e você está aprendendo com a experiência dolorosa." }
  },
  {
    id: 60,
    slug: "valete-de-espadas",
    nome: "Valete de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_11.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "Um jovem segura sua espada com as duas mãos, alerta e pronto. Ele é o mensageiro do intelecto. Representa a curiosidade, a busca pela verdade, a comunicação e a energia mental inquieta. Ele está cheio de novas ideias e ansioso para aprender.",
    palavras_chave: { direito: ["Curiosidade", "Verdade", "Comunicação", "Novas ideias", "Vigilância"], invertido: ["Fofoca", "Mentiras", "Falta de tato", "Notícias defensivas"] },
    significados: { direito: "O Valete de Espadas traz uma energia de curiosidade e uma sede pela verdade. É um ótimo momento para aprender algo novo, fazer perguntas e se comunicar com clareza. Esteja alerta e pronto para agir com base em novas informações. Uma nova ideia ou uma mensagem importante pode estar a caminho.", invertido: "Invertido, este Valete pode ser um fofoqueiro ou alguém que usa as palavras para ferir. Alerta para a desonestidade e a comunicação pouco clara. Pode representar a chegada de notícias desagradáveis ou a necessidade de ser defensivo. Tenha cuidado com o que você diz e em quem você confia." }
  },
  {
    id: 61,
    slug: "cavaleiro-de-espadas",
    nome: "Cavaleiro de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_12.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "O Cavaleiro de Espadas avança a toda velocidade, com a espada em riste. Ele é a personificação da ambição, da ação rápida e do pensamento assertivo. Ele é focado e determinado, mas sua pressa pode torná-lo imprudente e insensível.",
    palavras_chave: { direito: ["Ambição", "Ação rápida", "Assertividade", "Foco", "Determinação"], invertido: ["Imprudência", "Agressividade", "Falta de foco", "Atrasos"] },
    significados: { direito: "É hora de agir com rapidez e determinação. O Cavaleiro de Espadas te dá a energia necessária para cortar a confusão e ir direto ao ponto. Seja assertivo, foque em seu objetivo e não deixe que nada te distraia. Sua mente está afiada e pronta para a batalha. Vá em frente!", invertido: "Invertido, o Cavaleiro alerta contra a imprudência e a agressividade. Você pode estar agindo rápido demais, sem pensar nas consequências ou nos sentimentos dos outros. Sua energia está desfocada e pode estar causando mais mal do que bem. É um sinal para desacelerar, planejar melhor e agir com mais consideração." }
  },
  {
    id: 62,
    slug: "rainha-de-espadas",
    nome: "Rainha de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_13.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "A Rainha de Espadas senta-se em seu trono, com uma expressão séria e uma espada erguida. Ela é a mestra da verdade e da clareza mental. Representa a independência, a inteligência, a honestidade e a capacidade de enxergar a verdade sem se deixar levar pela emoção.",
    palavras_chave: { direito: ["Inteligência", "Independência", "Clareza", "Honestidade", "Verdade"], invertido: ["Frieza", "Amargura", "Isolamento", "Crueldade com as palavras"] },
    significados: { direito: "Use sua inteligência e sua percepção afiada para entender a situação. A Rainha de Espadas te encoraja a ser independente, a pensar por si mesmo e a buscar a verdade acima de tudo. Deixe as emoções de lado e use a lógica para tomar suas decisões. A honestidade, mesmo que dura, é necessária agora.", invertido: "Invertida, a Rainha de Espadas pode se tornar fria, amarga e excessivamente crítica. Ela pode usar sua inteligência para ferir os outros com palavras cruéis. Pode indicar um período de isolamento e solidão, muitas vezes causado por uma dor passada. É um alerta para temperar sua lógica com um pouco mais de compaixão." }
  },
  {
    id: 63,
    slug: "rei-de-espadas",
    nome: "Rei de Espadas",
    img: "/assets/cartas/RWS1909_-_Swords_14.jpeg",
    tipo: "Arcano Menor",
    naipe: "Espadas",
    descricao: "O Rei de Espadas é o mestre do intelecto e da autoridade. Ele se senta em seu trono com a espada da verdade em mãos, pronto para julgar com clareza e imparcialidade. Ele representa a verdade, a lei, a autoridade intelectual e o julgamento ético. Ele governa com a mente, não com o coração.",
    palavras_chave: { direito: ["Autoridade intelectual", "Verdade", "Justiça", "Clareza", "Lei", "Ética"], invertido: ["Tirania", "Manipulação", "Abuso de poder", "Crueldade"] },
    significados: { direito: "Você está em uma posição de autoridade intelectual. O Rei de Espadas te convida a usar sua mente afiada para julgar uma situação com verdade, clareza e imparcialidade. É um momento para ser um líder, um especialista ou um conselheiro. Suas decisões, baseadas em fatos e ética, terão grande peso e respeito. Busque aconselhamento de especialistas se necessário.", invertido: "Invertido, este Rei pode se tornar um tirano intelectual, abusando de seu poder e conhecimento para manipular e controlar os outros. Ele pode ser cruel, dogmático e sem compaixão. É um alerta contra o abuso de autoridade e a falta de ética. Tenha cuidado com figuras de poder que agem desta forma ou com sua própria tendência a fazê-lo." }
  }
];

const arcanosMenoresOuros = [
  {
    id: 64,
    slug: "as-de-ouros",
    nome: "Ás de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_01.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Uma mão surge de uma nuvem, oferecendo uma grande moeda dourada. Abaixo, um jardim florido com um caminho que leva a um arco. O Ás de Ouros é a semente da prosperidade material. Representa uma nova oportunidade financeira, um novo emprego ou a manifestação de um projeto no mundo real.",
    palavras_chave: { direito: ["Oportunidade", "Prosperidade", "Manifestação", "Novos começos", "Abundância"], invertido: ["Oportunidade perdida", "Mau investimento", "Ganância", "Atraso"] },
    significados: { direito: "Uma nova oportunidade material está sendo oferecida a você. O Ás de Ouros é um sinal para focar em seus objetivos práticos, seja um novo emprego, um investimento ou um projeto que pode trazer prosperidade. É um momento de plantar as sementes para um futuro seguro e abundante. Agarre esta oportunidade com gratidão e planejamento.", invertido: "Invertido, alerta para uma oportunidade financeira perdida ou uma decisão de investimento ruim. Pode haver atrasos em seus planos materiais ou uma falta de planejamento que impede o progresso. Cuidado com a ganância ou com propostas que parecem 'boas demais para ser verdade'." }
  },
  {
    id: 65,
    slug: "dois-de-ouros",
    nome: "Dois de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_02.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um jovem faz malabarismos com duas moedas conectadas por um símbolo do infinito, enquanto navios sobem e descem em ondas ao fundo. A carta representa o equilíbrio, a adaptação e o gerenciamento de múltiplas prioridades, especialmente na vida financeira e prática.",
    palavras_chave: { direito: ["Equilíbrio", "Adaptação", "Malabarismo", "Prioridades", "Flexibilidade"], invertido: ["Desequilíbrio", "Desorganização", "Sobrecarga", "Más decisões financeiras"] },
    significados: { direito: "O Dois de Ouros mostra que você está gerenciando múltiplas tarefas ou prioridades. A chave é a flexibilidade e a adaptação. A vida pode estar um pouco caótica, mas você tem a habilidade de manter tudo em equilíbrio. Seja flexível e esteja pronto para se ajustar às mudanças. Esta carta é comum quando se lida com orçamentos e o fluxo de entrada e saída de dinheiro.", invertido: "Invertido, indica que você está sobrecarregado e perdendo o equilíbrio. O malabarismo se tornou insustentável. Você pode estar tomando más decisões financeiras ou se sentindo desorganizado e estressado. É um sinal de que você precisa simplificar, redefinir suas prioridades e parar de tentar fazer tudo ao mesmo tempo." }
  },
  {
    id: 66,
    slug: "tres-de-ouros",
    nome: "Três de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_03.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um jovem artesão trabalha em uma catedral, mostrando seus planos a um clérigo e a um nobre. A carta representa o trabalho em equipe, a colaboração, a habilidade e a maestria. É o reconhecimento do trabalho bem feito e a importância de combinar diferentes talentos.",
    palavras_chave: { direito: ["Trabalho em equipe", "Colaboração", "Habilidade", "Maestria", "Planejamento"], invertido: ["Falta de trabalho em equipe", "Conflito", "Trabalho medíocre", "Falta de planejamento"] },
    significados: { direito: "O Três de Ouros é um sinal muito positivo para o trabalho e projetos. Indica que a colaboração e o trabalho em equipe levarão ao sucesso. Suas habilidades estão sendo reconhecidas e valorizadas. É um ótimo momento para trabalhar em conjunto com outros, aprender com eles e planejar os detalhes de um projeto. O resultado será de alta qualidade.", invertido: "Invertido, aponta para dificuldades no trabalho em equipe. Pode haver conflitos de ego, falta de comunicação ou simplesmente uma incapacidade de colaborar. O resultado do trabalho pode ser medíocre devido a essa desarmonia. É um chamado para melhorar a comunicação e aprender a valorizar as contribuições dos outros." }
  },
  {
    id: 67,
    slug: "quatro-de-ouros",
    nome: "Quatro de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_04.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um homem se senta em um banco, segurando firmemente uma moeda, com outras duas sob seus pés e uma sobre sua coroa. Ele representa o apego, o controle, a segurança e o medo da perda. Ele acumulou riqueza, mas agora tem medo de perdê-la.",
    palavras_chave: { direito: ["Apego", "Controle", "Segurança", "Estabilidade", "Economia"], invertido: ["Generosidade", "Liberar", "Gastos excessivos", "Insegurança material"] },
    significados: { direito: "O Quatro de Ouros indica uma forte necessidade de segurança e controle, especialmente financeiro. Você pode estar economizando dinheiro, protegendo seus bens ou se apegando a uma situação por medo da mudança. Embora a estabilidade seja boa, esta carta adverte contra o excesso de apego e a avareza. Tenha cuidado para não se fechar para novas experiências por medo de perder o que você tem.", invertido: "Invertido, pode ter dois significados opostos. Pode ser um sinal positivo de que você está finalmente liberando o controle, sendo mais generoso e se desapegando do material. Por outro lado, pode indicar o extremo oposto: gastos imprudentes e uma total falta de controle financeiro. Avalie se você está se libertando ou sendo irresponsável." }
  },
  {
    id: 68,
    slug: "cinco-de-ouros",
    nome: "Cinco de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_05.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Duas figuras empobrecidas e feridas caminham na neve, do lado de fora de uma igreja iluminada. Eles se sentem excluídos e desamparados, sem perceber que a ajuda está próxima. É a carta da dificuldade financeira, do isolamento e da mentalidade de escassez.",
    palavras_chave: { direito: ["Dificuldade financeira", "Pobreza", "Isolamento", "Perda", "Insegurança"], invertido: ["Recuperação", "Fim das dificuldades", "Aceitar ajuda", "Esperança"] },
    significados: { direito: "O Cinco de Ouros aponta para um período de dificuldades materiais, insegurança e isolamento. Você pode estar enfrentando uma perda de emprego, problemas financeiros ou simplesmente se sentindo excluído e desamparado. A carta te lembra de não se fixar na mentalidade de escassez. A ajuda e o 'abrigo' (a igreja) estão muitas vezes mais próximos do que parecem, mas você precisa ter a coragem de pedi-los.", invertido: "Invertido, é um sinal de esperança e recuperação. As dificuldades financeiras estão chegando ao fim. Você está encontrando ajuda, seja material ou espiritual, e a sensação de isolamento está diminuindo. É um momento de sair do frio e aceitar o calor e o apoio que estão sendo oferecidos." }
  },
  {
    id: 69,
    slug: "seis-de-ouros",
    nome: "Seis de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_06.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um homem rico distribui moedas para dois mendigos. Ele segura uma balança, simbolizando o equilíbrio e a justiça na distribuição. A carta representa a generosidade, a caridade, o equilíbrio entre dar e receber, e a partilha de recursos.",
    palavras_chave: { direito: ["Generosidade", "Caridade", "Partilha", "Dar e receber", "Equilíbrio"], invertido: ["Egoísmo", "Dívida", "Abuso de poder", "Falsa caridade"] },
    significados: { direito: "O Seis de Ouros fala de generosidade e equilíbrio. Pode indicar que você está em uma posição de compartilhar sua riqueza e seu tempo com os outros, ou que você está recebendo a ajuda de que precisa. A energia é de um fluxo saudável de recursos. Seja generoso, mas também esteja aberto a receber. É sobre criar um ciclo virtuoso de dar e receber.", invertido: "Invertido, a carta alerta para um desequilíbrio. Pode representar egoísmo e a recusa em ajudar os outros. Também pode indicar que você está preso em dívidas ou que a 'ajuda' que está sendo oferecida não é genuína, mas sim uma forma de controle. Cuidado com as relações de poder desiguais baseadas em dinheiro." }
  },
  {
    id: 70,
    slug: "sete-de-ouros",
    nome: "Sete de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_07.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um agricultor para e se apoia em sua ferramenta, contemplando as moedas que crescem em seus arbustos. Ele plantou as sementes e agora faz uma pausa para avaliar seu progresso antes da colheita. É a carta da paciência, do investimento e da avaliação.",
    palavras_chave: { direito: ["Paciência", "Investimento", "Avaliação", "Pausa", "Perseverança"], invertido: ["Impaciência", "Frustração", "Maus investimentos", "Falta de resultados"] },
    significados: { direito: "O Sete de Ouros indica que é hora de fazer uma pausa e avaliar o progresso de seus esforços de longo prazo. Você trabalhou duro, e os resultados estão começando a crescer, mas ainda não é hora da colheita. Tenha paciência. Use este momento para refletir sobre sua estratégia e garantir que você está no caminho certo. A perseverança será recompensada.", invertido: "Invertido, a carta aponta para frustração e impaciência. Você pode sentir que todo o seu trabalho duro não está gerando os resultados esperados. Pode indicar que você investiu sua energia no projeto errado. É um sinal para reavaliar drasticamente onde você está colocando seus esforços, pois o caminho atual pode não ser frutífero." }
  },
  {
    id: 71,
    slug: "oito-de-ouros",
    nome: "Oito de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_08.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um artesão está diligentemente trabalhando, gravando uma moeda, com outras já concluídas e expostas. É a carta da maestria, da dedicação, do aprendizado e do aprimoramento de habilidades. É sobre o prazer e o foco no trabalho em si.",
    palavras_chave: { direito: ["Aprimoramento", "Dedicação", "Maestria", "Aprendizado", "Foco"], invertido: ["Perfeccionismo", "Trabalho medíocre", "Falta de foco", "Repetitividade"] },
    significados: { direito: "O Oito de Ouros te encoraja a se dedicar ao aprimoramento de suas habilidades. É um ótimo momento para começar um novo curso, focar em um hobby ou simplesmente se dedicar a fazer seu trabalho com excelência. O prazer está no processo, não apenas no resultado final. Sua dedicação e atenção aos detalhes levarão à maestria e ao sucesso.", invertido: "Invertido, pode indicar dois extremos: um perfeccionismo paralisante, onde nada parece bom o suficiente, ou uma falta de dedicação que leva a um trabalho de má qualidade. Pode também sinalizar que você está preso em uma rotina repetitiva e sem sentido, sem nenhum sentimento de crescimento ou realização." }
  },
  {
    id: 72,
    slug: "nove-de-ouros",
    nome: "Nove de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_09.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Uma mulher elegante e independente está em seu jardim abundante, com um falcão em sua mão. As nove moedas representam a riqueza e o sucesso que ela conquistou por conta própria. É a carta da independência, da autoconfiança, da abundância e do luxo.",
    palavras_chave: { direito: ["Independência", "Abundância", "Autoconfiança", "Luxo", "Sucesso"], invertido: ["Dependência financeira", "Insegurança", "Excesso de trabalho", "Solidão"] },
    significados: { direito: "O Nove de Ouros celebra o sucesso conquistado através do seu próprio esforço. Você alcançou um nível de independência e segurança que lhe permite desfrutar dos luxos da vida. É um momento para apreciar sua autossuficiência, sua disciplina e tudo o que você construiu. Aproveite sua colheita, você mereceu.", invertido: "Invertida, a carta pode indicar uma dependência financeira ou emocional de outras pessoas. Pode haver uma sensação de insegurança apesar da aparência de sucesso. Também pode ser um alerta de que você está trabalhando demais e não está tirando tempo para aproveitar os frutos do seu trabalho, levando à solidão e ao esgotamento." }
  },
  {
    id: 73,
    slug: "dez-de-ouros",
    nome: "Dez de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_10.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Três gerações de uma família estão reunidas no pátio de um castelo. Um patriarca observa seus filhos e netos. A carta representa o legado, a riqueza geracional, a estabilidade familiar e a conclusão bem-sucedida no plano material. É a carta da base sólida e da herança.",
    palavras_chave: { direito: ["Legado", "Riqueza", "Estabilidade familiar", "Herança", "Tradição"], invertido: ["Conflito familiar", "Instabilidade financeira", "Disputa por herança", "Quebra de tradição"] },
    significados: { direito: "O Dez de Ouros é um sinal de sucesso duradouro e estabilidade, não apenas para você, mas para sua família. Representa a construção de um legado, a segurança financeira e a alegria de compartilhar sua abundância com seus entes queridos. É sobre criar fundações sólidas que beneficiarão as gerações futuras. Seus esforços garantiram a prosperidade.", invertido: "Invertido, alerta para instabilidade financeira ou conflitos familiares, muitas vezes relacionados a dinheiro ou herança. A base sólida que deveria existir está abalada. Pode indicar uma perda de riqueza ou uma quebra com as tradições familiares. É um sinal de que a verdadeira riqueza, a união familiar, está em risco." }
  },
  {
    id: 74,
    slug: "valete-de-ouros",
    nome: "Valete de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_11.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "Um jovem contempla uma moeda, estudando-a. Ele é o mensageiro da prosperidade. Representa o estudo, o planejamento, as novas oportunidades de carreira ou financeiras e a manifestação de novas ideias no plano material. Ele é um estudante dedicado.",
    palavras_chave: { direito: ["Novas oportunidades", "Estudo", "Planejamento", "Manifestação", "Diligência"], invertido: ["Procrastinação", "Más notícias financeiras", "Falta de foco", "Planos irrealistas"] },
    significados: { direito: "Esteja aberto a uma nova oportunidade prática! O Valete de Ouros anuncia a chance de iniciar um novo projeto, um novo emprego ou um novo curso. É um momento para ser um estudante diligente, para planejar com cuidado e para focar em transformar suas ideias em algo tangível e próspero. Boas notícias financeiras ou de carreira estão a caminho.", invertido: "Invertido, o Valete pode indicar procrastinação e falta de planejamento. Você pode estar sonhando com o sucesso, mas não está fazendo o trabalho necessário para alcançá-lo. Pode também representar a chegada de más notícias financeiras ou a percepção de que seus planos não eram realistas. É um chamado à ação e ao foco." }
  },
  {
    id: 75,
    slug: "cavaleiro-de-ouros",
    nome: "Cavaleiro de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_12.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "O mais lento e metódico dos cavaleiros, ele está parado em seu cavalo, observando a moeda que segura. Ele representa o trabalho duro, a rotina, a responsabilidade e a perseverança. Ele não é glamoroso, mas é confiável e cumpre suas tarefas.",
    palavras_chave: { direito: ["Trabalho duro", "Rotina", "Responsabilidade", "Perseverança", "Confiabilidade"], invertido: ["Estagnação", "Preguiça", "Tédio", "Trabalho sem recompensa"] },
    significados: { direito: "O Cavaleiro de Ouros te encoraja a ser metódico e persistente. O sucesso virá através do trabalho duro, da rotina e da atenção aos detalhes. Não há atalhos. Continue com suas tarefas diárias com responsabilidade e dedicação, pois é isso que construirá uma base sólida para o futuro. A mensagem é: 'devagar e sempre se vence a corrida'.", invertido: "Invertido, este Cavaleiro pode indicar estagnação e tédio. Você pode estar preso em uma rotina que não te desafia ou te recompensa. Pode também apontar para preguiça, irresponsabilidade ou a tendência de abandonar o trabalho quando ele se torna difícil. É um sinal de que é preciso mais esforço ou uma mudança de rotina para evitar a monotonia." }
  },
  {
    id: 76,
    slug: "rainha-de-ouros",
    nome: "Rainha de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_13.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "A Rainha de Ouros senta-se em seu trono na natureza, segurando uma única moeda. Ela é a personificação da nutrição, do cuidado prático, da prosperidade e do conforto do lar. Ela é uma figura maternal que cria um ambiente seguro e abundante para si e para os outros.",
    palavras_chave: { direito: ["Nutrição", "Cuidado prático", "Prosperidade", "Segurança", "Conforto"], invertido: ["Insegurança financeira", "Negligência", "Materialismo excessivo", "Desordem"] },
    significados: { direito: "A Rainha de Ouros te convida a focar em criar um ambiente seguro e nutritivo. É um momento para cuidar da sua casa, da sua saúde, das suas finanças e das pessoas que você ama de forma prática. Você tem a capacidade de gerar conforto e abundância. Seja generoso, mas também prático e com os pés no chão.", invertido: "Invertida, a Rainha pode indicar insegurança financeira ou negligência com o lar e a saúde. Pode haver uma desordem em sua vida prática. Também pode alertar para um foco excessivo no materialismo e nas aparências, em detrimento do verdadeiro conforto e bem-estar. É um chamado para organizar sua vida e focar no que realmente nutre." }
  },
  {
    id: 77,
    slug: "rei-de-ouros",
    nome: "Rei de Ouros",
    img: "/assets/cartas/RWS1909_-_Pentacles_14.jpeg",
    tipo: "Arcano Menor",
    naipe: "Ouros",
    descricao: "O Rei de Ouros é o mestre do mundo material. Ele se senta em um trono adornado com touros, cercado por vinhas e frutas, simbolizando sua riqueza e sucesso. Ele representa a abundância, o sucesso nos negócios, a segurança e a liderança através da confiabilidade e da generosidade.",
    palavras_chave: { direito: ["Abundância", "Sucesso", "Segurança", "Liderança", "Confiabilidade"], invertido: ["Ganância", "Corrupção", "Incompetência", "Materialismo extremo"] },
    significados: { direito: "Você alcançou o auge do sucesso material. O Rei de Ouros indica que você não apenas é próspero, mas também tem a sabedoria para manter e compartilhar sua riqueza. É um sinal de segurança, de liderança confiável e de que seus empreendimentos são bem-sucedidos. Tudo o que você toca vira ouro. Desfrute de seu sucesso e seja um provedor generoso.", invertido: "Invertido, o Rei de Ouros pode se tornar ganancioso e corrupto, obcecado pelo poder e pelo dinheiro. Pode representar um líder incompetente ou um mau homem de negócios. É um alerta contra o materialismo extremo e a tomada de decisões financeiras arriscadas ou antiéticas. O sucesso sem integridade leva à ruína." }
  }
];

export const baralhoDetalhado = [
  ...arcanosMaiores,
  ...arcanosMenoresPaus,
  ...arcanosMenoresCopas,
  ...arcanosMenoresEspadas,
  ...arcanosMenoresOuros,
];

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