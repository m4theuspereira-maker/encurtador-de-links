import { Encryption } from "../infra/encryotion/encryption";
import { InternalServerErrorExpection } from "../infra/errors/errors";
import { User } from "../infra/repositories/types/types";
import { UserRepository } from "../infra/repositories/user-repository";

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: Encryption
  ) {}

  async createUser(email: string, password: string) {
    try {
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
      const userFound = await this.find({ email });

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

      return { id: userFound.id, email, token };
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async find(user: User) {
    try {
      return this.userRepository.find(user);
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async resetPassword(email: string, oldPassword: string, newPassword: string) {
    try {
      const userFound = await this.find({ email });

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
        email,
        newPassword,
        userFound.id
      );

      const { id, createdAt, updatedAt } = userUpdated;

      return { id, createdAt, updatedAt, email, token };
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }
}
