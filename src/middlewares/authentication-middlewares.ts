import { Request, Response, NextFunction } from "express";
import { Encryption } from "../infra/encryotion/encryption";
import { unauthorizedError } from "../controller/handlers/handlers";

export class AuthenticationMiddlewares {
  constructor(private readonly encryptionService: Encryption) {}

  requireAuthentication = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers as any;

      this.encryptionService.verifyEncryptedToken(authorization);
      next();
    } catch (error) {
      return unauthorizedError(res, "invalid token has been provided");
    }
  };
}
