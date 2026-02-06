import type { FastifyInstance } from 'fastify';
import { createUser } from './create-user.ts';
import { profile } from './profile.ts';

export const usersRoutes = (app: FastifyInstance) => {
    app.register(createUser);
    app.register(profile);
};
