"use server";

import { signIn } from "./auth";

export const signInWithGoogle = async () => {
  return signIn("google", { redirectTo: "/dashboard" });
};

export const signInWithCredentials = async () => {
  return signIn("credentials", { redirectTo: "/dashboard" });
};
