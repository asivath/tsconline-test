import * as utilModule from "../src/util";
import { readFileSync } from "fs";
jest.mock("./util.js", () => ({
  ...utilModule,
  grabFilepaths: jest.fn().mockImplementation((files: string[]) => {
    return Promise.resolve(files.map((file) => `server/__tests__/__data__/${file}`));
  })
}));
jest.mock("./index.js", () => ({
  assetconfigs: { decryptionDirectory: "decryptionDirectory", imagesDirectory: "imagesDirectory" }
}));
jest.mock("p-map", () => ({
  default: jest.fn().mockImplementation(async (array: string[], callback: (src: string) => Promise<void>) => {
    for (const map_info of array) {
      await callback(map_info);
    }
  })
}));
jest.mock("fs/promises", () => ({
  _esModule: true,
  default: {
    readFile: jest.fn().mockImplementation((path: string) => {
      return Promise.resolve(readFileSync(path));
    })
  }
}));
jest.mock("@tsconline/shared", () => ({
  assertMapPoints: jest.fn().mockReturnValue(true),
  assertMapInfo: jest.fn().mockReturnValue(true),
  assertRectBounds: jest.fn().mockReturnValue(true),
  assertParentMap: jest.fn().mockReturnValue(true),
  assertInfoPoints: jest.fn().mockReturnValue(true),
  assertMapHierarchy: jest.fn().mockReturnValue(true),
  assertVertBounds: jest.fn().mockReturnValue(true),
  assertTransects: jest.fn().mockReturnValue(true)
}));

import { parseMapPacks } from "../src/parse-map-packs";
const key = JSON.parse(readFileSync("server/__tests__/__data__/map-pack-keys.json").toString());

describe("parseMapPacks tests", () => {
  it("should parse africa general map pack", async () => {
    const mapPacks = await parseMapPacks(["parse-map-packs-test-1.txt"]);
    expect(mapPacks).toEqual(key["map-pack-key-1"]);
  });

  /**
   * parses the belgium map pack with a parent map
   */
  it("should parse belgium map-pack", async () => {
    const mapPacks = await parseMapPacks(["parse-map-packs-test-2.txt"]);
    expect(mapPacks).toEqual(key["map-pack-key-2"]);
  });

  /**
   * parses transects, info points, map points, parent, coord, and header
   */
  it("should parse everything", async () => {
    const mapPacks = await parseMapPacks(["parse-map-packs-test-3.txt"]);
    expect(mapPacks).toEqual(key["map-pack-key-3"]);
  });

  /**
   * parses two packs with same parent "World map"
   */
  it("should parse two packs with same parent", async () => {
    const mapPacks = await parseMapPacks(["parse-map-packs-test-2.txt", "parse-map-packs-test-3.txt"]);
    const expected = {
      mapInfo: { ...key["map-pack-key-2"]["mapInfo"], ...key["map-pack-key-3"]["mapInfo"] },
      mapHierarchy: { "World Map": ["Belgium", "MAP TITLE TEST"] }
    };
    expect(mapPacks).toEqual(expected);
  });

  /**
   * parses three packs with same parent "World map" (not parse-map-packs-test-1)
   */
  it("should parse all packs", async () => {
    const mapPacks = await parseMapPacks([
      "parse-map-packs-test-1.txt",
      "parse-map-packs-test-2.txt",
      "parse-map-packs-test-3.txt"
    ]);
    const expected = {
      mapInfo: {
        ...key["map-pack-key-1"]["mapInfo"],
        ...key["map-pack-key-2"]["mapInfo"],
        ...key["map-pack-key-3"]["mapInfo"]
      },
      mapHierarchy: { "World Map": ["Belgium", "MAP TITLE TEST"] }
    };
    expect(mapPacks).toEqual(expected);
  });
});
