import { resolve } from "path";
import { config } from "dotenv";
import swaggerDocs from "../config/swagger.json";

config({ path: resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT;
export const APP_SECRET = process.env.APP_SECRET;
export const SWAGGER_DOCS = swaggerDocs;
export const SHORT_URL_DOMAIN = process.env.SHORT_URL_DOMAIN;
export const NODE_ENV = process.env.NODE_ENV;
