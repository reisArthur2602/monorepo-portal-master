import z from "zod";

export const createPatientBodySchema = z.object({
  name: z.string().min(2),
  cpf: z.string().min(11).max(14),
  birthDate: z.coerce.date(),
  phone: z.string().min(10).max(15),
});

export const createPatientResponseSchema = z.object({
  created: z.boolean().default(true),
});

export const listPatientsQueryParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
});

export const listPatientsResponseSchema = z.object({
  patients: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      cpf: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      createdAt: z.string(),
    }),
  ),
  meta: z.object({
    page: z.number(),
    perPage: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});
