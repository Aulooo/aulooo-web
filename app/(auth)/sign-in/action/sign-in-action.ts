"use server";

import { redirect } from "next/navigation";
import { authApi } from "@/features/auth/api/auth-api";
import { applyAuthSuccess } from "@/features/auth/lib/apply-auth-success";
import { signInSchema } from "@/features/auth/validator/sign-in-validator";

export async function sendSignInAction(previousState: any, actionPayload: { get: (arg0: string) => any; }){

    const credentials = signInSchema.safeParse({ email: actionPayload.get("email"), password: actionPayload.get("password")});

    if(!credentials.success){
        return {
            success: false,
            message: "Atenção. As informações foram preenchida de forma indevida, por favor, preencha corretamente."
        }
    }
    const { email, password } = credentials.data;

    const response = await authApi.signIn({ email, password });

    if(response.code === 1 && response.data){
        await applyAuthSuccess(response.data);

        redirect("/home");
    }

    // code 2 (VALIDATION_ERROR, INVALID_CREDENTIALS, ACCOUNT_INACTIVE, ...) e code 3
    // (UNEXPECTED_ERROR) já vêm com uma `message` segura e compreensível do backend.
    return {
        success: false,
        message: response.message || "Atenção, ocorreu um erro inesperado, por favor entre em contato com o adminstrador do sistema"
    };
}
