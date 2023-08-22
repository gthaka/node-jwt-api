import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
}
