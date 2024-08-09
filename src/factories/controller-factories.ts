import { client } from "../config/client/client";
import { UserController } from "../controller/user-controller";
import { Encryption } from "../infra/encryotion/encryption";
import { UserRepository } from "../infra/repositories/user-repository";
import { UserService } from "../services/user-service";

export function userControllerFactory(): UserController {
  return new UserController(
    new UserService(new UserRepository(client), new Encryption())
  );
}
