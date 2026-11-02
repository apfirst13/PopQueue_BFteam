import { Router, Request, Response } from 'express';

export const seriesRouter = Router();

// Stub for GET /api/series (F-02, AC-09)
seriesRouter.get('/', (_req: Request, res: Response) => {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented', statusCode: 501 } });
});
