import type { FastifyInstance } from "fastify";
import { usersRoutes } from "./users/index";

export const dashboardRoutes = (fastify: FastifyInstance) => {
  fastify.register(usersRoutes, { prefix: "/users" });
};

export const totemRoutes = (fastify: FastifyInstance) => {};

export const appRoutes = (fastify: FastifyInstance) => {};
