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

export const staffTicketParamsSchema = z.object({
  id: z
    .string({
      required_error: 'ticket id is required',
      invalid_type_error: 'ticket id must be a string',
    })
    .uuid({
      message: 'ticket id must be a valid UUID',
    }),
});

export type StaffTicketParamsInput = z.infer<typeof staffTicketParamsSchema>;

export const staffSeriesParamsSchema = z.object({
  id: z
    .string({
      required_error: 'series id is required',
      invalid_type_error: 'series id must be a string',
    })
    .uuid({
      message: 'series id must be a valid UUID',
    }),
});

export type StaffSeriesParamsInput = z.infer<typeof staffSeriesParamsSchema>;

export const updateSeriesStatusSchema = z.object({
  isActive: z.boolean({
    required_error: 'isActive is required',
    invalid_type_error: 'isActive must be a boolean',
  }),
});

export type UpdateSeriesStatusInput = z.infer<typeof updateSeriesStatusSchema>;
