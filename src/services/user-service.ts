import { Encryption } from "../infra/encryotion/encryption";
import { InternalServerErrorExpection } from "../infra/errors/errors";
import { UserRepository } from "../infra/repositories/user-repository";
import { CreateUser } from "./types/types";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: Encryption
  ) {}

  async createUser(user: CreateUser) {
    try {
      const { email, password } = user;

      const passwordHashed = await this.encryptionService.hashPassword(
        password
      );

      return this.userRepository.create(email, passwordHashed);
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async login(email: string, password: string) {
    try {
      const userFound = await this.userRepository.find({ email });

      if (!userFound) {
        return null;
      }

      const validPaswordHashed = await this.encryptionService.validatePassword(
        password,
        userFound.password
      );

      if (!validPaswordHashed) {
        return null;
      }

      const token = this.encryptionService.encryptToken(
        email,
        password,
        userFound.id
      );

      return { email, password: userFound.password, token };
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async resetPassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ) {
    try {
      const userFound = await this.userRepository.find({ username });

      if (!userFound) {
        return null;
      }

      const validPasword = await this.encryptionService.validatePassword(
        oldPassword,
        userFound.password!
      );

      if (!validPasword) {
        return null;
      }

      const newPasswordHashed = await this.encryptionService.hashPassword(
        newPassword
      );

      const userUpdated = await this.userRepository.update(userFound.id!, {
        password: newPasswordHashed
      });

      if (!userUpdated) {
        return null;
      }

      const token = this.encryptionService.encryptToken(
        username,
        newPassword,
        userFound.id
      );

      return { ...userUpdated, token };
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }
}
