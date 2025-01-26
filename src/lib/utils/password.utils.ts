import bcrypt from "bcryptjs";
export const hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

export const comparePassword = async ({
  password,
  hashPassword,
}: {
  password: string;
  hashPassword: string;
}) => bcrypt.compare(password, hashPassword);
