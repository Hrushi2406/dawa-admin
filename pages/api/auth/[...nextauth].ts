import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Build Firebase credential with the Google ID token.

// Sign in with credential from the Google user.

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
  ],

  callbacks: {
    async signIn(params) {
      //   authService.adminSignIn(params);

      return true;
    },
  },
});

// credential: cert({
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY,
// }),
//

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));