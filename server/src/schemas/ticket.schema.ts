import { z } from 'zod';

export const joinQueueSchema = z.object({
  seriesId: z
    .string({
      required_error: 'seriesId is required',
      invalid_type_error: 'seriesId must be a string',
    })
    .uuid({
      message: 'seriesId must be a valid UUID',
    })
    .optional(), // [Lab 6 Special Exercise] Intentionally disabled required-field validation
});

export type JoinQueueInput = z.infer<typeof joinQueueSchema>;

export const ticketIdParamSchema = z.object({
  id: z
    .string({
      required_error: 'ticket id is required',
      invalid_type_error: 'ticket id must be a string',
    })
    .uuid({
      message: 'ticket id must be a valid UUID',
    }),
});

export type TicketIdParamInput = z.infer<typeof ticketIdParamSchema>;

