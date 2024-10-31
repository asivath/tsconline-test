import { access, readFile, rename, rm, writeFile } from "fs/promises";
import path from "path";
import { CACHED_USER_DATAPACK_FILENAME, DATAPACK_PROFILE_PICTURE_FILENAME } from "../constants.js";
import { assetconfigs, getBytes, makeTempFilename, verifyFilepath } from "../util.js";
import { Datapack, DatapackMetadata, assertDatapack, isDateValid } from "@tsconline/shared";
import logger from "../error-logger.js";
import { changeFileMetadataKey, deleteDatapackFoundInMetadata } from "../file-metadata-handler.js";
import { spawn } from "child_process";
import {
  getAllUserDatapackDirectories,
  fetchUserDatapackDirectory,
  getDirectories,
  getPrivateUserUUIDDirectory
} from "./fetch-user-files.js";
import _ from "lodash";
import { Multipart, MultipartFile } from "@fastify/multipart";
import { findUser } from "../database.js";
import { OperationResult, User } from "../types.js";
import {
  changeProfilePicture,
  getTemporaryFilepath,
  setupNewDatapackDirectoryInUUIDDirectory,
  uploadFileToFileSystem
} from "../upload-handlers.js";
import { switchPrivacySettingsOfDatapack } from "../public-datapack-handler.js";

/**
 * TODO: WRITE TESTS
 * looks for a specific datapack in all the user directories
 * @param uuid
 * @param datapack
 * @returns
 */
export async function doesDatapackFolderExistInAllUUIDDirectories(uuid: string, datapack: string): Promise<boolean> {
  const directories = await getAllUserDatapackDirectories(uuid);
  for (const directory of directories) {
    if (directory) {
      const datapacks = await getDirectories(directory);
      if (datapacks.includes(datapack)) {
        return true;
      }
    }
  }
  return false;
}
/**
 * fetch all datapacks a user has
 * @param uuid
 * @returns
 */
export async function fetchAllUsersDatapacks(uuid: string): Promise<Datapack[]> {
  const directories = await getAllUserDatapackDirectories(uuid);
  const datapacksArray: Datapack[] = [];
  for (const directory of directories) {
    const datapacks = await getDirectories(directory);
    for (const datapack of datapacks) {
      try {
        const cachedDatapack = path.join(directory, datapack, CACHED_USER_DATAPACK_FILENAME);
        const parsedCachedDatapack = JSON.parse(await readFile(cachedDatapack, "utf-8"));
        if (await verifyFilepath(cachedDatapack)) {
          if (datapacksArray.find((datapack) => datapack.title === parsedCachedDatapack.title)) {
            throw new Error(`Datapack ${datapack} already exists in the array`);
          }
          assertDatapack(parsedCachedDatapack);
          datapacksArray.push(parsedCachedDatapack);
        } else {
          throw new Error(`File ${datapack} doesn't exist`);
        }
      } catch (e) {
        logger.error(`Error reading datapack ${datapack} for user ${uuid} with error ${e}`);
      }
    }
  }
  return datapacksArray;
}

export async function fetchAllPrivateOfficialDatapacks(): Promise<Datapack[]> {
  const directory = await getPrivateUserUUIDDirectory("official");
  const datapacksArray: Datapack[] = [];
  const datapacks = await getDirectories(directory);
  for (const datapack of datapacks) {
    try {
      const cachedDatapack = path.join(directory, datapack, CACHED_USER_DATAPACK_FILENAME);
      const parsedCachedDatapack = JSON.parse(await readFile(cachedDatapack, "utf-8"));
      if (await verifyFilepath(cachedDatapack)) {
        if (datapacksArray.find((datapack) => datapack.title === parsedCachedDatapack.title)) {
          throw new Error(`Datapack ${datapack} already exists in the array`);
        }
        assertDatapack(parsedCachedDatapack);
        datapacksArray.push(parsedCachedDatapack);
      } else {
        throw new Error(`File ${datapack} doesn't exist`);
      }
    } catch (e) {
      logger.error(`Error reading datapack ${datapack} for user server with error ${e}`);
    }
  }
  return datapacksArray;
}

/**
 * GET the uploaded datapack filepath NOT the directory it lives in
 * TODO: WRITE TESTS
 * @param uuid
 * @param datapack
 * @returns
 */
export async function getUploadedDatapackFilepath(uuid: string, datapack: string): Promise<string> {
  const directory = await fetchUserDatapackDirectory(uuid, datapack);
  const metadata = await fetchUserDatapack(uuid, datapack);
  const uploadedFilepath = path.join(directory, metadata.originalFileName);
  if (!(await verifyFilepath(uploadedFilepath))) {
    throw new Error("Invalid filepath");
  }
  return uploadedFilepath;
}

/**
 * fetches the user datapack, public or private
 * @param uuid
 * @param datapack
 * @returns
 */
export async function fetchUserDatapack(uuid: string, datapack: string): Promise<Datapack> {
  const datapackPath = await fetchUserDatapackDirectory(uuid, datapack);
  const cachedDatapack = path.join(datapackPath, CACHED_USER_DATAPACK_FILENAME);
  if (!cachedDatapack || !(await verifyFilepath(cachedDatapack))) {
    throw new Error(`File ${datapack} doesn't exist`);
  }
  const parsedCachedDatapack = JSON.parse(await readFile(cachedDatapack, "utf-8"));
  assertDatapack(parsedCachedDatapack);
  return parsedCachedDatapack;
}

/**
 * rename a user datapack which means we have to rename the folder and the file metadata (the key only)
 * also updates the datapack with a new datapack object
 * @param uuid the uuid of the user
 * @param oldDatapack the old datapack title
 * @param datapack the new datapack object
 */
export async function renameUserDatapack(uuid: string, oldDatapack: string, datapack: Datapack): Promise<void> {
  const oldDatapackPath = await fetchUserDatapackDirectory(uuid, oldDatapack);
  const oldDatapackMetadata = await fetchUserDatapack(uuid, oldDatapack);
  const newDatapackPath = path.join(path.dirname(oldDatapackPath), datapack.title);
  if (!path.resolve(newDatapackPath).startsWith(path.resolve(path.dirname(oldDatapackPath)))) {
    throw new Error("Invalid filepath");
  }
  if (await doesDatapackFolderExistInAllUUIDDirectories(uuid, datapack.title)) {
    throw new Error("Datapack with that title already exists");
  }
  await rename(oldDatapackPath, newDatapackPath);
  await writeUserDatapack(uuid, datapack).catch(async (e) => {
    await rename(newDatapackPath, oldDatapackPath);
    throw e;
  });
  await changeFileMetadataKey(assetconfigs.fileMetadata, oldDatapackPath, newDatapackPath).catch(async (e) => {
    await rename(newDatapackPath, oldDatapackPath);
    // revert the write if the metadata change fails
    await writeUserDatapack(uuid, oldDatapackMetadata);
    throw e;
  });
}

/**
 * TODO: write tests
 * @param uuid
 * @param oldDatapackTitle
 * @param newDatapack
 */
export async function editDatapack(
  uuid: string,
  oldDatapackTitle: string,
  newDatapack: Partial<DatapackMetadata>
): Promise<void> {
  const metadata = await fetchUserDatapack(uuid, oldDatapackTitle);
  const originalTitle = _.clone(metadata.title);
  Object.assign(metadata, newDatapack);
  if ("originalFileName" in newDatapack) {
    await setupNewDatapackDirectoryInUUIDDirectory(
      uuid,
      await getTemporaryFilepath(uuid, metadata.storedFileName),
      metadata,
      false,
      metadata.datapackImage ? await getTemporaryFilepath(uuid, metadata.datapackImage) : undefined
    );
  } else if ("title" in newDatapack && originalTitle !== newDatapack.title) {
    await renameUserDatapack(uuid, originalTitle, metadata);
  } else {
    await writeUserDatapack(uuid, metadata);
  }
  // if the user already changed the file, we already updated the profile picture
  if (!("originalFileName" in newDatapack) && "datapackImage" in newDatapack) {
    await changeProfilePicture(uuid, metadata.title, await getTemporaryFilepath(uuid, newDatapack.datapackImage!));
  }
  if ("isPublic" in newDatapack && metadata.isPublic !== newDatapack.isPublic) {
    await switchPrivacySettingsOfDatapack(uuid, metadata.title, newDatapack.isPublic!, metadata.isPublic);
  }
}

/**
 * deletes all the user datapacks, public and private
 * TODO: write tests
 * @param uuid
 */
export async function deleteAllUserDatapacks(uuid: string): Promise<void> {
  const directories = await getAllUserDatapackDirectories(uuid);
  for (const directory of directories) {
    // just to make sure it's not falsy ie ""
    if (directory) {
      try {
        await rm(directory, { recursive: true, force: true });
        await deleteDatapackFoundInMetadata(assetconfigs.fileMetadata, directory);
      } catch (e) {
        logger.error(`Error deleting user datapack directory: ${directory}`);
      }
    }
  }
}

/**
 * deletes a single user datapack
 * TODO: write tests
 * @param uuid
 * @param datapack the title of the datapack
 */
export async function deleteUserDatapack(uuid: string, datapack: string): Promise<void> {
  const datapackPath = await fetchUserDatapackDirectory(uuid, datapack);
  if (!(await verifyFilepath(datapackPath))) {
    throw new Error("Invalid filepath");
  }
  await rm(datapackPath, { recursive: true, force: true });
  await deleteDatapackFoundInMetadata(assetconfigs.fileMetadata, datapackPath);
}

/**
 * Deletes a server datapack
 * @param datapack the title of the datapack
 * TODO: write tests
 */
export async function deleteOfficialDatapack(datapack: string): Promise<void> {
  const datapackPath = await fetchUserDatapackDirectory("official", datapack);
  if (!(await verifyFilepath(datapackPath))) {
    throw new Error("Invalid filepath");
  }
  await rm(datapackPath, { recursive: true, force: true });
}

export async function canUserUploadThisFile(user: User, file: MultipartFile) {
  if (user.isAdmin || user.accountType === "pro") {
    return true;
  }
  return file.file.bytesRead <= 3000;
}

/**
 * writes a user datapack to the file system
 * @param uuid
 * @param datapack
 */
export async function writeUserDatapack(uuid: string, datapack: Datapack): Promise<void> {
  const datapackPath = path.join(await fetchUserDatapackDirectory(uuid, datapack.title), CACHED_USER_DATAPACK_FILENAME);
  if (!(await verifyFilepath(datapackPath))) {
    throw new Error("Invalid filepath");
  }
  await writeFile(datapackPath, JSON.stringify(datapack, null, 2));
}
/**
 * TODO: write tests
 * @param filepath
 * @param outputDirectory
 */
export async function decryptDatapack(filepath: string, outputDirectory: string): Promise<void> {
  const filenameWithoutExtension = path.parse(filepath).name;
  const args = [
    "-jar",
    assetconfigs.decryptionJar,
    "-d",
    filepath.replaceAll("\\", "/"),
    "-dest",
    outputDirectory.replaceAll("\\", "/")
  ];
  await new Promise<void>((resolve, reject) => {
    const cmd = "java";
    const javaProcess = spawn(cmd, args, { timeout: 1000 * 60 * 5, killSignal: "SIGKILL" });
    let stdout = "";
    let stderr = "";
    javaProcess.stdout.on("data", (data) => {
      stdout += data;
    });
    javaProcess.stderr.on("data", (data) => {
      stderr += data;
    });
    javaProcess.on("error", (error) => {
      reject(error);
    });
    javaProcess.on("close", (code, signal) => {
      if (signal == "SIGKILL") {
        reject(new Error("Process timed out"));
        return;
      }
      console.log("Java process finished");
      console.log("Java stdout: " + stdout);
      console.log("Java stderr: " + stderr);
      resolve();
    });
  });
  await access(path.join(outputDirectory, filenameWithoutExtension));
  await access(path.join(outputDirectory, filenameWithoutExtension, "datapacks"));
}
/**
 * get the encrypted datapack directory given uuid and datapack title
 * @param uuid
 * @param datapackTitle
 * @returns
 */
export async function getEncryptedDatapackDirectory(uuid: string, datapackTitle: string) {
  const datapackDir = await fetchUserDatapackDirectory(uuid, datapackTitle);
  const metadata = await fetchUserDatapack(uuid, datapackTitle);
  const encryptedDir = path.join(datapackDir, "encrypted");
  const encryptedFilepath = path.join(encryptedDir, metadata.originalFileName);
  return { encryptedDir, encryptedFilepath };
}

export function checkFileTypeIsDatapack(file: MultipartFile): boolean {
  return (
    (file.mimetype === "application/octet-stream" ||
      file.mimetype === "text/plain" ||
      file.mimetype === "application/zip") &&
    /^(\.dpk|\.txt|\.map|\.mdpk)$/.test(path.extname(file.filename))
  );
}

export function checkFileTypeIsDatapackImage(file: MultipartFile): boolean {
  return (
    (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") &&
    /^(\.png|\.jpg|\.jpeg)$/.test(path.extname(file.filename))
  );
}

export async function processEditDatapackRequest(
  formData: AsyncIterableIterator<Multipart>,
  uuid: string
): Promise<OperationResult | { code: number; fields: Record<string, string> }> {
  const users = await findUser({ uuid });
  const user = users[0];
  if (!user) {
    return { code: 401, message: "User not found" };
  }
  const fields: Record<string, string> = {};
  let datapackImageFilepath: string | undefined;
  const cleanupTempFiles = async () => {
    if (datapackImageFilepath) {
      await rm(datapackImageFilepath, { force: true });
    }
    if (fields.filepath) {
      await rm(fields.filepath, { force: true });
    }
  };
  for await (const part of formData) {
    if (part.type === "file") {
      if (part.fieldname === "datapack") {
        if (!checkFileTypeIsDatapack(part)) {
          await cleanupTempFiles();
          return { code: 415, message: "Invalid file type for datapack" };
        }
        if (!canUserUploadThisFile(user, part)) {
          await cleanupTempFiles();
          return { code: 413, message: "File too large" };
        }
        fields.storedFileName = makeTempFilename(part.filename);
        fields.originalFileName = part.filename;
        fields.filepath = await getTemporaryFilepath(uuid, fields.storedFileName);
        fields.size = getBytes(part.file.bytesRead);
        const { code, message } = await uploadFileToFileSystem(part, fields.filepath);
        if (code !== 200) {
          await cleanupTempFiles();
          return { code, message };
        }
      } else if (part.fieldname === DATAPACK_PROFILE_PICTURE_FILENAME) {
        if (!checkFileTypeIsDatapackImage(part)) {
          await cleanupTempFiles();
          return { code: 415, message: "Invalid file type for datapack image" };
        }
        fields.datapackImage = DATAPACK_PROFILE_PICTURE_FILENAME + path.extname(part.filename);
        datapackImageFilepath = await getTemporaryFilepath(uuid, fields.datapackImage);
        const { code, message } = await uploadFileToFileSystem(part, datapackImageFilepath);
        if (code !== 200) {
          await cleanupTempFiles();
          return { code, message };
        }
      }
    } else if (part.type === "field" && typeof part.fieldname === "string" && typeof part.value === "string") {
      fields[part.fieldname] = part.value;
    }
  }
  return { code: 200, fields };
}

/**
 * Since the fields are strings that we receive from a request, we need to convert them to the correct types (arrays)
 */
export function convertNonStringFieldsToCorrectTypesInDatapackMetadataRequest(fields: Record<string, string>) {
  const partial: Partial<DatapackMetadata> = {};

  for (const key in fields) {
    const value = fields[key]!;
    switch (key) {
      case "isPublic":
        partial.isPublic = fields[key] === "true";
        break;
      case "date":
        if (!isDateValid(value)) {
          throw new Error("Invalid date");
        }
      // eslint-disable-next-line no-fallthrough
      case "title":
      case "description":
      case "authoredBy":
      case "contact":
      case "notes":
      case "originalFileName":
      case "storedFileName":
        partial[key] = value;
        break;
      case "references":
      case "tags":
        partial[key] = JSON.parse(value);
        // eslint-disable-next-line no-case-declarations
        const array = partial[key];
        if (!array || !Array.isArray(array) || !array.every((ref) => typeof ref === "string")) {
          throw new Error("References and tags must be valid arrays");
        }
        break;
    }
  }
  return partial;
}
