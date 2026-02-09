import {
  createPatientBodySchema,
  createPatientResponseSchema,
} from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequestError } from "../../errors/bad-request";
import { db } from "../../../db/prisma";

export const createPatient = (app: FastifyInstance) =>
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/create",
      {
        schema: {
          tags: ["Patients"],
          summary: "Create Patient",
          operationId: "createPatient",
          body: createPatientBodySchema,
          response: {
            201: createPatientResponseSchema,
          },
          security: [{ bearerAuth: [] }],
        },
        preHandler: [async (request) => await request.authenticate()],
      },

      async (request, reply) => {
        const { birthDate, cpf, name, phone } = request.body;

        const existingPatientWithCpf = await db.patient.findUnique({
          where: { cpf },
        });

        if (existingPatientWithCpf)
          throw new BadRequestError(
            "Este CPF já está sendo usado por outro paciente",
          );

        const existingPatientWithPhone = await db.patient.findUnique({
          where: { phone },
        });

        if (existingPatientWithPhone)
          throw new BadRequestError(
            "Este telefone já está sendo usado por outro paciente",
          );

        await db.patient.create({
          data: { birthDate, cpf, name, phone },
        });

        return reply.status(201).send({ created: true });
      },
    );
