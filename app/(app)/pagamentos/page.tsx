import { redirect } from "next/navigation";
import { PagamentosView } from "@/features/payments";
import { getMockSession } from "@/mock/session";
import { paymentsDb } from "@/mock/db/payments";

export default async function PagamentosPage() {
  const user = await getMockSession();
  if (user.role !== "aluno") redirect("/financeiro");

  const payments = await paymentsDb.forStudent(user.id);

  return <PagamentosView payments={payments} />;
}
