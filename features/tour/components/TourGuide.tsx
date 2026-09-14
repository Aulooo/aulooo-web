"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ACTIONS, EVENTS, STATUS } from "react-joyride";
import type { EventData } from "react-joyride";
import type { Role } from "@/features/auth";
import { PROFESSOR_TOUR, STUDENT_TOUR } from "../tour-steps";

const Joyride = dynamic(() => import("react-joyride").then((mod) => mod.Joyride), { ssr: false });

function doneKey(role: Role, userId: string) {
  return `aulooo_tour_done_${role}_${userId}`;
}

/** Espera a rota mudar e o alvo do passo aparecer no DOM (client nav é assíncrona). */
function waitForRouteAndTarget(route: string, selector: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const start = Date.now();
    function check() {
      const onRoute = window.location.pathname === route;
      const hasTarget = document.querySelector(selector) != null;
      if (onRoute && hasTarget) return resolve(true);
      if (Date.now() - start > timeoutMs) return resolve(hasTarget);
      setTimeout(check, 100);
    }
    check();
  });
}

export function TourGuide({ role, userId }: { role: Role; userId: string }) {
  const router = useRouter();
  const steps = role === "professor" ? PROFESSOR_TOUR : STUDENT_TOUR;

  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(doneKey(role, userId))) return;

    // Sem guarda de "já rodou": no StrictMode do dev este efeito dispara 2x
    // (mount → cleanup → mount) e um `cancelled` combinado com um ref de
    // "já iniciei" acaba nunca deixando o setRun(true) acontecer — o cleanup
    // da 1ª chamada cancela antes de resolver, e a 2ª nem entra por causa do
    // ref. Deixar rodar de novo aqui é inofensivo (idempotente).
    (async () => {
      const first = steps[0];
      if (window.location.pathname !== first.route) router.push(first.route);
      const ok = await waitForRouteAndTarget(first.route, first.target as string);
      if (ok) setRun(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    localStorage.setItem(doneKey(role, userId), "1");
    setRun(false);
  }

  async function advanceTo(nextIndex: number) {
    if (nextIndex < 0) return;
    if (nextIndex >= steps.length) {
      finish();
      return;
    }

    const next = steps[nextIndex];
    setRun(false);
    if (window.location.pathname !== next.route) router.push(next.route);
    const ok = await waitForRouteAndTarget(next.route, next.target as string);
    setIndex(nextIndex);
    if (ok) setRun(true);
  }

  function handleEvent(data: EventData) {
    const { status, type, action, index: stepIdx } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      finish();
      return;
    }

    if (action === ACTIONS.CLOSE || action === ACTIONS.SKIP) {
      finish();
      return;
    }

    if (type === EVENTS.TARGET_NOT_FOUND) {
      void advanceTo(stepIdx + 1);
      return;
    }

    if (type === EVENTS.STEP_AFTER) {
      const delta = action === ACTIONS.PREV ? -1 : 1;
      void advanceTo(stepIdx + delta);
    }
  }

  return (
    <>
      {/* Anima a entrada do tooltip a cada passo, no mesmo ritmo dos popovers/dropdowns
          do design system (fade + zoom-in ~95%, ~150ms). */}
      <style>{`
        .react-joyride__tooltip {
          animation: aulooo-tour-in 160ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes aulooo-tour-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .react-joyride__overlay {
          transition: opacity 150ms ease;
        }
      `}</style>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={index}
        continuous
        scrollToFirstStep
        onEvent={handleEvent}
        locale={{
          back: "Voltar",
          close: "Fechar",
          last: "Concluir",
          next: "Continuar",
          nextWithProgress: "Continuar ({current} de {total})",
          skip: "Sair",
        }}
        options={{
          // Tokens semânticos do design system (funcionam em claro e escuro,
          // já que são variáveis CSS resolvidas em tempo real pelo navegador).
          primaryColor: "var(--primary)",
          textColor: "var(--popover-foreground)",
          backgroundColor: "var(--popover)",
          arrowColor: "var(--popover)",
          overlayColor: "rgba(15, 17, 21, 0.5)",
          zIndex: 10000,
          showProgress: true,
          buttons: ["back", "close", "primary", "skip"],
          targetWaitTimeout: 3000,
          skipBeacon: true,
          spotlightPadding: 6,
          spotlightRadius: 10,
        }}
        styles={{
          tooltip: {
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            padding: 20,
            fontFamily: "var(--font-sans)",
          },
          tooltipTitle: {
            fontFamily: "var(--font-heading)",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.014em",
            marginBottom: 4,
          },
          tooltipContent: {
            fontSize: 14,
            lineHeight: 1.5,
            padding: "8px 0 0",
          },
          tooltipFooter: {
            marginTop: 16,
          },
          buttonPrimary: {
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: "var(--radius-lg)",
            padding: "0 14px",
            height: 32,
            fontSize: 14,
            fontWeight: 500,
            border: "none",
          },
          buttonBack: {
            color: "var(--foreground)",
            backgroundColor: "transparent",
            fontSize: 14,
            fontWeight: 500,
            marginRight: 8,
          },
          buttonSkip: {
            color: "var(--muted-foreground)",
            fontSize: 13,
          },
          buttonClose: {
            color: "var(--muted-foreground)",
            width: 14,
            height: 14,
          },
        }}
      />
    </>
  );
}
