import type { FastifyInstance } from 'fastify';
import { usersRoutes } from './users/index.ts';

export const routes = (app: FastifyInstance) => {
    app.register(usersRoutes, { prefix: '/users' });
};
