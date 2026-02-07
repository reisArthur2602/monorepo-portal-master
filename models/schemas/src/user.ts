import z from "zod";
import { UserRole } from "@repo/db";

const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const createUserResponseSchema = z.object({
  created: z.boolean().default(true),
});

const profileResponseSchema = z.object({
  user: z.object({
    id: z.cuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(UserRole),
  }),
});

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.cuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(UserRole).default("MEMBER"),
  }),
});

export {
  createUserBodySchema,
  createUserResponseSchema,
  loginBodySchema,
  loginResponseSchema,
  profileResponseSchema,
};
