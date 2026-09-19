import { NotebookText, UserMinus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { initials } from "@/shared/lib/initials";
import { statusLabel } from "@/shared/lib/status-label";
import type { StudentRowProps } from "./StudentRow.types";

export function StudentRow({ student, pending, onDeactivate, onOpenNotes }: StudentRowProps) {
  const isActive = !/inactive|desativad/i.test(student.linkStatus);

  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback>{initials(student.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{student.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {student.phone || "Sem telefone"}
            {student.objective ? ` · ${student.objective}` : ""}
          </p>
        </div>

        <Badge variant={isActive ? "success" : "secondary"}>{statusLabel(student.linkStatus)}</Badge>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Observações"
          onClick={() => onOpenNotes(student.studentId)}
        >
          <NotebookText />
        </Button>

        {isActive ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Desativar vínculo" disabled={pending}>
                <UserMinus />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desativar vínculo com {student.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  {student.name} perde o acesso à sua agenda, materiais e avisos. O histórico continua
                  disponível pra você. Não dá pra desfazer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeactivate(student.studentId)}>
                  Desativar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </CardContent>
    </Card>
  );
}
