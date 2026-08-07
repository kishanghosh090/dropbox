import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(4, { message: "password is minimum of 4 characters" }),
    passwordConformation: z
      .string()
      .min(1, { message: "please confirm you password" }),
  })
  .refine((data) => data.password == data.passwordConformation, {
    message: "Password do not match",
  });
