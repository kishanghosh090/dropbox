import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(4, { message: "password is minimum of 4 characters" }),
    passwordConfirmation: z
      .string()
      .min(1, { message: "please confirm you password" }),
  })
  .refine((data) => data.password == data.passwordConfirmation, {
    message: "Password do not match",
  });
