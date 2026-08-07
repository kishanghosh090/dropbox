import * as z from "zod";

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Email or username is required" }),
  password: z
    .string()
    .min(4, { message: "password is minimum of 4 characters" }),
});
