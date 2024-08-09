import { Router } from "express";
import {
  controllerFactory,
  userControllerFactory
} from "./factories/controller-factories";

const routes = Router();
const userController = userControllerFactory();

routes.get("/user/create", userController.createUser);
routes.post("/user/login", userController.login);
routes.put("/user/reset", userController.resetPassword);
export { routes };
