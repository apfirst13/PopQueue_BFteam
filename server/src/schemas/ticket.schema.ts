import { z } from 'zod';

export const joinQueueSchema = z.object({
  seriesId: z
    .string({
      required_error: 'seriesId is required',
      invalid_type_error: 'seriesId must be a string',
    })
    .uuid({
      message: 'seriesId must be a valid UUID',
    }),
});

export type JoinQueueInput = z.infer<typeof joinQueueSchema>;
