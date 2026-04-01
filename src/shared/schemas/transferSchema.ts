import { z } from 'zod/v4'

export const transferSchema = z.object({
  category: z.string().min(1, 'Selecione uma categoria'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Valor obrigatório'),
})

export type TransferFormData = z.infer<typeof transferSchema>
