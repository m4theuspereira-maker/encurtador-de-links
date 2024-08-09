import { InternalServerErrorExpection } from "../infra/errors/errors";
import { ShortUrlRepository } from "../infra/repositories/short-url-repository";

export class ShortUrlService {
  constructor(private readonly shortUrlRepository: ShortUrlRepository) {}

  async generateShortUrl(redirectUrl: string, userId?: string) {
    try {
      const shortId = this.generateShortId();

      const shortIdFound = await this.shortUrlRepository.find({ shortId });

      return !shortIdFound
        ? await this.shortUrlRepository.createShortUrl(
            shortId,
            redirectUrl,
            userId
          )
        : null;
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async delete(shortId: string) {
    try {
      const shortIdFound = await this.shortUrlRepository.find({ shortId });

      return shortIdFound
        ? this.shortUrlRepository.update(shortIdFound?.id!, {
            deletedAt: new Date()
          })
        : null;
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  async findByUserId(userId: string) {
    try {
      return this.shortUrlRepository.findMany({ userId });
    } catch (error) {
      throw new InternalServerErrorExpection(error);
    }
  }

  private generateShortId() {
    let firstPart = (Math.random() * 46656) | 0;
    let secondPart = (Math.random() * 46656) | 0;
    return `
      ${("000" + firstPart.toString(36)).slice(-3)}
      ${("000" + secondPart.toString(36)).slice(-3)}
    `;
  }
}
