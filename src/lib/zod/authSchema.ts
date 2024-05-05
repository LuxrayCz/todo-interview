import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(3, { message: "Email must contain atleast 3 characters" })
    .max(30, { message: "Email must contain maximum of 30 characters" }),
  password: z
    .string()
    .min(3, { message: "Password must contain atleast 3 characters" })
    .max(30, { message: "Password must contain maximum of 30 characters" }),
});
