import type { FastifyInstance } from "fastify";
import { createUser } from "./create-user";
import { profile } from "./profile";
import { login } from "./login";
import { getUserRole } from "./get-user-role";

export const usersRoutes = (app: FastifyInstance) => {
  app.register(login);
  app.register(createUser);
  app.register(profile);
  app.register(getUserRole);
};
