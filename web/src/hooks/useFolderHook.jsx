import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { exists, mkdir, create } from "@tauri-apps/plugin-fs";

const useFolderHook = () => {
  // Allow a user select a folder
  const selectFolder = async () => {
    const folder = await open({
      multiple: false,
      directory: true,
    });
    return folder;
  };

  // Create a new folder
  const createFolder = async ({ basePath, path }) => {
    try {
      const isExisting = await exists(path, {
        baseDir: basePath,
      });
      if (!isExisting) {
        // create the folder if it doesn't exist
        await mkdir(path, {
          baseDir: basePath,
        });
      }
      return true;
    } catch (e) {
      return false;
    }
  };
  return { createFolder, selectFolder };
};

export default useFolderHook;
