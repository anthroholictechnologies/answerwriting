import { prisma } from "answerwriting/prisma";
import { comparePassword } from "answerwriting/lib/utils/password.utils";
import {
  AuthenticatedUser,
  ErrorCodes,
} from "answerwriting/types/general.types";

export const authenticate = async (credentials: {
  email?: string;
  password?: string;
}): Promise<AuthenticatedUser | null> => {
  const email = credentials.email;
  const password = credentials.password;

  if (!email || !password) return null;

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    throw new Error(ErrorCodes.USER_NOT_FOUND);
  } else if (!user?.password) {
    throw new Error(ErrorCodes.ALREADY_REGISTERED_WITH_GOOGLE);
  } else if (!user.emailVerified) {
    throw new Error(ErrorCodes.VERIFICATION_EMAIL_PENDING);
  }

  const isValidPassword = await comparePassword({
    password,
    hashPassword: user.password,
  });

  return isValidPassword
    ? {
        email: user.email,
        name: user.name,
        id: user.id,
        emailVerified: user.emailVerified,
        image: user.image,
        password: user.password,
      }
    : null;
};
