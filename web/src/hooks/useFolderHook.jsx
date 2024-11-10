import { useState, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { exists, mkdir, create, readDir } from "@tauri-apps/plugin-fs";

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

  // Read a folder
  const readDirectory = async ({ basePath, path }) => {
    try {
      const entries = await readDir(path, {
        baseDir: basePath,
      });
      return entries;
    } catch (e) {
      console.log(e);
      return;
    }
  };
  return { createFolder, selectFolder, readDirectory };
};

export default useFolderHook;
