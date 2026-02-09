import { FastifyInstance } from "fastify";
import { createPatient } from "./create-patient";
import { listPatients } from "./list-patients";

export const patientRoutes = (app: FastifyInstance) => {
  app.register(createPatient);
  app.register(listPatients);
};
