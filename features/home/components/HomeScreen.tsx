import { AdminHome } from "./AdminHome";
import { ProfessorHome } from "./ProfessorHome";
import { StudentHome } from "./StudentHome";
import type { HomeScreenProps } from "./home-screen-props";

/** Resolve a home pelo papel da sessão. */
export function HomeScreen({ user }: HomeScreenProps) {
  switch (user.role) {
    case "admin":
      return <AdminHome user={user} />;
    case "professor":
      return <ProfessorHome user={user} />;
    case "aluno":
      return <StudentHome user={user} />;
    default:
      return null;
  }
}
