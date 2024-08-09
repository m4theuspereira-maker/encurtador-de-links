import { PrismaClient } from "@prisma/client";
import { InternalServerErrorExpection } from "../errors/errors";
import { v4 as uuidv4 } from "uuid";

export class UserRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(email: string, password: string) {
    try {
      return this.client.user.create({
        data: { id: uuidv4(), email, password }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async findById(id: string) {
    try {
      return this.client.user.findFirst({
        where: { id, deletedAt: null },
        select: {
          id: true,
          email: true,
          password: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async countByEmail(email: string) {
    try {
      return this.client.user.count({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async find(input: any) {
    try {
      return this.client.user.findFirst({
        where: { ...input, deletedAt: null }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async update(id: string, updatePayload: any) {
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
