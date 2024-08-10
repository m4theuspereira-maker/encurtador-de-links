import { client } from "../config/client/client";
import { ShortUrlController } from "../controller/short-url-controller";
import { UserController } from "../controller/user-controller";
import { Encryption } from "../infra/encryotion/encryption";
import { ShortUrlRepository } from "../infra/repositories/short-url-repository";
import { UserRepository } from "../infra/repositories/user-repository";
import { ShortUrlService } from "../services/short-url-service";
import { UserService } from "../services/user-service";

export function userControllerFactory(): UserController {
  return new UserController(
    new UserService(new UserRepository(client), new Encryption())
  );
}

export function shortUrlControllerFactory(): ShortUrlController {
  return new ShortUrlController(
    new ShortUrlService(new ShortUrlRepository(client))
  );
}
