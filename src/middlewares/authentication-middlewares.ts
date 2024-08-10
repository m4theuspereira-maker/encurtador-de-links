import { Request, Response, NextFunction } from "express";
import { Encryption } from "../infra/encryotion/encryption";
import { unauthorizedError } from "../controller/handlers/handlers";

export class AuthenticationMiddlewares {
  constructor(private readonly encryptionService: Encryption) {}

  requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      const { email, id } = this.encryptionService.verifyEncryptedToken(
        String(authorization)
      );
      req.headers = { email, id };
      next();
    } catch (error) {
      return unauthorizedError(res, "invalid token has been provided");
    }
  };

  optionalAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authorization } = req.headers;

      if (authorization) {
        const { email, id } = this.encryptionService.verifyEncryptedToken(
          String(authorization)
        );
        req.headers = { email, id };
      }
      next();
    } catch (error) {
      return unauthorizedError(res, "invalid token has been provided");
    }
  };
}
