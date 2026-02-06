import { prisma } from '@repo/db';
import { createUserBodySchema, createUserResponseSchema } from '@repo/schemas';
import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { hashPassword } from '../../../lib/argon2';
import { authPlugin } from '../../../plugins/auth';
import { BadRequestError } from '../../errors/bad-request';

export const createUser = async (app: FastifyInstance) =>
    app
        .withTypeProvider<ZodTypeProvider>()
        .register(authPlugin)
        .post(
            '/',
            {
                schema: {
                    tags: ['Users'],
                    summary: 'Create User',
                    operationId: 'createUser',
                    body: createUserBodySchema,
                    response: {
                        201: createUserResponseSchema,
                    },
                },
                config: {
                    openapi: {
                        security: [{ bearerAuth: [] }],
                    },
                },
                preHandler: async (request) => {
                    await request.shouldBeAdmin();
                },
            },

            async (request, reply) => {
                const { email, name } = request.body;

                const existingUserWithEmail = await prisma.user.findUnique({
                    where: { email },
                });

                if (existingUserWithEmail)
                    throw new BadRequestError('Este e-mail está sendo usado por outro membro');

                const DEFAULT_PASSWORD_USERS = process.env.DEFAULT_PASSWORD_USERS as string;

                const passwordHash = await hashPassword(DEFAULT_PASSWORD_USERS);

                await prisma.user.create({
                    data: { email, password: passwordHash, name },
                });

                return reply.status(201).send(null);
            }
        );
