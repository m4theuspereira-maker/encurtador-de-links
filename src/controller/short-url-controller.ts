import { Request, Response } from "express";
import { ShortUrlService } from "../services/short-url-service";
import { ok, serverError } from "./handlers/handlers";

export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  createShortUrl = async (req: Request, res: Response) => {
    try {
      const { userId, redirectUrl } = req.body;

      const result = this.shortUrlService.generateShortUrl(redirectUrl, userId);

      return ok(res, result);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
