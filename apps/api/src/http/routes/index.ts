import type { FastifyInstance } from "fastify";
import { usersRoutes } from "./users/index";
import { patientRoutes } from "./patients";

export const dashboardRoutes = (fastify: FastifyInstance) => {
  fastify.register(usersRoutes, { prefix: "/users" });
  fastify.register(patientRoutes, { prefix: "/patients" });
};

export const totemRoutes = (fastify: FastifyInstance) => {};

export const appRoutes = (fastify: FastifyInstance) => {};
