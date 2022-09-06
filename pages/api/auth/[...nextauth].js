import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../helpers/auth";
import { connectDatabase, getDocument } from "../../../helpers/db-utils";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const client = await connectDatabase();

        const user = await getDocument(client, "users", {
          email: credentials.email,
        });

        if (!user) throw new Error("No user found!");

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Wrong password!");

        return {
          email: user.email,
        };
      },
    }),
  ],
});
