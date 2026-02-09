import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  listPatientsQueryParamsSchema,
  listPatientsResponseSchema,
} from "@repo/schemas";
import { db } from "../../../db/prisma";

export const listPatients = (app: FastifyInstance) =>
  app.withTypeProvider<ZodTypeProvider>().get(
    "/list",
    {
      schema: {
        tags: ["Patients"],
        summary: "List Patients with pagination and search",
        operationId: "listPatients",
        querystring: listPatientsQueryParamsSchema,
        response: {
          200: listPatientsResponseSchema,
        },
        security: [{ bearerAuth: [] }],
      },
      preHandler: [async (request) => await request.authenticate()],
    },
    async (request, reply) => {
      const { page, perPage, q } = request.query;

      const skip = (page - 1) * perPage;
      const take = perPage;

      const where = q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { cpf: { contains: q } },
              { phone: { contains: q } },
            ],
          }
        : {};

      const [total, items] = await Promise.all([
        db.patient.count({ where }),
        db.patient.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take,
          select: {
            id: true,
            name: true,
            cpf: true,
            phone: true,
            createdAt: true,
          },
        }),
      ]);

      return reply.status(200).send({
        patients: items.map((p) => ({
          ...p,
          createdAt: p.createdAt.toISOString(),
        })),
        meta: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      });
    },
  );
