import { PrismaClient, shortUrl } from "@prisma/client";
import { InternalServerErrorExpection } from "../errors/errors";
import { ShortUrl } from "./types/types";

export class ShortUrlRepository {
  constructor(private readonly client: PrismaClient) {}

  async createShortUrl(
    shortId: string,
    redirectUrl: string,
    userId: string | null
  ) {
    try {
      return this.client.shortUrl.create({
        data: { shortId, redirectUrl, userId }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async find(shortUrl: ShortUrl) {
    try {
      return this.client.shortUrl.findFirst({
        where: { ...shortUrl, deletedAt: null }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async findManyByUserId(userId: string) {
    try {
      return this.client.shortUrl.findMany({
        where: {
          userId: {
            not: null,
            equals: userId
          },
          deletedAt: null
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async update(id: string, updatePayload: ShortUrl) {
    try {
      return this.client.shortUrl.update({
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
