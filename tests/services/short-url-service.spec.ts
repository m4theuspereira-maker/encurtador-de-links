import {
  describe,
  it,
  expect,
  beforeAll,
  vi,
  SpyInstance,
  beforeEach
} from "vitest";
import { ShortUrlService } from "../../src/services/short-url-service";
import { ShortUrlRepository } from "../../src/infra/repositories/short-url-repository";
import { client } from "../../src/config/client/client";

describe("ShortUrlService", () => {
  let shortUrlService: ShortUrlService;
  let shortUrlRepository: ShortUrlRepository;
  let findFirstClientSpy: SpyInstance;
  const mockUrl = "https://mockurl.com.br";
  const mockId = "eef4f8b2-3280-4f09-a8a8-13beacd29770";
  beforeEach(() => {
    vi.setSystemTime(new Date());
  });
  beforeAll(() => {
    vi.spyOn(client.shortUrl, "create").mockResolvedValueOnce(null as any);
    findFirstClientSpy = vi.spyOn(client.shortUrl, "findFirst");
    shortUrlRepository = new ShortUrlRepository(client);
    shortUrlService = new ShortUrlService(shortUrlRepository);
  });
  describe("createShortUrl", () => {
    it("should create a short url", async () => {
      vi.spyOn(shortUrlRepository, "createShortUrl").mockResolvedValueOnce({
        shortId: "urlshorted"
      } as any);
      const generateShortIdSpy = vi
        .spyOn(shortUrlService, "generateShortId")
        .mockReturnValueOnce("225e6w");
      vi.spyOn(shortUrlService, "find").mockResolvedValueOnce(null);

      const repositorySpy = vi.spyOn(shortUrlRepository, "createShortUrl");

      await shortUrlService.generateShortUrl(mockUrl);

      expect(generateShortIdSpy).toHaveBeenCalledOnce();
      expect(repositorySpy).toHaveBeenCalledWith(
        "http://localhost:${PORT}/225e6w",
        mockUrl,
        null
      );
    });

    it("should call generate shortId twice if shortId is already in database", async () => {
      vi.spyOn(shortUrlRepository, "createShortUrl")
        .mockResolvedValueOnce({
          shortId: "urlshorted"
        } as any)
        .mockResolvedValueOnce({
          shortId: "urlshorted"
        } as any);
      const generateShortIdSpy = vi
        .spyOn(shortUrlService, "generateShortId")
        .mockReturnValueOnce("225e6w");
      vi.spyOn(shortUrlRepository, "find")
        .mockResolvedValueOnce(true as any)
        .mockResolvedValueOnce(null);

      await shortUrlService.generateShortUrl(mockUrl);

      expect(generateShortIdSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("incrementVisits", () => {
    it("should call incrementVisits with totalVisits number incremented", () => {
      const totalvisits = 2;
      const incrementVisitsSpy = vi
        .spyOn(shortUrlRepository, "update")
        .mockResolvedValueOnce(null as any);

      shortUrlService.incrementVisits(mockId, totalvisits);

      expect(incrementVisitsSpy).toHaveBeenCalledWith(mockId, {
        lastVisit: new Date(),
        totalVisits: totalvisits + 1
      });
    });
  });

  describe("generateShortId", () => {
    it("should always return a string with exactly 6 characters, all alphanumeric", () => {
      const regexPattern = /^[0-9a-z]{6}$/;
      for (let i = 0; i < 1000; i++) {
        const id = shortUrlService.generateShortId();
        expect(id).toMatch(regexPattern);
      }
    });
  });
});
