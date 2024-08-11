import { beforeAll, describe, expect, it, vi } from "vitest";
import { UserService } from "../../src/services/user-service";
import { Encryption } from "../../src/infra/encryotion/encryption";
import { UserRepository } from "../../src/infra/repositories/user-repository";
import { client } from "../../src/config/client/client";
import { hashSync } from "bcrypt";

describe("UserService", () => {
  let userService: UserService;
  let encryptionService: Encryption;
  let repository: UserRepository;
  const mockUser = {
    id: "13632fe2-553b-4a4a-8663-567f9dd38549",
    email: "usuarionovo@gmail.com",
    createdAt: new Date(),
    updatedAt: null
  };
  const mockUserFound = {
    id: "13632fe2-553b-4a4a-8663-567f9dd38549",
    email: "usuarionovo@gmail.com",
    password: "$2b$08$x5kD8cRYeJQkd8D4snDfBeU6ooX.ElN/1OW.63rOrgMCGJ44Pe7gu",
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  };
  beforeAll(() => {
    repository = new UserRepository(client);
    encryptionService = new Encryption();
    userService = new UserService(repository, encryptionService);
  });
  describe("create user", () => {
    it("should hash the password and call create user", async () => {
      const hashSpy = vi
        .spyOn(encryptionService, "hashPassword")
        .mockResolvedValueOnce("hashed_password");
      const createUserSpy = vi
        .spyOn(repository, "create")
        .mockResolvedValueOnce(mockUser);
      await userService.createUser(mockUser.email, "senhalonga");

      expect(hashSpy).toHaveBeenLastCalledWith("senhalonga");
      expect(createUserSpy).toHaveBeenCalledWith(
        mockUser.email,
        "hashed_password"
      );
    });
  });

  describe("login", () => {
    it("should return null of user email was not found", async () => {
      vi.spyOn(userService, "find").mockResolvedValueOnce(null);

      const result = await userService.login(mockUser.email, "passwordlong");
      expect(result).toBeNull();
    });

    it("should return null if password was not valid", async () => {
      vi.spyOn(userService, "find").mockResolvedValueOnce(mockUserFound);
      vi.spyOn(encryptionService, "validatePassword").mockResolvedValueOnce(
        false
      );

      const result = await userService.login(mockUser.email, "passwordlong");
      expect(result).toBeNull();
    });

    it("should return user logged if user was found and password was valid", async () => {
      vi.spyOn(userService, "find").mockResolvedValueOnce(mockUserFound);
      vi.spyOn(encryptionService, "validatePassword").mockResolvedValueOnce(
        true
      );

      vi.spyOn(encryptionService, "encryptToken").mockReturnValueOnce(
        "tokenMocked"
      );

      const result = await userService.login(mockUser.email, "passwordlong");
      expect(result).toStrictEqual({
        id: "13632fe2-553b-4a4a-8663-567f9dd38549",
        email: "usuarionovo@gmail.com",
        token: "tokenMocked"
      });
    });
  });
});
