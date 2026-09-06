import { redirect } from "next/navigation";
import { CURRENT_MONTH_LABEL, RelatoriosView, getAdminReport } from "@/features/reports";
import { getMockSession } from "@/mock/session";

export default async function RelatoriosPage() {
  const user = await getMockSession();
  if (user.role !== "admin") redirect("/home");

  const report = await getAdminReport();

  return <RelatoriosView report={report} monthLabel={CURRENT_MONTH_LABEL} />;
}
