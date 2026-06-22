// Conteúdo do site, derivado das telas reais do app OStrack.
// Copy refinada via copy-chief sobre diagnóstico Easy Copy:
// a restrição do cliente é o lead time ADMINISTRATIVO, não a máquina.

export const STAGES = [
  {
    n: "01",
    icon: "inbox",
    title: "Entrada",
    desc: "Cadastro imediato da OS, do cliente e do equipamento com registro do estado de chegada. Rastreabilidade total desde o primeiro minuto.",
  },
  {
    n: "02",
    icon: "search",
    title: "Peritagem",
    desc: "Peritagem móvel com fotos e laudos dimensionais direto pelo celular. Sem papel, sem redigitação de laudo no escritório.",
  },
  {
    n: "03",
    icon: "handshake",
    title: "Aprovação",
    desc: "Link exclusivo enviado por WhatsApp. Seu cliente visualiza o laudo técnico com fotos e aprova o orçamento digital em 1 clique.",
  },
  {
    n: "04",
    icon: "wrench",
    title: "Execução",
    desc: "Kanban visual do chão de fábrica. Saiba exatamente em qual posto de trabalho (jateamento, usinagem, montagem) a peça está.",
  },
  {
    n: "05",
    icon: "layers",
    title: "Montagem & Qualidade",
    desc: "Checklist de testes dimensionais e de pressão registrados. Reduza a zero os retrabalhos antes de liberar o equipamento.",
  },
  {
    n: "06",
    icon: "truck",
    title: "Entrega",
    desc: "Encerramento automático da OS com relatório completo de intervenção e histórico de desgaste pronto para o cliente.",
  },
];

export const FEATURES = [
  {
    icon: "kanban",
    title: "Kanban de OS",
    desc: "Organize toda a produção por posto de trabalho. Identifique na hora qual redutor ou cilindro está acumulando poeira e há quantos dias.",
  },
  {
    icon: "file",
    title: "Peritagem & Diagnóstico",
    desc: "Laudos técnicos estruturados de desgaste e medições, exportados em PDF profissional com a sua logo para o cliente.",
  },
  {
    icon: "handshake",
    title: "Orçamento & Aprovação",
    desc: "Gere orçamentos conectados à peritagem e envie via WhatsApp. Seu cliente aprova com 1 clique, agilizando a compra.",
  },
  {
    icon: "portal",
    title: "Portal do Cliente",
    desc: "Um painel transparente para o seu cliente conferir status ao vivo, baixar laudos e aprovar propostas sem precisar te ligar.",
  },
  {
    icon: "chart",
    title: "Inteligência & Lead Time",
    desc: "Indicadores automáticos de lead time operacional e administrativo. Identifique onde a OS perde mais tempo.",
  },
  {
    icon: "users",
    title: "Equipe Técnica",
    desc: "Distribua ordens por especialidade técnica e rastreie o desempenho e gargalos por funcionário no chão de fábrica.",
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
    desc: "Protocolo OS-2041 aberto. Você recebe a confirmação na hora por e-mail ou WhatsApp com nº da ordem.",
    tag: "Confirmação automática",
  },
  {
    n: "02",
    icon: "file",
    when: "Após a peritagem",
    title: "Laudo de diagnóstico",
    desc: "Diagnóstico visual e dimensional transparente em PDF, com fotos claras demonstrando a necessidade técnica da troca.",
    tag: "PDF profissional",
  },
  {
    n: "03",
    icon: "handshake",
    when: "Para decidir",
    title: "Orçamento no portal",
    desc: "Aprove ou questione itens direto na plataforma. Sem burocracia, sem perder cotações no e-mail.",
    tag: "Aprovação 1-clique",
  },
  {
    n: "04",
    icon: "kanban",
    when: "Durante o reparo",
    title: "Acompanhamento em tempo real",
    desc: "Acesso ao vivo ao posto atual de trabalho da peça. Transparência que reduz ligações de cobrança.",
    tag: "Status ao vivo",
  },
  {
    n: "05",
    icon: "check",
    when: "Antes de sair",
    title: "Certificado de qualidade",
    desc: "Comprovação dos testes dimensionais e funcionais realizados antes de embalar.",
    tag: "Conformidade",
  },
  {
    n: "06",
    icon: "truck",
    when: "Na entrega",
    title: "Relatório de conclusão",
    desc: "Histórico completo do serviço estruturado para auditorias e decisões futuras de manutenção.",
    tag: "Histórico completo",
  },
];
