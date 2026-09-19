import { CalendarDays, FileText, Home, User, Users } from "lucide-react";
import type { Role } from "@/features/auth";
import type { NavItem } from "./types";

const inicio: NavItem = { label: "Início", href: "/home", icon: Home };
const perfil: NavItem = { label: "Perfil", href: "/perfil", icon: User };
const materiais: NavItem = { label: "Materiais", href: "/materiais", icon: FileText };

/**
 * Navegação por papel. Vai virar dado do backend (permissões ↔ role), mas por
 * ora é estático e serve os 3 perfis do MVP.
 */
export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  aluno: [
    inicio,
    materiais,
    { label: "Agenda", href: "/agenda", icon: CalendarDays },
    perfil,
  ],
  professor: [
    inicio,
    { label: "Alunos", href: "/alunos", icon: Users },
    materiais,
    perfil,
  ],
  admin: [inicio, perfil],
};
