import GoogleProvider from "next-auth/providers/google";
import NextAuth, { NextAuthOptions } from "next-auth";
export const options:NextAuthOptions= {
    providers: [
        GoogleProvider({
            clientId: "470811894525-o22pdoqo14q0f6r91140rno6grdr5eqs.apps.googleusercontent.com",
            clientSecret: "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"
        })
    ],
    callbacks: {
        async signIn() {
            console.log()
            return true // Do different verification for other providers that don't have `email_verified`
        },
    }
}
export  default NextAuth(options)