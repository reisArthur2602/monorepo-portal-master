import "dotenv/config";

import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastifyMultipart } from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";

import fastifySwagger from "@fastify/swagger";
import fastifyApiReference from "@scalar/fastify-api-reference";

import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { errorHandler } from "./errors";
import { dashboardRoutes } from "./routes";
import { authPlugin } from "../plugins/auth";

const PORT = Number(process.env.PORT ?? 6000);
const HOST = process.env.HOST ?? "0.0.0.0";

const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL ?? `http://localhost:${PORT}`;

const server = fastify();

// server.register(fastifyRateLimit, { max: 20, timeWindow: "1 minute" });

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);
server.setErrorHandler(errorHandler);

server.register(fastifyCors, { origin: true });

server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
  sign: { expiresIn: process.env.JWT_EXPIRES_IN || "15m" },
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
    openapi: "3.0.3",
    info: {
      title: "Portal Master — API",
      version: "1.0.0",
      description: "API do sistema de gestão Portal Master",
    },

    servers: [{ url: PUBLIC_BASE_URL }],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  transform: jsonSchemaTransform,
});

server.get("/openapi.json", async () => server.swagger());

server.register(fastifyApiReference, {
  routePrefix: "/docs",
  configuration: {
    url: "/openapi.json",

    theme: "purple",
    layout: "classic",
    showSidebar: true,
    hideSearch: false,
    hideClientButton: true,
    hideDarkModeToggle: false,
    darkMode: true,
    hideModels: true,
    persistAuth: true,
    pageTitle: "Portal Master - Documentação",
    favicon:
      "https://img.icons8.com/?size=100&id=35588&format=png&color=0082FF",
  },
});

server.register(dashboardRoutes, { prefix: "/dashboard" });

server.register(authPlugin);

server.listen({ port: PORT, host: HOST }).then(() => {
  console.clear();
  console.log(`✅ Servidor rodando em ${PUBLIC_BASE_URL}`);
  console.log(`📘 Docs: ${PUBLIC_BASE_URL}/docs`);
  console.log(`🧾 OpenAPI: ${PUBLIC_BASE_URL}/openapi.json`);
});
