import { UserService } from "../services/user-service";
import { Request, Response } from "express";
import {
  conflictError,
  ok,
  serverError,
  unauthorizedError
} from "./handlers/handlers";
export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const userFound = await this.userService.find({ email });

      if (userFound) {
        return conflictError(
          res,
          `There is already registrated an user with email: ${email}`
        );
      }

      const userCreated = await this.userService.createUser(email, password);

      return ok(res, userCreated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const userLogged = await this.userService.login(email, password);

      if (!userLogged) {
        return unauthorizedError(res, "email or password is invalid");
      }

      return ok(res, userLogged);
    } catch (error) {
      return serverError(res, error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, oldPassword, newPassword } = req.body;

      const userReseted = await this.userService.resetPassword(
        email,
        oldPassword,
        newPassword
      );

      if (!userReseted) {
        return unauthorizedError(
          res,
          "The old password or email does not match with what is in our database"
        );
      }

      return ok(res, userReseted);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
