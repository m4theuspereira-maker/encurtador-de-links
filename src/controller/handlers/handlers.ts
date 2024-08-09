import { Response } from "express";

export const serverError = (res: Response, error: any): Response => {
  return res.status(500).json({ body: error.message });
};

export const ok = (res: Response, data?: any): Response => {
  if (Array.isArray(data)) {
    return res.status(200).json({ body: { count: data.length, data } });
  }

  if (!data) {
    return res.status(200);
  }

  return res.status(200).json({ data });
};
export const notFoundError = (res: Response, message: string): Response => {
  return res.status(404).json({ error: message });
};

export const unpaidError = (res: Response, message: any): Response => {
  return res.status(402).json(message);
};

export const unauthorizedError = (res: Response, message: any): Response => {
  return res.status(401).json({ error: message });
};

export const invalidLogin = (res: Response, message: any): Response => {
  return res.status(403).json({ error: message });
};

export const conflictError = (res: Response, message: any): Response => {
  return res.status(409).json({ error: message });
};

export const redirect = (res: Response, url: string): void => {
  res.redirect(301, url);
};
