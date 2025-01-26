import "next-auth";

declare module "next-auth" {
  interface User {
    email: string;
    name: string | null;
    id: string;
    emailVerified: Date | null;
    image: string | null;
  }

  interface Session {
    user: {
      email: string;
      name: string | null;
      id: string;
      emailVerified: Date | null;
      image: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  }
}
