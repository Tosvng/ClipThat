import { useState, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import { documentDir } from "@tauri-apps/api/path";

import useFolderHook from "./useFolderHook";
import useFileHook from "./useFileHook";

const useSettingsHook = () => {
  const [filePath, setFilePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [keyword, setKeyword] = useState("");
  const { selectFolder, createFolder } = useFolderHook();
  const { selectFile, checkIfFileExists, createFile, readFile } = useFileHook();
  const CLIP_THAT_FOLDER = "Clip_That";
  const CONFIG_FILENAME = "d_config.txt";

  // controlled input - keyword
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  // Selecting a file function
  const handleSelectFile = async () => {
    const file = await selectFile();
    setFilePath(file);
  };

  const changeDestinationPath = async () => {
    const folder = await selectFolder();
    setDestinationPath(folder);
    // write it to app data
  };

  // Call python to process video
  const generateClips = async () => {
    const command = Command.sidecar(
      "C:/Users/altos/Documents/ClipThat/dist/clip_that_script",
      [keyword, filePath, destinationPath]
    );
    const output = await command.execute();
    if (output.code === 0) {
      console.log("success", output.stdout);
    } else {
      console.log("error", output.stderr);
    }
  };

  const createDefaultConfigFile = async (appFolderNumber) => {
    const file = await createFile({
      basePath: appFolderNumber,
      filepath: `${CLIP_THAT_FOLDER}/${CONFIG_FILENAME}`,
    });
    let config_path = await documentDir();
    config_path += `${CLIP_THAT_FOLDER}/clips`;
    if (file) {
      await file.write(new TextEncoder().encode(config_path));
      await file.close();
      return config_path;
    }
  };

  const readConfigFile = async (appFolderNumber) => {
    const fileContent = await readFile({
      basePath: appFolderNumber,
      filepath: `${CLIP_THAT_FOLDER}/${CONFIG_FILENAME}`,
    });
    if (fileContent.length > 0) {
      return fileContent.trim();
    } else {
      // IT SHOULD WRITE IT TO THE FILE HERE--- TO LAZY TO IMPLEMENT NOW
      let config_path = await documentDir();
      config_path += `${CLIP_THAT_FOLDER}/clips`;
      return config_path;
    }
  };

  const readDestPathFromConfigFile = async (appFolderNumber) => {
    let result = "";
    // if config exist read file
    const configFileExist = await checkIfFileExists({
      basePath: appFolderNumber,
      filepath: `${CLIP_THAT_FOLDER}/${CONFIG_FILENAME}`,
    });
    if (configFileExist) {
      result = await readConfigFile(appFolderNumber);
    } else {
      result = await createDefaultConfigFile(appFolderNumber);
    }
    return result;
  };

  // Check if app has a file for storage
  const setup = async () => {
    // Make sure app has a folder to work in
    const appFolderNumber = BaseDirectory.Document; // Tauri number for folder path
    const appFolderExist = await createFolder({
      basePath: appFolderNumber,
      path: "Clip-That",
    });
    await createFolder({
      basePath: appFolderNumber,
      path: `${CLIP_THAT_FOLDER}/clips`,
    });
    if (appFolderExist) {
      // Set destination path
      setDestinationPath(await readDestPathFromConfigFile(appFolderNumber));
    }
  };

  useEffect(() => {
    setup();
  }, []);

  return {
    filePath,
    destinationPath,
    keyword,
    handleSelectFile,
    handleKeywordChange,
    changeDestinationPath,
    generateClips,
  };
};

export default useSettingsHook;
