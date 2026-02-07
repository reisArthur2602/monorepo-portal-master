import type { FastifyInstance } from "fastify";
import { createUser } from "./create-user";
import { profile } from "./profile";
import { login } from "./login";

export const usersRoutes = (app: FastifyInstance) => {
  app.register(login);
  app.register(createUser);
  app.register(profile);
};
