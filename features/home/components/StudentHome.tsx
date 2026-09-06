import { SectionHeader } from "@/shared/components/SectionHeader";
import { getStudentHomeData } from "../lib/student-home";
import { AnnouncementList } from "./AnnouncementList";
import { DocumentList } from "./DocumentList";
import { HomeGreeting } from "./HomeGreeting";
import { MensalidadeCard } from "./MensalidadeCard";
import { NextLessonCard } from "./NextLessonCard";
import { SeeAllLink } from "./SeeAllLink";
import type { HomeScreenProps } from "./home-screen-props";

export function StudentHome({ user }: HomeScreenProps) {
  const data = getStudentHomeData(user.id, user.name.split(" ")[0]);

  return (
    <div className="space-y-6">
      <HomeGreeting name={data.firstName} subtitle="Bom te ver por aqui." />

      <div className="grid gap-3 sm:grid-cols-2">
        <NextLessonCard lesson={data.nextLesson} />
        <MensalidadeCard payment={data.currentPayment} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section className="space-y-3">
          <SectionHeader title="Avisos" action={<SeeAllLink href="/avisos" />} />
          <AnnouncementList announcements={data.announcements} />
        </section>

        <section className="space-y-3">
          <SectionHeader title="Materiais recentes" action={<SeeAllLink href="/materiais" />} />
          <DocumentList documents={data.documents} />
        </section>
      </div>
    </div>
  );
}
