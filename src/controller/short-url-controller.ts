import { Request, Response } from "express";
import { ShortUrlService } from "../services/short-url-service";
import {
  conflictError,
  notFoundError,
  ok,
  redirect,
  serverError
} from "./handlers/handlers";
import { SHORT_URL_DOMAIN } from "../common/environment-consts";

export class ShortUrlController {
  constructor(private readonly shortUrlService: ShortUrlService) {}

  createShortUrl = async (req: Request, res: Response) => {
    try {
      const { redirectUrl } = req.body;
      const userId = (req.headers.id as string) ?? undefined;

      const redirectUrlFound = await this.shortUrlService.find({
        redirectUrl,
        userId
      });

      if (redirectUrlFound) {
        return ok(res, redirectUrlFound.shortId);
      }

      const result = await this.shortUrlService.generateShortUrl(
        redirectUrl,
        userId
      );

      return ok(res, result);
    } catch (error) {
      return serverError(res, error);
    }
  };

  getShortUrls = async (req: Request, res: Response) => {
    try {
      const { id } = req.headers;

      const result = await this.shortUrlService.findByUserId(String(id));

      return ok(res, result);
    } catch (error) {
      return serverError(res, error);
    }
  };

  deleteShortUrl = async (req: Request, res: Response) => {
    try {
      const { shortUrlId } = req.params;
      const { id } = req.headers;

      const redirectUrlFound = await this.shortUrlService.find({
        id: shortUrlId,
        userId: String(id)
      });

      if (!redirectUrlFound) {
        return notFoundError(
          res,
          "Short url not found or does not belong to this logged user."
        );
      }

      await this.shortUrlService.delete(shortUrlId);

      return ok(res, "Short URL deleted succesfully!");
    } catch (error) {
      return serverError(res, error);
    }
  };

  updateRedirectUrl = async (req: Request, res: Response) => {
    try {
      const { shortUrlId } = req.params;
      const { redirectUrl } = req.body;
      const { id } = req.headers;

      const redirectUrlFound = await this.shortUrlService.find({
        id: shortUrlId,
        userId: String(id)
      });

      if (!redirectUrlFound) {
        return notFoundError(
          res,
          "Short url not found or does not belong to this logged user."
        );
      }

      const result = await this.shortUrlService.updateRedirectUrl(
        shortUrlId,
        redirectUrl
      );

      return ok(res, result);
    } catch (error) {
      return serverError(res, error);
    }
  };

  visitShortUrl = async (req: Request, res: Response) => {
    try {
      const { shortId } = req.params;

      const redirectUrlFound = await this.shortUrlService.find({
        shortId: `${SHORT_URL_DOMAIN}/${shortId}`
      });

      if (!redirectUrlFound) {
        return notFoundError(res, "URL not found");
      }

      await this.shortUrlService.incrementVisits(
        redirectUrlFound.id,
        redirectUrlFound.totalVisits
      );

      return redirect(res, redirectUrlFound.redirectUrl);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
