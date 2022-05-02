import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    jwt: async ({ token, account }) => {
      // TODO: query user_id from DB
      return { ...token, user_id: 'user_id' };
    },
    session: async ({ session, token }) => {
      return { ...session, user_id: token.user_id };
    },
  },
});
