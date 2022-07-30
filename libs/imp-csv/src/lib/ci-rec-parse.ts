import { z } from 'zod'

export const CiRec = z
  .object({
    level: z
      .string()
      .regex(/\d+/)
      .transform(Number)
      .refine((n) => n >= 1),
    h_name: z
      .string()
      .min(1, { message: 'Cannot be empty' })
      .transform((v) => v.slice(-10)),
    type: z.string().min(1, { message: 'Cannot be empty' }),
    subtype: z.string().transform((v) => v || null),
    hpc_status: z.string().min(1, { message: 'Cannot be empty' }),
    environment: z.string().transform((v) => v || null),
    name: z.string().min(1, { message: 'Cannot be empty' }),
    ip_address_list: z.string().transform((v) => v || null),
    name2: z.string().transform((v) => v || null),
    j_cpu_proc_count: z.string().transform((v) => v || null),
    j_cpu_count: z.string().transform((v) => v || null),
    j_ram: z.string().transform((v) => v || null),
    j_hdd: z.string().transform((v) => v || null),
    j_ssd: z.string().transform((v) => v || null),
    tps_placement: z.string().transform((v) => v || null),
    full_path: z.string().min(1, { message: 'Cannot be empty' }),
  })
  .strict()

export type CiRecType = z.infer<typeof CiRec>

export const ciRecParse = (r: unknown) => CiRec.parse(r)
