import z from "zod";

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
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
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
    role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
  }),
});

export {
  createUserBodySchema,
  createUserResponseSchema,
  loginBodySchema,
  loginResponseSchema,
  profileResponseSchema,
};
