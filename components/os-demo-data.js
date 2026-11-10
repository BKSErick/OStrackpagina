export const OSTRACK_ROUTE = [
    "Entrada",
    "Desmontagem e limpeza",
    "Em diagnóstico",
    "Orçamento em preparação",
    "Orçamento enviado",
    "Requisição de compra",
    "Aguardando peças",
    "Em montagem",
    "Teste de qualidade",
    "Entrega"
];
/* Ficha da DEMO-014 recriada do OStrack. Tudo aqui é exemplo, com valores fictícios. */
export const IDLE_LIMIT_DAYS = 3;
export const OS_START_STAGE = 4;
export const OS_NEXT_ACTION = {
    4: "Cobrar a aprovação do orçamento",
    5: "Emitir as requisições de compra",
    6: "Confirmar a data do fornecedor",
    7: "Liberar para o teste",
    8: "Emitir o relatório e entregar",
    9: "Avisar o cliente da retirada"
};
/* Custo e margem em cada etapa, a partir do orçamento enviado. */
export const OS_MONEY = {
    4: { quote: 0, purchases: 0, labor: 840, hours: 6 },
    5: { quote: 6800, purchases: 1240, labor: 840, hours: 6 },
    6: { quote: 6800, purchases: 1240, labor: 840, hours: 6 },
    7: { quote: 6800, purchases: 1240, labor: 1680, hours: 12 },
    8: { quote: 6800, purchases: 1240, labor: 1960, hours: 14 },
    9: { quote: 6800, purchases: 1240, labor: 1960, hours: 14 }
};
export const OS_SENT_QUOTE = 6800;
export const OS_PLANNED_HOURS = 16;
export const OS_HISTORY = [
    { stage: 0, date: "20/10", days: 0.5 },
    { stage: 1, date: "20/10", days: 2.5 },
    { stage: 2, date: "23/10", days: 2.5 },
    { stage: 3, date: "25/10", days: 0.5 },
    { stage: 4, date: "26/10", days: 4 }
];
export const OS_CHECKLIST = [
    { label: "Inspeção visual", status: "ok" },
    { label: "Dimensional do Ø80", status: "warn" },
    { label: "Batimento radial", status: "ok" },
    { label: "Rasgo de chaveta", status: "warn" },
    { label: "Trincas (líquido penetrante)", status: "ok" },
    { label: "Rosca da ponta", status: "ok" },
    { label: "Sede dos rolamentos", status: "ok" },
    { label: "Alojamento dos retentores", status: "ok" }
];
export const OS_PARTS = [
    { item: "Rolamento 6316 C3", kind: "buy", qty: 2 },
    { item: "Retentor 80 x 110 x 12", kind: "buy", qty: 2 },
    { item: "Bucha de bronze", kind: "make", qty: 1 }
];
