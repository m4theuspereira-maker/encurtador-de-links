import { resolve } from "path";
import { config } from "dotenv";
import swaggerDocs from "../config/swagger.json";

config({ path: resolve(__dirname, "../../.env") });

export const PORT = process.env.PORT;
export const APP_SECRET = process.env.APP_SECRET;
export const SWAGGER_DOCS = swaggerDocs;
