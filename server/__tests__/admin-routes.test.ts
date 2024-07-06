import fastify, { FastifyInstance, HTTPMethods, InjectOptions } from "fastify";
import * as adminAuth from "../src/admin-auth";
import * as adminRoutes from "../src/admin-routes";
import * as database from "../src/database";
import * as verify from "../src/verify";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import * as fileMetadataHandler from "../src/file-metadata-handler";

import { afterAll, beforeAll, describe, test, it, vi, expect, beforeEach } from "vitest";
import fastifySecureSession from "@fastify/secure-session";
import { resolve } from "path";

vi.mock("../src/util", async () => {
  return {
    loadAssetConfigs: vi.fn().mockResolvedValue({}),
    assetconfigs: {
      uploadDirectory: "testdir/uploadDirectory",
      fileMetadata: "testdir/fileMetadata.json"
    },
    adminconfig: {}
  };
});

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof fs>();
  return {
    ...actual,
    realpathSync: vi.fn().mockImplementation((path) => path)
  };
});

vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof fsPromises>();
  return {
    ...actual,
    rm: vi.fn().mockResolvedValue({}),
    writeFile: vi.fn().mockResolvedValue({})
  };
});

vi.mock("bcrypt-ts", async () => {
  return {
    hash: vi.fn().mockResolvedValue("hashedPassword")
  };
});

vi.mock("node:crypto", async () => {
  return {
    randomUUID: vi.fn(() => "random-uuid")
  };
});

vi.mock("../src/verify", async () => {
  return {
    checkRecaptchaToken: vi.fn().mockResolvedValue(1)
  };
});

vi.mock("../src/index", async () => {
  return {
    datapackIndex: vi.fn().mockResolvedValue({}),
    mapPackIndex: vi.fn().mockResolvedValue({})
  };
});

vi.mock("../src/database", async (importOriginal) => {
  const actual = await importOriginal<typeof database>();
  return {
    ...actual,
    findUser: vi.fn(() => Promise.resolve([testAdminUser])), // just so we can verify the user is an admin for prehandlers
    checkForUsersWithUsernameOrEmail: vi.fn().mockResolvedValue([]),
    createUser: vi.fn().mockResolvedValue({}),
    deleteUser: vi.fn().mockResolvedValue({})
  };
});

vi.mock("../src/admin-routes", async (importOriginal) => {
  const actual = await importOriginal<typeof adminRoutes>();
  return {
    ...actual
  };
});

vi.mock("../src/load-packs", async () => {
  return {
    loadIndexes: vi.fn().mockResolvedValue({})
  };
});

vi.mock("../src/file-metadata-handler", async () => {
  return {
    loadFileMetadata: vi.fn().mockResolvedValue({}),
    deleteDatapack: vi.fn().mockResolvedValue({})
  };
});

let app: FastifyInstance;
beforeAll(async () => {
  app = fastify();
  await app.register(fastifySecureSession, {
    cookieName: "adminSession",
    key: Buffer.from("c30a7eae1e37a08d6d5c65ac91dfbc75b54ce34dd29153439979364046cc06ae", "hex"),
    cookie: {
      path: "/",
      httpOnly: true,
      domain: "localhostadmin",
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  });
  app.addHook("onRequest", async (request, _reply) => {
    request.session = {
      ...request.session,
      get: (key: string) => {
        if (key === "uuid") {
          return request.headers["mock-uuid"];
        }
        return null;
      }
    };
  });
  await app.register(adminAuth.adminRoutes, { prefix: "/admin" });
  await app.listen({ host: "localhost", port: 1239 });
});

afterAll(async () => {
  await app.close();
});

const testAdminUser = {
  userId: 123,
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  emailVerified: 1,
  invalidateSession: 0,
  username: "testuser",
  hashedPassword: "password123",
  pictureUrl: "https://example.com/picture.jpg",
  isAdmin: 1
};
const testNonAdminUser = {
  ...testAdminUser,
  isAdmin: 0
};

const routes: { method: HTTPMethods; url: string; body?: object }[] = [
  { method: "GET", url: "/admin/users" },
  {
    method: "POST",
    url: "/admin/user",
    body: { username: "test", email: "test", password: "test", pictureUrl: "test", isAdmin: 1 }
  },
  { method: "DELETE", url: "/admin/user", body: { uuid: "test" } },
  { method: "DELETE", url: "/admin/user/datapack", body: { uuid: "test", datapack: "test" } },
  { method: "DELETE", url: "/admin/server/datapack", body: { datapack: "test" } },
  { method: "POST", url: "/admin/server/datapack", body: { datapack: "test" } }
];
const headers = { "mock-uuid": "uuid", "recaptcha-token": "recaptcha-token" };
describe("verifyAdmin tests", () => {
  describe.each(routes)("should return 401 for route $url with method $method", ({ method, url, body }) => {
    const findUser = vi.spyOn(database, "findUser");
    beforeEach(() => {
      findUser.mockClear();
    });
    test("should return 401 if not logged in", async () => {
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body
      });
      expect(findUser).not.toHaveBeenCalled();
      expect(await response.json()).toEqual({ error: "Unauthorized access" });
      expect(response.statusCode).toBe(401);
    });
    test("should return 401 if not found in database", async () => {
      findUser.mockResolvedValueOnce([]);
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body,
        headers
      });
      expect(findUser).toHaveBeenCalledWith({ uuid: headers["mock-uuid"] });
      expect(findUser).toHaveBeenCalledTimes(1);
      expect(await response.json()).toEqual({ error: "Unauthorized access" });
      expect(response.statusCode).toBe(401);
    });
    test("should return 401 if not admin", async () => {
      findUser.mockResolvedValueOnce([testNonAdminUser]);
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body,
        headers
      });
      expect(findUser).toHaveBeenCalledWith({ uuid: headers["mock-uuid"] });
      expect(findUser).toHaveBeenCalledTimes(1);
      expect(await response.json()).toEqual({ error: "Unauthorized access" });
      expect(response.statusCode).toBe(401);
    });
    test("should return 500 if findUser throws error", async () => {
      findUser.mockRejectedValueOnce(new Error());
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body,
        headers
      });
      expect(findUser).toHaveBeenCalledWith({ uuid: headers["mock-uuid"] });
      expect(findUser).toHaveBeenCalledTimes(1);
      expect(await response.json()).toEqual({ error: "Database error" });
      expect(response.statusCode).toBe(500);
    });
  });
});

describe("verifyRecaptcha tests", () => {
  describe.each(routes)("should return 400 or 422 for route $url with method $method", ({ method, url, body }) => {
    const checkRecaptchaToken = vi.spyOn(verify, "checkRecaptchaToken");
    beforeEach(() => {
      checkRecaptchaToken.mockClear();
    });
    it("should return 400 if missing recaptcha token", async () => {
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body,
        headers: { ...headers, "recaptcha-token": "" }
      });
      expect(checkRecaptchaToken).not.toHaveBeenCalled();
      expect(await response.json()).toEqual({ error: "Missing recaptcha token" });
      expect(response.statusCode).toBe(400);
    });
    it("should return 422 if recaptcha failed", async () => {
      checkRecaptchaToken.mockResolvedValueOnce(0);
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body,
        headers: headers
      });
      expect(checkRecaptchaToken).toHaveBeenCalledWith(headers["recaptcha-token"]);
      expect(checkRecaptchaToken).toHaveBeenCalledTimes(1);
      expect(await response.json()).toEqual({ error: "Recaptcha failed" });
      expect(response.statusCode).toBe(422);
    });
    it("should return 500 if checkRecaptchaToken throws error", async () => {
      checkRecaptchaToken.mockRejectedValueOnce(new Error());
      const response = await app.inject({
        method: method as InjectOptions["method"],
        url: url,
        payload: body,
        headers: headers
      });
      expect(checkRecaptchaToken).toHaveBeenCalledWith(headers["recaptcha-token"]);
      expect(checkRecaptchaToken).toHaveBeenCalledTimes(1);
      expect(await response.json()).toEqual({ error: "Recaptcha error" });
      expect(response.statusCode).toBe(500);
    });
  });
});

describe("adminCreateUser tests", () => {
  const body = {
    username: "username",
    email: "email@email.com",
    password: "password",
    pictureUrl: "pictureUrl",
    isAdmin: 1
  };
  const customUser = {
    username: body.username,
    email: body.email,
    pictureUrl: body.pictureUrl,
    isAdmin: body.isAdmin,
    hashedPassword: "hashedPassword",
    uuid: "random-uuid",
    emailVerified: 1,
    invalidateSession: 0
  };
  const checkForUsersWithUsernameOrEmail = vi.spyOn(database, "checkForUsersWithUsernameOrEmail");
  const createUser = vi.spyOn(database, "createUser");
  const findUser = vi.spyOn(database, "findUser");
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test.each([
    { ...body, email: "" },
    { ...body, username: "" },
    { ...body, password: "" },
    { ...body, email: "hi@gmailcom" },
    { ...body, email: "higmail.com" }
  ])("should return 400 for body %p", async (body) => {
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "Missing/invalid required fields" });
    expect(response.statusCode).toBe(400);
  });

  it("should return 409 if user already exists", async () => {
    checkForUsersWithUsernameOrEmail.mockResolvedValueOnce([testAdminUser]);
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledWith(body.username, body.email);
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(createUser).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "User already exists" });
    expect(response.statusCode).toBe(409);
  });

  it("should return 500 if checkForUsersWithUsernameOrEmail throws error", async () => {
    checkForUsersWithUsernameOrEmail.mockRejectedValueOnce(new Error());
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledWith(body.username, body.email);
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(createUser).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "Database error" });
    expect(response.statusCode).toBe(500);
  });

  it("should return 500 if createUser throws error", async () => {
    createUser.mockRejectedValueOnce(new Error());
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledWith(body.username, body.email);
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith(customUser);
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual({ error: "Database error" });
    expect(response.statusCode).toBe(500);
  });
  it("should return 500 if findUser throws error", async () => {
    // twice for prehandler
    findUser.mockResolvedValueOnce([testAdminUser]).mockRejectedValueOnce(new Error());
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledWith(body.username, body.email);
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith(customUser);
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(findUser).toHaveBeenNthCalledWith(1, { uuid: headers["mock-uuid"] });
    expect(findUser).toHaveBeenNthCalledWith(2, { username: body.username });
    expect(findUser).toHaveBeenCalledTimes(2);
    expect(await response.json()).toEqual({ error: "Database error" });
    expect(response.statusCode).toBe(500);
  });
  it("should return 500 if findUser doesn't return exactly 1 user", async () => {
    findUser.mockResolvedValueOnce([testAdminUser]).mockResolvedValueOnce([]);
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledWith(body.username, body.email);
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith(customUser);
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(findUser).toHaveBeenNthCalledWith(1, { uuid: headers["mock-uuid"] });
    expect(findUser).toHaveBeenNthCalledWith(2, { username: body.username });
    expect(findUser).toHaveBeenCalledTimes(2);
    expect(await response.json()).toEqual({ error: "Database error" });
    expect(response.statusCode).toBe(500);
  });

  it("should return 200 if successful", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledWith(body.username, body.email);
    expect(checkForUsersWithUsernameOrEmail).toHaveBeenCalledTimes(1);
    expect(createUser).toHaveBeenCalledWith(customUser);
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(findUser).toHaveBeenNthCalledWith(1, { uuid: headers["mock-uuid"] });
    expect(findUser).toHaveBeenNthCalledWith(2, { username: body.username });
    expect(findUser).toHaveBeenCalledTimes(2);
    expect(await response.json()).toEqual({ message: "User created" });
    expect(response.statusCode).toBe(200);
  });
});

describe("adminDeleteUser tests", () => {
  const findUser = vi.spyOn(database, "findUser");
  const deleteUser = vi.spyOn(database, "deleteUser");
  const realpathSync = vi.spyOn(fs, "realpathSync");
  const loadFileMetadata = vi.spyOn(fileMetadataHandler, "loadFileMetadata");
  const writeFile = vi.spyOn(fsPromises, "writeFile");
  const rm = vi.spyOn(fsPromises, "rm");
  const body = { uuid: "test" };
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should return 400 if missing uuid", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: {},
      headers
    });
    expect(await response.json()).toEqual({
      code: "FST_ERR_VALIDATION",
      error: "Bad Request",
      message: "body must have required property 'uuid'",
      statusCode: 400
    });
    expect(response.statusCode).toBe(400);
  });
  it("should return 400 if uuid is blank", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: { uuid: "" },
      headers
    });
    expect(await response.json()).toEqual({ error: "Missing uuid" });
    expect(response.statusCode).toBe(400);
  });
  it("should return 403 if uuid attempts a directory traversal", async () => {
    realpathSync.mockReturnValueOnce("root");
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: { uuid: "../" },
      headers
    });
    expect(findUser).toHaveBeenCalledTimes(1);
    expect(deleteUser).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "Directory traversal detected" });
    expect(response.statusCode).toBe(403);
  });
  it("should return 404 if user not found", async () => {
    findUser.mockResolvedValueOnce([testAdminUser]).mockResolvedValueOnce([]);
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(findUser).toHaveBeenNthCalledWith(1, { uuid: headers["mock-uuid"] });
    expect(findUser).toHaveBeenNthCalledWith(2, { uuid: body.uuid });
    expect(findUser).toHaveBeenCalledTimes(2);
    expect(deleteUser).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "User not found" });
    expect(response.statusCode).toBe(404);
  });
  it("should return 500 if findUser throws error", async () => {
    findUser.mockResolvedValueOnce([testAdminUser]).mockRejectedValueOnce(new Error());
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(findUser).toHaveBeenNthCalledWith(1, { uuid: headers["mock-uuid"] });
    expect(findUser).toHaveBeenNthCalledWith(2, { uuid: body.uuid });
    expect(findUser).toHaveBeenCalledTimes(2);
    expect(deleteUser).not.toHaveBeenCalled();
    expect(await response.json()).toEqual({ error: "Unknown error" });
    expect(response.statusCode).toBe(500);
  });
  it("should return 500 if deleteUser throws error", async () => {
    deleteUser.mockRejectedValueOnce(new Error());
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual({ error: "Unknown error" });
    expect(response.statusCode).toBe(500);
  });
  it("should return 500 if loadFileMetadata throws error", async () => {
    loadFileMetadata.mockRejectedValueOnce(new Error());
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(findUser).toHaveBeenCalledTimes(2);
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(loadFileMetadata).toHaveBeenCalledTimes(1);
    expect(await response.json()).toEqual({ error: "Unknown error" });
    expect(response.statusCode).toBe(500);
  });
  it("should return 200 if successful", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(findUser).toHaveBeenNthCalledWith(2, { uuid: body.uuid });
    expect(deleteUser).toHaveBeenCalledTimes(1);
    expect(deleteUser).toHaveBeenCalledWith({ uuid: body.uuid });
    expect(loadFileMetadata).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenNthCalledWith(1, "testdir/fileMetadata.json", JSON.stringify({}));
    expect(rm).toHaveBeenCalledTimes(1);
    expect(rm).toHaveBeenCalledWith(resolve("testdir/uploadDirectory", body.uuid), { recursive: true, force: true });
    expect(await response.json()).toEqual({ message: "User deleted" });
    expect(response.statusCode).toBe(200);
  });
  it("should remove file metadata on success", async () => {
    const filepath = resolve("testdir/uploadDirectory", body.uuid);
    const metadata = {
      metadata: {
        fileName: "test",
        lastUpdated: new Date().toISOString(),
        decryptedFilepath: "test",
        mapPackIndexFilepath: "test",
        datapackIndexFilepath: "test"
      }
    };
    loadFileMetadata.mockResolvedValueOnce({
      [filepath]: {
        fileName: "test",
        lastUpdated: new Date().toISOString(),
        decryptedFilepath: "test",
        mapPackIndexFilepath: "test",
        datapackIndexFilepath: "test"
      },
      ...metadata
    });
    const response = await app.inject({
      method: "DELETE",
      url: "/admin/user",
      payload: body,
      headers
    });
    expect(writeFile).toHaveBeenNthCalledWith(1, "testdir/fileMetadata.json", JSON.stringify(metadata));
    expect(await response.json()).toEqual({ message: "User deleted" });
    expect(response.statusCode).toBe(200);
  });
});
