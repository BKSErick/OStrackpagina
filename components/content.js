// Conteúdo do site, derivado das telas reais do app OStrack.
// Posicionamento: pipeline de recuperação + escopo técnico + rastreabilidade documental.

export const STAGES = [
  {
    n: "01",
    icon: "inbox",
    title: "Entrada",
    desc: "Cadastro da OS, cliente e equipamento com registro do estado de chegada. A rastreabilidade começa no recebimento.",
  },
  {
    n: "02",
    icon: "search",
    title: "Peritagem",
    desc: "Fotos, achados técnicos e medições ficam ligados à OS. A equipe deixa de depender de papel solto e memória.",
  },
  {
    n: "03",
    icon: "handshake",
    title: "Aprovação",
    desc: "O cliente recebe o escopo técnico para aprovar ou questionar. Preço, horas e notas internas continuam protegidos.",
  },
  {
    n: "04",
    icon: "wrench",
    title: "Execução",
    desc: "Kanban visual do chão de fábrica. Saiba em qual posto a peça está e há quanto tempo a OS não anda.",
  },
  {
    n: "05",
    icon: "layers",
    title: "Qualidade",
    desc: "Checklist e relatório técnico registram a liberação antes da entrega, com evidência para reduzir retrabalho.",
  },
  {
    n: "06",
    icon: "truck",
    title: "Entrega",
    desc: "Encerramento com histórico da OS, evidências, testes e base documental pronta para o cliente industrial.",
  },
];

export const FEATURES = [
  {
    icon: "kanban",
    title: "Pipeline de OS",
    desc: "Organize a recuperação por etapa real: diagnóstico, orçamento, aprovação, compras, execução, montagem, qualidade e entrega.",
  },
  {
    icon: "file",
    title: "Peritagem & Evidências",
    desc: "Centralize achados técnicos, fotos, medições e observações que depois sustentam relatório técnico e databook.",
  },
  {
    icon: "handshake",
    title: "Escopo & Aprovação",
    desc: "Envie ao cliente o que ele precisa aprovar: achados, itens e tipo de ação. Sem expor preço, horas ou margem.",
  },
  {
    icon: "portal",
    title: "Portal do Cliente",
    desc: "Status, escopo e documentos em um link claro para reduzir ligações de cobrança e e-mails perdidos.",
  },
  {
    icon: "chart",
    title: "Inteligência de Lead Time",
    desc: "Acompanhe quanto tempo a OS passa em cada etapa e encontre onde a fila perde velocidade.",
  },
  {
    icon: "users",
    title: "Equipe Técnica",
    desc: "Distribua ordens por responsável e especialidade, mantendo o rastro de quem atuou em cada fase da OS.",
  },
];

export const METRICS = [
  { value: "6", label: "macroetapas para explicar o fluxo ao cliente" },
  { value: "10", label: "etapas operacionais quando a recuperação exige detalhe" },
  { value: "1", label: "rastro único da entrada à entrega" },
];

export const CLIENT_TIMELINE = [
  {
    n: "01",
    icon: "inbox",
    when: "No recebimento",
    title: "Equipamento recebido",
    desc: "A OS é aberta com identificação do cliente, equipamento e estado de chegada.",
    tag: "Protocolo registrado",
  },
  {
    n: "02",
    icon: "file",
    when: "Após a peritagem",
    title: "Diagnóstico técnico",
    desc: "Fotos, achados e medições explicam por que aquela recuperação precisa acontecer.",
    tag: "Evidência técnica",
  },
  {
    n: "03",
    icon: "handshake",
    when: "Para decidir",
    title: "Escopo para aprovação",
    desc: "O cliente aprova ou questiona o escopo do serviço sem visualizar preço, horas ou notas internas.",
    tag: "Aprovação protegida",
  },
  {
    n: "04",
    icon: "kanban",
    when: "Durante o reparo",
    title: "Status de execução",
    desc: "O cliente acompanha a etapa atual e a operação reduz chamadas pedindo atualização.",
    tag: "Status rastreável",
  },
  {
    n: "05",
    icon: "check",
    when: "Antes de sair",
    title: "Qualidade registrada",
    desc: "Checklist e relatório técnico sustentam a liberação antes da entrega.",
    tag: "Conformidade",
  },
  {
    n: "06",
    icon: "truck",
    when: "Na entrega",
    title: "Histórico completo",
    desc: "A entrega sai com base documental para auditorias, cobranças e decisões futuras de manutenção.",
    tag: "Base para databook",
  },
];
