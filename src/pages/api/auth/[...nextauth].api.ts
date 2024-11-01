/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import GithubProvider, { GithubProfile } from 'next-auth/providers/github'
import { NextApiRequest, NextPageContext, NextApiResponse } from 'next'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'

export function buildNextAuthOptions(
  req: NextApiRequest | NextPageContext['req'],
  res: NextApiResponse | NextPageContext['res'],
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(req, res),
    providers: [
      GoogleProvider({
        allowDangerousEmailAccountLinking: true,
        clientId: process.env.GOOGLE_CLIENT_ID ?? '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: 'profile email',
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            emailVerified: profile.email_verified,
            avatarUrl: profile.picture,
          }
        },
      }),
      GithubProvider({
        allowDangerousEmailAccountLinking: true,
        clientId: process.env.GITHUB_ID ?? '',
        clientSecret: process.env.GITHUB_SECRET ?? '',
        profile(profile: GithubProfile) {
          return {
            id: profile.id.toString(),
            name: profile.name!,
            email: profile.email!,
            avatarUrl: profile.avatar_url,
          }
        },
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: {
            label: 'Email',
            type: 'text',
            placeholder: 'email@example.com',
          },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          // Aqui você verifica as credenciais do usuário
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email },
          })

          if (user && user.password === credentials?.password) {
            // Aqui você deve usar um método seguro de comparação
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              avatarUrl: user.avatarUrl,
            }
          } else {
            return null // Retorna null se as credenciais não forem válidas
          }
        },
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, buildNextAuthOptions(req, res))
}
