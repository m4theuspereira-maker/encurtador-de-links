import { Encryption } from "../infra/encryotion/encryption";
import { AuthenticationMiddlewares } from "../middlewares/authentication-middlewares";

export function authenticationMiddlewaresFactory(): AuthenticationMiddlewares {
  return new AuthenticationMiddlewares(new Encryption());
}
