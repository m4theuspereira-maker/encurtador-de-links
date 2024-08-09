import { PrismaClient } from "@prisma/client";
import { InternalServerErrorExpection } from "../errors/errors";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(email: string, password: string) {
    try {
      return this.client.user.create({
        data: { id: uuidv4(), email, password },
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

  async find(email: string) {
    try {
      return this.client.user.findFirst({
        where: { email, deletedAt: null }
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
