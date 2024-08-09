import { UserService } from "../services/user-service";
import { Request, Response } from "express";
import { ok, serverError } from "./handlers/handlers";
export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const userCreated = await this.userService.createUser({
        email,
        password
      });

      return ok(res, userCreated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      const userLogged = await this.userService.login(username, password);

      return ok(res, userLogged);
    } catch (error) {
      return serverError(res, error);
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { username, old_password, new_password } = req.body;

      const userLogged = await this.userService.resetPassword(
        username,
        old_password,
        new_password
      );

      return ok(res, userLogged);
    } catch (error) {
      return serverError(res, error);
    }
  };
}
