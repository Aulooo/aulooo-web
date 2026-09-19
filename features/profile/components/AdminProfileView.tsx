import { Moon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { initials } from "@/shared/lib/initials";
import { ROLE_LABEL, ThemeToggle } from "@/features/shell";
import type { AdminProfile } from "../types";

export function AdminProfileView({ profile }: { profile: AdminProfile }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Perfil</h1>

      <Card>
        <CardContent className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-heading text-base font-semibold text-foreground">{profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="secondary">{ROLE_LABEL[profile.role]}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Moon className="size-4 text-muted-foreground" aria-hidden />
            Tema escuro
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
