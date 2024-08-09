import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { InternalServerErrorExpection } from "../errors/errors";
import { APP_SECRET } from "../../common/environment-consts";

interface IDecryptedTokenData {
  email: string;
  id: string;
}

export class Encryption {
  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 8);
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async validatePassword(
    password: string,
    userSavedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, userSavedPassword);
  }

  encryptToken(email: string, password: string, id: string): string {
    return jwt.sign({ email, password, id }, APP_SECRET as string, {
      expiresIn: "1d"
    });
  }

  verifyEncryptedToken(authorization: string): IDecryptedTokenData {
    const [, token] = authorization.split(" ");

    const { email, id } = jwt.verify(
      token,
      APP_SECRET as string
    ) as IDecryptedTokenData;

    return { email, id };
  }
}
