import type { Step } from "react-joyride";

export type TourStep = Step & { route: string };

export const PROFESSOR_TOUR: TourStep[] = [
  {
    route: "/home",
    target: '[data-tour="home-greeting"]',
    title: "Bem-vindo(a) ao Aulooo!",
    content: "Aqui é o seu painel do dia: alunos ativos, aulas de hoje e os avisos mais recentes. Vamos dar uma volta rápida pelas telas principais?",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    route: "/home",
    target: '[data-tour="home-metrics"]',
    title: "Seu dia em números",
    content: "Alunos ativos e aulas marcadas pra hoje, direto na tela inicial — sem precisar abrir mais nada.",
    placement: "bottom",
  },
  {
    route: "/alunos",
    target: '[data-tour="invite-card"]',
    title: "Convide seus alunos",
    content: "Gere um código de 8 caracteres (ou um QR code) — o aluno usa pra criar a própria conta já vinculada a você.",
    placement: "bottom",
  },
  {
    route: "/alunos",
    target: '[data-tour="student-list"]',
    title: "Sua carteira de alunos",
    content: "Cada aluno vinculado aparece aqui: telefone, objetivo, status do vínculo — e um botão de observações privadas, que o aluno nunca vê.",
    placement: "top",
  },
  {
    route: "/agenda",
    target: '[data-tour="agenda-availability"]',
    title: "Primeiro, sua disponibilidade",
    content: "Antes de marcar qualquer aula, defina os horários da semana em que você atende — sem isso, nenhuma aula pode ser criada.",
    placement: "bottom",
  },
  {
    route: "/agenda",
    target: '[data-tour="agenda-new"]',
    title: "Marque uma aula",
    content: "Aula avulsa ou uma série recorrente (ex.: toda terça às 9h) — os dois formatos cabem aqui.",
    placement: "bottom",
  },
  {
    route: "/agenda",
    target: '[data-tour="agenda-reagendamentos"]',
    title: "Pedidos de reagendamento",
    content: "Quando um aluno pedir pra mudar o horário de uma aula, o pedido aparece aqui pra você aprovar ou recusar.",
    placement: "bottom",
  },
  {
    route: "/avisos",
    target: '[data-tour="avisos-new"]',
    title: "Fale com a turma toda",
    content: "Um aviso publicado aqui chega pra todos os seus alunos vinculados de uma vez.",
    placement: "bottom",
  },
  {
    route: "/materiais",
    target: '[data-tour="materiais-new"]',
    title: "Envie materiais",
    content: "PDF, planilha ou documento (até 10 MB) — sempre direto pro aluno certo.",
    placement: "bottom",
  },
  {
    route: "/perfil",
    target: '[data-tour="profile-edit"]',
    title: "Seu perfil",
    content: "Dados pessoais, registro profissional e o convite de alunos também ficam disponíveis por aqui. Pronto — é só isso!",
    placement: "bottom",
  },
];

export const STUDENT_TOUR: TourStep[] = [
  {
    route: "/home",
    target: '[data-tour="home-greeting"]',
    title: "Bem-vindo(a) ao Aulooo!",
    content: "Por aqui você acompanha sua próxima aula, avisos do seu professor e materiais novos. Vamos conhecer as telas?",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    route: "/agenda",
    target: '[data-tour="agenda-list"]',
    title: "Suas aulas",
    content: "Os horários marcados pelo seu professor aparecem aqui. Precisa mudar um horário? Dá pra pedir reagendamento em cada aula futura.",
    placement: "bottom",
  },
  {
    route: "/avisos",
    target: '[data-tour="avisos-list"]',
    title: "Avisos do professor",
    content: "Comunicados pra turma toda aparecem aqui, do mais recente pro mais antigo.",
    placement: "bottom",
  },
  {
    route: "/materiais",
    target: '[data-tour="materiais-list"]',
    title: "Materiais",
    content: "Arquivos que seu professor enviar pra você ficam disponíveis pra baixar aqui.",
    placement: "bottom",
  },
  {
    route: "/perfil",
    target: '[data-tour="profile-edit"]',
    title: "Seu perfil",
    content: "Atualize telefone, objetivo e dados pessoais quando quiser. Pronto — é só isso!",
    placement: "bottom",
  },
];
