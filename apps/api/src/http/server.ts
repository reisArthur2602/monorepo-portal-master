import 'dotenv/config';

import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { fastifyMultipart } from '@fastify/multipart';
import fastify from 'fastify';

import fastifySwagger from '@fastify/swagger';
import fastifyApiReference from '@scalar/fastify-api-reference';
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { errorHandler } from './errors/index.ts';
import { routes } from './routes/index.ts';

const PORT = Number(process.env.PORT) ?? 6000;

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);
server.setErrorHandler(errorHandler);

server.register(fastifyCors, { origin: true });

server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string,
});

server.register(fastifyMultipart, {
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 1,
        fields: 10,
    },
});

server.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'Portal Master — API',
            version: '1.0.0',
            description: 'API do sistema de gestão Portal Master',
        },
        servers: [],

        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
        },

        security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform,
});

server.get('/openapi.json', async () => {
    return server.swagger();
});

server.register(fastifyApiReference, {
    routePrefix: '/docs',
    configuration: {
        url: '/openapi.json',
    },
});

server.register(routes);

server.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
    console.clear();
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    console.log(`📘 Documentação: http://localhost:${PORT}/docs`);
});
