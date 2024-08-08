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
      const { password } = user;

      const passwordHashed = await this.encryptionService.hashPassword(
        password
      );
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }
}
