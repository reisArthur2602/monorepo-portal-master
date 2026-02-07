import { db } from "@repo/db";
import { profileResponseSchema } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authPlugin } from "../../../plugins/auth";
import { NotFoundError } from "../../errors/not-found";

export const profile = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(authPlugin)
    .get(
      "/profile",
      {
        schema: {
          tags: ["Users"],
          summary: "Get User Profile",
          operationId: "getProfile",
          response: {
            200: profileResponseSchema,
          },
          security: [{ bearerAuth: [] }],
        },

        preHandler: (request) => request.shouldBeAdmin(),
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId();

        const user = await db.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });
        if (!user) throw new NotFoundError("Usuário não encontrado.");

        return reply.status(200).send({ user });
      },
    );
};
