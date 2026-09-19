"use client";

import { useActionState, useRef } from "react";
import { Camera } from "lucide-react";
import { IDLE_ACTION_STATE } from "@/shared/lib/action-state";
import { uploadAvatar } from "../actions/upload-avatar";

/** Botão-câmera sobreposto no canto do avatar — escolher arquivo já envia. */
export function AvatarUploadButton() {
  const [state, formAction, pending] = useActionState(uploadAvatar, IDLE_ACTION_STATE);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={formAction} className="absolute -right-1 -bottom-1">
      <label
        htmlFor="avatar-file"
        aria-label="Alterar foto"
        className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm ring-2 ring-card"
      >
        <Camera className="size-3.5" aria-hidden />
      </label>
      <input
        id="avatar-file"
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={pending}
        onChange={() => formRef.current?.requestSubmit()}
      />
      {!state.ok && state.message ? (
        <p className="absolute top-full left-1/2 mt-1 w-40 -translate-x-1/2 text-center text-xs text-destructive">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
