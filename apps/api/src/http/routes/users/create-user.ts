import { createUserBodySchema, createUserResponseSchema } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { hashPassword } from "../../../lib/argon2";
import { BadRequestError } from "../../errors/bad-request";
import { db } from "../../../db/prisma";

export const createUser = (app: FastifyInstance) =>
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/create",
      {
        schema: {
          tags: ["Users"],
          summary: "Create User",
          operationId: "createUser",
          body: createUserBodySchema,
          response: {
            201: createUserResponseSchema,
          },
          security: [{ bearerAuth: [] }],
        },

        preHandler: [
          async (request) => await request.authenticate(),
          async (request) => await request.shouldBeAdmin(),
        ],
      },

      async (request, reply) => {
        const { email, name } = request.body;

        const existingUserWithEmail = await db.user.findUnique({
          where: { email },
        });

        if (existingUserWithEmail)
          throw new BadRequestError(
            "Este e-mail está sendo usado por outro membro",
          );

        const DEFAULT_PASSWORD_USERS = process.env
          .DEFAULT_PASSWORD_USERS as string;

        const passwordHash = await hashPassword(DEFAULT_PASSWORD_USERS);

        await db.user.create({
          data: { email, password: passwordHash, name },
        });

        return reply.status(201).send({ created: true });
      },
    );
