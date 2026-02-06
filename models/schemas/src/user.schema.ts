import z from 'zod';

export const createUserBodySchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
});

export const createUserResponseSchema = z.null();

type UserRole = 'MEMBER' | 'ADMIN';

export const profileResponseSchema = z.object({
    user: z.object({
        id: z.cuid(),
        email: z.string().email(),
        name: z.string(),
        role: z.enum(['MEMBER', 'ADMIN'] as UserRole[]),
    }),
});
