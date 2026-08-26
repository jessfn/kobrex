import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isOwner: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    isOwner?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    isOwner: boolean;
  }
}
