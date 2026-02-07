import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

import { UnauthorizedError } from "../http/errors/unauthorized";
import { db } from "../db/prisma";

export const authPlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
  fastify.decorateRequest("getCurrentUserId", async () => {
    throw new UnauthorizedError("Acesso não autorizado.");
  });

  fastify.decorateRequest("shouldBeAdmin", async () => {
    throw new UnauthorizedError("Acesso não autorizado.");
  });

  fastify.addHook("preHandler", async (request) => {
    request.getCurrentUserId = async () => {
      if (!request.headers.authorization)
        throw new UnauthorizedError("Token de autenticação não informado.");

      try {
        const payload = await request.jwtVerify<{ sub: string }>();

        const user = await db.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, role: true },
        });

        if (!user)
          throw new UnauthorizedError("Usuário não autorizado ou inexistente.");

        return payload.sub;
      } catch (error) {
        throw new UnauthorizedError("Token de autenticação inválido.");
      }
    };

    request.shouldBeAdmin = async () => {
      const userId = await request.getCurrentUserId();

      const user = await db.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      const shouldBeAdmin = user?.role !== "ADMIN";

      if (!shouldBeAdmin)
        throw new UnauthorizedError(
          "Você não tem permissão para realizar esta ação. Caso precise de acesso, entre em contato com o suporte.",
        );
    };
  });
});
