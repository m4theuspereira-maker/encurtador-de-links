import { SHORT_URL_DOMAIN } from "../common/environment-consts";
import { InternalServerErrorExpection } from "../infra/errors/errors";
import { ShortUrlRepository } from "../infra/repositories/short-url-repository";
import { ShortUrl } from "../infra/repositories/types/types";

export class ShortUrlService {
  constructor(private readonly shortUrlRepository: ShortUrlRepository) {}

  async generateShortUrl(redirectUrl: string, userId?: string) {
    try {
      const shortId = this.generateShortId();

      const shortIdFound = await this.shortUrlRepository.find({ shortId });

      if (shortIdFound) {
        await this.generateShortUrl(redirectUrl, userId);
      }

      return (
        await this.shortUrlRepository.createShortUrl(
          `${SHORT_URL_DOMAIN}/${shortId}`,
          redirectUrl,
          userId || null
        )
      ).shortId;
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async find(shortUrl: ShortUrl) {
    try {
      return this.shortUrlRepository.find({ ...shortUrl });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async delete(id: string) {
    try {
      return this.shortUrlRepository.update(id, {
        deletedAt: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async updateRedirectUrl(id: string, redirectUrl: string) {
    try {
      return this.shortUrlRepository.update(id, {
        redirectUrl
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async findByUserId(userId: string) {
    try {
      return this.shortUrlRepository.findManyByUserId(userId);
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async incrementVisits(id: string, totalVisits: number) {
    try {
      totalVisits++;

      await this.shortUrlRepository.update(id, {
        totalVisits,
        lastVisit: new Date()
      });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  private generateShortId() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    return (
      ("000" + firstPart.toString(36)).slice(-3) +
      ("000" + secondPart.toString(36)).slice(-3)
    );
  }
}
