import { z } from "zod";
import { loginSchema } from "./login";

export const signupSchema = loginSchema
  .extend({
    name: z.string().min(3),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupFormData = z.infer<typeof signupSchema>;
