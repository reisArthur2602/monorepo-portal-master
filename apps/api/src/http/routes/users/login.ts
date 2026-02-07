import { db } from "@repo/db";
import { loginBodySchema, loginResponseSchema } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import { type ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequestError } from "../../errors/bad-request";
import { verifyPassword } from "../../../lib/argon2";

export const login = (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        tags: ["Users"],
        summary: "Login",
        body: loginBodySchema,
        operationId: "login",
        response: {
          200: loginResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await db.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
        },
      });

      if (!user) throw new BadRequestError("Credenciais inválidas");

      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) throw new BadRequestError("Credenciais inválidas");

      const accessToken = await reply.jwtSign(
        { sub: user.id },
        { expiresIn: "7d" },
      );

      return reply.status(200).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      });
    },
  );
};
