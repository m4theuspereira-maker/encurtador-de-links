import { PrismaClient } from "@prisma/client";
import { InternalServerErrorExpection } from "../errors/errors";
import { User } from "./types/types";

export class UserRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(email: string, password: string) {
    try {
      return this.client.user.create({
        data: { email, password },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async find(user: User) {
    try {
      return this.client.user.findFirst({
        where: { ...user, deletedAt: null }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async update(
    id: string,
    updatePayload: { email?: string; password?: string }
  ) {
    try {
      return this.client.user.update({
        where: { id },
        data: {
          ...updatePayload,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }
}
