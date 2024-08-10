import { Router } from "express";
import {
  shortUrlControllerFactory,
  userControllerFactory
} from "./factories/controller-factories";
import { ValidationMiddlewares } from "./middlewares/validation-middlewares";
import { authenticationMiddlewaresFactory } from "./factories/middlewares-factory";

const routes = Router();
const userController = userControllerFactory();
const shortUrlController = shortUrlControllerFactory();
const authentication = authenticationMiddlewaresFactory();

routes.post(
  "/user/create",
  ValidationMiddlewares.createUser,
  userController.createUser
);
routes.post("/user/login", ValidationMiddlewares.login, userController.login);
routes.patch(
  "/user/reset",
  ValidationMiddlewares.resetPassword,
  userController.resetPassword
);

routes.get(
  "/shortUrl/",
  ValidationMiddlewares.validateTokenPattern,
  authentication.requireAuthentication,
  shortUrlController.getShortUrls
);
routes.post(
  "/shortUrl/create",
  ValidationMiddlewares.validateRedirectUrl,
  authentication.optionalAuthentication,
  shortUrlController.createShortUrl
);
routes.delete(
  "/shortUrl/delete/:shortUrlId",
  ValidationMiddlewares.validateTokenPattern,
  authentication.requireAuthentication,
  shortUrlController.deleteShortUrl
);
routes.patch(
  "/shortUrl/update/:shortUrlId",
  ValidationMiddlewares.validateShortId,
  ValidationMiddlewares.validateRedirectUrl,
  ValidationMiddlewares.validateTokenPattern,
  authentication.requireAuthentication,
  shortUrlController.updateRedirectUrl
);

routes.get(
  "/:shortId",
  ValidationMiddlewares.validateShortIdVisit,
  shortUrlController.visitShortUrl
);
export { routes };
