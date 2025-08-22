import { Request, Response, NextFunction } from 'express';
import { issueChips } from '../services/hostService';

export async function issueChipsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { userId, amount } = req.body;
    const tx = await issueChips(userId, amount, req.user.sub);
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
}