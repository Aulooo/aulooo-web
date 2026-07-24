"use server";

import { redirect } from "next/navigation";
import { saveItemOnCookie } from "@/core/cookies/cookie-manager";
import { ACCESS_TOKEN_COOKIE } from "@/core/cookies/constants";
import { authApi } from "@/features/auth/api/auth-api";
import { signInSchema } from "@/features/auth/validator/sign-in-validator";

export async function sendSignInAction(previousState: any, actionPayload: { get: (arg0: string) => any; }){
    const credentials = signInSchema.safeParse({
        email: actionPayload.get("email"),
        password: actionPayload.get("password"),
    });

    if(!credentials.success){
        return {
            success: false,
            message: "Atenção. As informações foram preenchida de forma indevida, por favor, preencha corretamente."
        }
    }
    const { email, password } = credentials.data;

    const response = await authApi.signIn({ email, password });

    if(response && response.code){

        // Senha ou Email incorreto
        if(response.code == 2){
            return {
                success: false,
                message: "Email ou Senha incorretos, por favor, tente novamente."
            }
        }

        if(response.code == 1 && response.data && response.data.token){
            await saveItemOnCookie(
                ACCESS_TOKEN_COOKIE,
                response.data.token
            );

            redirect("/");
        }
    }


    return {
        success: false,
        message: "Atenção, ocorreu um erro inesperado, por favor entre em contato com o adminstrador do sistema"
    };
}