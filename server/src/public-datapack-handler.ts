import {
  Datapack,
  DatapackIndex,
  assertDatapackIndex,
  assertPublicUserDatapack,
  makeTempFilename
} from "@tsconline/shared";
import { Mutex } from "async-mutex";
import { readFile, writeFile, mkdir, rename } from "fs/promises";
import { checkFileExists } from "./util.js";
import { publicDatapackIndex } from "./index.js";
import { join } from "path";
import _ from "lodash";

const mutex = new Mutex();
/**
 *
 * @param filename the name of the file to add
 * @param datapack the datapack to add
 * @param datapackIndexFilepath the path to the datapack index file that will be updated (public)
 * @param mapPackIndexFilepath the path to the map pack index file that will be updated (public)
 * @param datapackFilepath the path to the undecrypted datapack file
 * @param publicDatapacksDirectory the directory where the public datapacks are stored
 * @param mapPack the map pack to add (optional)
 */
export async function addPublicUserDatapack(
  datapack: Datapack,
  datapackIndexFilepath: string,
  datapackFilepath: string,
  publicDatapacksDirectory: string
) {
  const release = await mutex.acquire();
  try {
    if (publicDatapackIndex[datapack.title]) {
      throw new Error(`Datapack ${datapack.title} already exists`);
    }
    const storedFileName = makeTempFilename(datapack.originalFileName);
    // so we can modify it and not the original
    const publicDatapack = {
      ..._.cloneDeep(datapack),
      type: "public_user",
      storedFileName
    };
    assertPublicUserDatapack(publicDatapack);
    publicDatapackIndex[datapack.title] = datapack;
    await mkdir(publicDatapacksDirectory, { recursive: true });
    // copy the file (so charts can be generated seperate from the user dir)
    await rename(datapackFilepath, join(publicDatapacksDirectory, storedFileName));
    // update the file
    await writeFile(datapackIndexFilepath, JSON.stringify(publicDatapackIndex, null, 2));
    if (!(await checkFileExists(datapackFilepath))) {
      throw new Error("Datapack file does not exist");
    }
  } finally {
    release();
  }
}

export async function loadPublicUserDatapacks(datapackIndexFilepath: string) {
  const relase = await mutex.acquire();
  try {
    let parsedPublicDatapackIndex: DatapackIndex = {};
    if (await checkFileExists(datapackIndexFilepath)) {
      try {
        parsedPublicDatapackIndex = JSON.parse(await readFile(datapackIndexFilepath, "utf-8"));
        assertDatapackIndex(parsedPublicDatapackIndex);
      } catch (e) {
        console.error("Error parsing public datapack index", e);
        return { datapackIndex: {} };
      }
    }
    return { datapackIndex: parsedPublicDatapackIndex };
  } finally {
    relase();
  }
}
