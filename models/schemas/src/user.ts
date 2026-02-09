import z from "zod";

export const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

export const createUserResponseSchema = z.object({
  created: z.boolean().default(true),
});

export const profileResponseSchema = z.object({
  user: z.object({
    id: z.cuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  }),
});

export const getUserRoleResponseSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.cuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  }),
});
