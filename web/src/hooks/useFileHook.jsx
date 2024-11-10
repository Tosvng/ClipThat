import { open } from "@tauri-apps/plugin-dialog";
import { exists, create, readTextFile } from "@tauri-apps/plugin-fs";

const useFileHook = () => {
  // Allow a user select a folder
  const selectFile = async () => {
    const folder = await open({
      multiple: false,
      directory: false,
    });
    return folder;
  };

  const checkIfFileExists = async ({ basePath, filepath }) => {
    try {
      const isCreated = await exists(filepath, {
        baseDir: basePath,
      });
      return isCreated;
    } catch (e) {
      return false;
    }
  };

  const createFile = async ({ basePath, filepath }) => {
    try {
      if (!checkIfFileExists({ basePath, filepath })) {
        const file = await create(filepath, {
          baseDir: basePath,
        });
        return file;
      }
    } catch (e) {
      return false;
    }
  };

  const readTextFile = async ({ basePath, filepath }) => {
    try {
      const fileContent = await readTextFile(filepath, {
        baseDir: basePath,
      });
      return fileContent;
    } catch (e) {
      return false;
    }
  };

  const readFile = async ({ basePath, filepath }) => {
    try {
      const fileContent = await readFile(filepath, {
        baseDir: basePath,
      });
      console.log(basePath, filepath);
      return fileContent;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  return { selectFile, checkIfFileExists, createFile, readTextFile, readFile };
};

export default useFileHook;
