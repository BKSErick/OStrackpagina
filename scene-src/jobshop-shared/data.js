// Dados de EXEMPLO para a página ao vivo (conta DEMO do OStrack). Nada aqui é cliente real.
// Cada estação é uma etapa da O.S.; cada O.S. mostra onde está no trilho, quem responde e o tempo na etapa contra
// o prazo da etapa. A linha "ao vivo" de cada estação sai do mesmo state(t) que move a cena.

export const STAGES = ['Recebimento', 'Desmontagem e peritagem', 'Usinagem', 'Reparo e montagem', 'Teste e inspeção', 'Expedição'];

export const ORDERS = {
  recebimento: [
    {os: 'DEMO-047', equip: 'Motor elétrico 75 cv', client: 'Siderúrgica Exemplo', who: 'Carlos', inStage: 35, limit: 120, due: 'sex, 14:00'},
    {os: 'DEMO-048', equip: 'Bomba centrífuga', client: 'Celulose Modelo', who: 'Carlos', inStage: 10, limit: 120, due: 'seg, 10:00'},
  ],
  desmontagem: [
    {os: 'DEMO-044', equip: 'Redutor de velocidade', client: 'Mineradora Modelo', who: 'Rafael', inStage: 190, limit: 240, due: 'qui, 17:00', note: 'Peritagem: 6 de 9 itens'},
    {os: 'DEMO-045', equip: 'Motor elétrico 40 cv', client: 'Siderúrgica Exemplo', who: 'Rafael', inStage: 50, limit: 240, due: 'sex, 12:00'},
  ],
  usinagem: [
    {os: 'DEMO-039', equip: 'Eixo do redutor', client: 'Mineradora Modelo', who: 'Júlio', inStage: 260, limit: 300, due: 'qua, 16:00'},
    {os: 'DEMO-041', equip: 'Bucha e flange', client: 'Usina Exemplo', who: 'Júlio', inStage: 80, limit: 180, due: 'qui, 09:00'},
  ],
  montagem: [
    {os: 'DEMO-036', equip: 'Cilindro hidráulico 160 mm', client: 'Usina Exemplo', who: 'André', inStage: 320, limit: 300, due: 'hoje, 18:00', late: true},
    {os: 'DEMO-040', equip: 'Mancal de rolamento', client: 'Celulose Modelo', who: 'André', inStage: 45, limit: 240, due: 'sex, 15:00'},
  ],
  teste: [
    {os: 'DEMO-034', equip: 'Motor elétrico 100 cv', client: 'Siderúrgica Exemplo', who: 'Marcos', inStage: 70, limit: 120, due: 'hoje, 16:00'},
  ],
  expedicao: [
    {os: 'DEMO-031', equip: 'Redutor de velocidade', client: 'Mineradora Modelo', who: 'Paulo', inStage: 20, limit: 60, due: 'hoje, 15:00'},
    {os: 'DEMO-032', equip: 'Motor elétrico 50 cv', client: 'Celulose Modelo', who: 'Paulo', inStage: 5, limit: 60, due: 'hoje, 17:30'},
  ],
};

export const STAGE_INDEX = {recebimento: 0, desmontagem: 1, usinagem: 2, montagem: 3, teste: 4, expedicao: 5};

export const fmtMin = (m) => {
  const h = Math.floor(m / 60);
  const r = Math.round(m % 60);
  return h ? `${h}h${r ? String(r).padStart(2, '0') : ''}` : `${r} min`;
};

// linha ao vivo de cada estação, lida do estado da cena
export const liveLine = (id, s) => {
  const t = s.t;
  switch (id) {
    case 'recebimento':
      if (t > 3.5 && t < 9.6) return 'Carlos leva a DEMO-047 para a desmontagem';
      if (t >= 9.6 && t < 12.6) return 'DEMO-047 entregue na desmontagem';
      if (t >= 12.6 && t < 18.6) return 'Carlos volta para o recebimento';
      return 'Conferindo a chegada da DEMO-048';
    case 'desmontagem':
      return t >= 9.6 && t < 12.6 ? 'Rafael recebe a DEMO-047' : 'Peritagem da DEMO-044: 6 de 9 itens';
    case 'usinagem':
      return `Ciclo da DEMO-039: ${Math.round(((t % 24) / 24) * 100)}% do programa`;
    case 'montagem':
      return 'Troca de vedação da DEMO-036';
    case 'teste': {
      const v = (2.1 + 0.25 * Math.sin(t * 1.3)).toFixed(1).replace('.', ',');
      return t >= 6 && t < 12.5 ? 'Marcos leva o laudo da DEMO-034 à expedição' : `Motor em teste: vibração ${v} mm/s`;
    }
    case 'expedicao':
      if (t >= 13.5 && t < 14.6) return 'Levantando a DEMO-031';
      if (t >= 14.6 && t < 19.4) return 'DEMO-031 saindo para o cliente';
      if (t >= 19.4 && t < 23.9) return 'Empilhadeira volta com a próxima carga';
      return t >= 8 && t < 10.4 ? 'Laudo da DEMO-034 conferido' : 'DEMO-031 pronta para sair';
  }
  return '';
};
