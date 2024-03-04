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
jest.mock("path", () => ({
  _esModule: true,
  default: {
    basename: jest.fn().mockImplementation((path: string) => {
      if (path.indexOf(".") !== -1) {
        if (path.indexOf("/") !== -1) {
          return path.slice(path.lastIndexOf("/") + 1, path.indexOf("."));
        }
        return path.slice(0, path.indexOf("."));
      }
      return path;
    })
  }
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

import { grabParent, grabVertBounds, parseMapPacks, processLine } from "../src/parse-map-packs";
import { MapHierarchy, MapInfo } from "@tsconline/shared";
const key = JSON.parse(readFileSync("server/__tests__/__data__/map-pack-keys.json").toString());

const vertBoundsHeaders = ["HEADER-COORD", "COORDINATE TYPE", "CENTER LAT", "CENTER LON", "HEIGHT", "SCALE"];
const vertBoundsInfo = ["COORD", "VERTICAL PERSPECTIVE", "1", "2", "3", "4"];

const parentHeaders = [
  "HEADER-PARENT MAP",
  "PARENT NAME",
  "COORDINATE TYPE",
  "UPPER LEFT LON",
  "UPPER LEFT LAT",
  "LOWER RIGHT LON",
  "LOWER RIGHT LAT"
];
const parentsInfo = ["PARENT MAP", "PARENT NAME", "RECTANGULAR", "1", "2", "3", "4"];

const headerMapHeaders = ["HEADER-MAP INFO", "MAP NAME", "IMAGE", "NOTE"];
const headerMapInfo = ["MAP INFO", "MAP TITLE TEST", "IMAGE", "NOTE"];

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

  it("should return empty if bad data", async () => {
    await expect(parseMapPacks(["bad-data.txt"])).rejects.toThrow(
      new Error("Map info file: bad-data is not in the correct format/version")
    );
  });
});

describe("grab from headers and info tests", () => {
  /**
   * Standard parent map
   */
  it("should return the parent map", () => {
    const parent = grabParent(parentHeaders, parentsInfo);
    expect(parent).toEqual({
      name: "PARENT NAME",
      coordtype: "RECTANGULAR",
      bounds: {
        upperLeftLon: 1,
        upperLeftLat: 2,
        lowerRightLon: 3,
        lowerRightLat: 4
      }
    });
  });

  /**
   * standard vert bounds with center lon
   */
  it("should return vert bounds with CENTER LON", () => {
    const vertBounds = grabVertBounds(vertBoundsHeaders, vertBoundsInfo);
    expect(vertBounds).toEqual({
      centerLat: 1,
      centerLon: 2,
      height: 3,
      scale: 4
    });
  });

  /**
   * standard vert bounds with center long
   */
  it("should return vert bounds with CENTER LONG", () => {
    vertBoundsHeaders[3] = "CENTER LONG";
    const vertBounds = grabVertBounds(vertBoundsHeaders, vertBoundsInfo);
    expect(vertBounds).toEqual({
      centerLat: 1,
      centerLon: 2,
      height: 3,
      scale: 4
    });
  });
});

describe("processLine tests", () => {
  let map: MapInfo[string], mapHierarchy: MapHierarchy, index: number;
  beforeEach(() => {
    index = 0;
    map = {
      name: "",
      img: "",
      coordtype: "",
      bounds: {
        upperLeftLon: 0,
        upperLeftLat: 0,
        lowerRightLon: 0,
        lowerRightLat: 0
      },
      mapPoints: {}
    };
    mapHierarchy = {};
  });

  /**
   * Should parse and fill out map info header correctly
   */
  it("should process a HEADER-MAP INFO", async () => {
    const tabSeparated = [headerMapHeaders, headerMapInfo];
    const expectedMap = {
      name: "MAP TITLE TEST",
      img: "/imagesDirectory/IMAGE",
      coordtype: "",
      note: "NOTE",
      bounds: {
        upperLeftLon: 0,
        upperLeftLat: 0,
        lowerRightLon: 0,
        lowerRightLat: 0
      },
      mapPoints: {}
    };
    const expectedMapHierarchy = {};
    processLine(index, tabSeparated, "test", map, mapHierarchy);
    expect(map).toEqual(expectedMap);
    expect(mapHierarchy).toEqual(expectedMapHierarchy);
  });

  /**
   * Map with a parent fills map and map hierarchy correctly
   */
  it("should process a HEADER-PARENT", async () => {
    const tabSeparated = [parentHeaders, parentsInfo];
    const expectedMap = {
      name: "",
      img: "",
      coordtype: "",
      parent: {
        name: "PARENT NAME",
        coordtype: "RECTANGULAR",
        bounds: {
          upperLeftLon: 1,
          upperLeftLat: 2,
          lowerRightLon: 3,
          lowerRightLat: 4
        }
      },
      bounds: {
        upperLeftLon: 0,
        upperLeftLat: 0,
        lowerRightLon: 0,
        lowerRightLat: 0
      },
      mapPoints: {}
    };
    const expectedMapHierarchy = { [parentsInfo[1]!]: [""] };
    processLine(index, tabSeparated, "test", map, mapHierarchy);
    expect(map).toEqual(expectedMap);
    expect(mapHierarchy).toEqual(expectedMapHierarchy);
  });
});
