import { Router } from "express";
import { userControllerFactory } from "./factories/controller-factories";
import { ValidationMiddlewares } from "./middlewares/validation-middlewares";

const routes = Router();
const userController = userControllerFactory();

routes.post(
  "/user/create",
  ValidationMiddlewares.createUser,
  userController.createUser
);
routes.post("/user/login", ValidationMiddlewares.login, userController.login);
routes.put(
  "/user/reset",
  ValidationMiddlewares.resetPassword,
  userController.resetPassword
);
export { routes };
