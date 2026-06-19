// Conteúdo do site, derivado das telas reais do app OStrack.
// Copy refinada via copy-chief sobre diagnóstico TOC (Goldratt):
// a restrição do cliente é o lead time ADMINISTRATIVO, não a máquina.

export const STAGES = [
  {
    n: "01",
    icon: "inbox",
    title: "Entrada",
    desc: "Recebimento e cadastro da OS, do cliente e do equipamento. Rastreável desde o primeiro minuto. Nada entra sem protocolo.",
  },
  {
    n: "02",
    icon: "search",
    title: "Peritagem",
    desc: "Inspeção técnica com diagnóstico estruturado, medições e fotos. Gera laudo em PDF pronto pro cliente, sem retrabalho.",
  },
  {
    n: "03",
    icon: "handshake",
    title: "Aprovação",
    desc: "Orçamento enviado ao portal do cliente, que aprova com 1 clique. Aqui mora o gargalo, e é aqui que o OStrack ataca.",
  },
  {
    n: "04",
    icon: "wrench",
    title: "Execução",
    desc: "Kanban do chão de fábrica com responsável, etapa e status de cada OS em tempo real. Você vê onde cada peça travou.",
  },
  {
    n: "05",
    icon: "layers",
    title: "Montagem & Qualidade",
    desc: "Montagem final com testes de qualidade registrados. Nada sai da bancada sem passar pelo gate de conformidade.",
  },
  {
    n: "06",
    icon: "truck",
    title: "Entrega",
    desc: "Relatório de conclusão, encerramento da OS e histórico completo, pronto pro próximo serviço do mesmo cliente.",
  },
];

export const FEATURES = [
  {
    icon: "kanban",
    title: "Kanban de OS",
    desc: "Todas as ordens por etapa do fluxo. Veja num relance qual OS está parada e há quantos dias está esperando.",
  },
  {
    icon: "file",
    title: "Peritagem & Diagnóstico",
    desc: "Laudo técnico estruturado com medições e fotos, exportado em PDF profissional com a marca da sua empresa.",
  },
  {
    icon: "handshake",
    title: "Orçamento & Aprovação",
    desc: "Monte o orçamento item a item e mande pra aprovação digital. O cliente aprova com 1 clique, sem 8 e-mails.",
  },
  {
    icon: "portal",
    title: "Portal do Cliente",
    desc: "Seu cliente acompanha a OS, aprova orçamentos e baixa laudos sozinho, e para de ligar perguntando status.",
  },
  {
    icon: "chart",
    title: "Inteligência & Lead Time",
    desc: "Dashboards de lead time, gargalos e throughput. Decida pelo fluxo real da oficina, não por achismo.",
  },
  {
    icon: "users",
    title: "Equipe Técnica",
    desc: "Distribua OS por técnico, acompanhe a carga de trabalho e responsabilize cada etapa do reparo.",
  },
];

export const METRICS = [
  { value: "6", label: "etapas rastreadas, ponta a ponta" },
  { value: "1 clique", label: "para o cliente aprovar o orçamento" },
  { value: "0", label: "ligação cobrando status da OS" },
];

// Linha do tempo na VISÃO DO CLIENTE — o que o cliente final recebe a cada etapa.
export const CLIENT_TIMELINE = [
  {
    n: "01",
    icon: "inbox",
    when: "No recebimento",
    title: "Equipamento recebido",
    desc: "Protocolo OS-2041 aberto. Você recebe a confirmação na hora, com nº da ordem e responsável.",
    tag: "Confirmação automática",
  },
  {
    n: "02",
    icon: "file",
    when: "Após a peritagem",
    title: "Laudo de diagnóstico",
    desc: "Diagnóstico técnico em PDF, com fotos e medições. Sem juridiquês: você entende o que sua peça tem.",
    tag: "PDF profissional",
  },
  {
    n: "03",
    icon: "handshake",
    when: "Para decidir",
    title: "Orçamento no portal",
    desc: "Aprove ou questione com 1 clique. Sem troca de 8 e-mails, sem orçamento perdido na caixa de entrada.",
    tag: "Aprovação 1-clique",
  },
  {
    n: "04",
    icon: "kanban",
    when: "Durante o reparo",
    title: "Acompanhamento em tempo real",
    desc: "Veja a etapa atual da sua OS quando quiser. Zero ligação pra perguntar 'e aí, como tá?'.",
    tag: "Status ao vivo",
  },
  {
    n: "05",
    icon: "check",
    when: "Antes de sair",
    title: "Certificado de qualidade",
    desc: "Testes de conformidade registrados antes da peça deixar a bancada. Você recebe a comprovação.",
    tag: "Conformidade",
  },
  {
    n: "06",
    icon: "truck",
    when: "Na entrega",
    title: "Relatório de conclusão",
    desc: "Histórico completo do serviço, pronto pra auditoria e pro próximo reparo do mesmo equipamento.",
    tag: "Histórico completo",
  },
];
