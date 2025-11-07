import { ref, set, db, push } from "./firebase.js";

const members = [
  "Arthur",
  "Derek",
  "Eliandro",
  "Luan",
  "Matheus",
  "Mauro",
  "Pedro",
  "Satyro",
  "Sebastião",
  "Thiago"
];

const membersInfo = {
  Pedro: {
    nome: "Pedro Augusto Raggi Lessa",
    endereço: "Rua São Paulo, 1402, Vila Nova, Barra de São João, RJ - 28880-000",
    telefone: "(22) 99810-5354"
  },
  Satyro: {
    nome: "Guilherme Satyro Bernardino",
    endereço:
      "Rua Voluntários da Pátria, 400, apto 1604, bloco 1, Centro, Campos dos Goytacazes, RJ - CEP 28035-260",
    telefone: ""
  },
  Derek: {
    nome: "Derek Mozer de Souza",
    endereço: "Rua Acre 294 - Extensão do Bosque - Rio das Ostras, RJ - CEP 28893-259 (loja)",
    telefone: "22 99977-0956"
  },
  Eliandro: {
    nome: "Eliandro Venceslau de Olivera Silva",
    endereço:
      "Rua Doutor Ricardo Bartelega 247 BL2a Ap 203 - Atlântica - Rio das Ostras, RJ - CEP 28895-679",
    telefone: "(22) 99242-7862"
  },
  Mauro: {
    nome: "Mauro Fernandes Correia Junior",
    endereço: "Rua Tijuca nº 244, Parque Zabulão - Rio das Ostras, RJ - CEP 28893-833",
    telefone: "(22) 99880-8127"
  },
  Thiago: {
    nome: "Thiago Justino Ximenes",
    endereço: "Rua Professor Darci Ribeiro, nº 207, casa 02, Casa Grande - CEP 28893-887",
    telefone: "(22) 99601-4646"
  },
  Matheus: {
    nome: "Matheus Alves da Fonseca",
    endereço:
      "Avenida Independência, n°6, Samburá - Ao lado da Igreja Fonte da Vida - CEP 28926-524",
    telefone: "(22) 99943-7005"
  },
  Luan: {
    nome: "Luan Luthi Fanni de Aguiar",
    endereço: "Avenida Batel, 1162 (apto 405), Bairro Batel, Curitiba - PR - CEP 80420-090",
    telefone: "(41) 98407-1964"
  },

  Sebastião: {
    nome: "Sebastião Victor",
    endereço:
      "Avenida Governador Roberto Silveira, n° 471, (Apto 202), Costazul Rio das Ostras, RJ - CEP 28895266",
    telefone: "(22) 99612-74294"
  }
};

const mustPairs = {
  Sebastião: "Satyro"
};

const forbiddenPairs = {};

const excluded = ["Arthur"];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generatePairs(names) {
  const participants = names.filter((n) => !excluded.includes(n));
  let receivers = shuffle(participants);
  let pairs = {};

  function valid() {
    return participants.every((giver, i) => {
      const r = receivers[i];
      if (r === giver) return false;
      if (forbiddenPairs[giver]?.includes(r)) return false;
      return true;
    });
  }

  let tries = 0;
  while (!valid() && tries < 1000) {
    receivers = shuffle(participants);
    tries++;
  }

  participants.forEach((g, i) => (pairs[g] = receivers[i]));

  Object.entries(mustPairs).forEach(([giver, receiver]) => {
    if (pairs[giver] !== receiver) {
      const otherGiver = Object.keys(pairs).find((g) => pairs[g] === receiver);
      if (otherGiver) {
        const tmp = pairs[giver];
        pairs[giver] = receiver;
        pairs[otherGiver] = tmp;
      }
    }
  });

  return pairs;
}

async function setupSecretSanta() {
  const pairs = generatePairs(members);

  set(ref(db, "MembersInfo"), membersInfo);
  await set(ref(db, "Lista"), "");

  for (const [giver, receiver] of Object.entries(pairs)) {
    await set(ref(db, `Alpacas/${giver}`), {
      participant: true,
      hasPicked: false,
      secretSanta: receiver
    });
    await push(ref(db, "Lista"), `${giver}->${receiver}`);
  }

  console.log("✅ Secret Santa pairs saved to Firebase!");
}


// setupSecretSanta()
