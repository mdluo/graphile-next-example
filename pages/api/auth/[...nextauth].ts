import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import { ownerPgPool } from 'server/utils/db';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    // ...add more providers here
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    jwt: async ({ token, user: userDetails, account }) => {
      if (!account) {
        return token;
      }
      const { provider, providerAccountId, ...accountDetails } = account;
      const {
        rows: [user],
      } = await ownerPgPool.query(
        'select * from app_private.link_or_register_user($1, $2, $3, $4, $5)',
        [
          token.user_id,
          provider,
          providerAccountId,
          userDetails,
          accountDetails,
        ],
      );
      return { ...token, user };
    },
    session: async ({ session, token }) => {
      if (token) {
        return { ...session, user: token.user } as typeof session;
      }
      return session;
    },
  },
});
