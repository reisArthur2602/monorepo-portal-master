import { getUserRoleResponseSchema } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { NotFoundError } from "../../errors/not-found";
import { db } from "../../../db/prisma";

export const getUserRole = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/role",
    {
      schema: {
        tags: ["Users"],
        summary: "Get User Role",
        operationId: "getUserRole",
        response: {
          200: getUserRoleResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: [async (request) => await request.authenticate()],
    },

    async (request, reply) => {
      const userId = await request.getCurrentUserId();

      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          role: true,
        },
      });
      if (!user) throw new NotFoundError("Usuário não encontrado.");

      return reply.status(200).send({ role: user.role });
    },
  );
};
