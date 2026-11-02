import { z } from 'zod';

export const callNextSchema = z.object({
  seriesId: z
    .string({
      required_error: 'seriesId is required',
      invalid_type_error: 'seriesId must be a string',
    })
    .uuid({
      message: 'seriesId must be a valid UUID',
    }),
});

export type CallNextInput = z.infer<typeof callNextSchema>;
