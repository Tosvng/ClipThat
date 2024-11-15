import { useState, useEffect } from "react";
import { Command } from "@tauri-apps/plugin-shell";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import { documentDir } from "@tauri-apps/api/path";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import useFolderHook from "./useFolderHook";
import useFileHook from "./useFileHook";

const useSettingsHook = () => {
  const [filePath, setFilePath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [info, setInfo] = useState("");
  const { selectFolder, createFolder } = useFolderHook();
  const { selectFile, checkIfFileExists, createFile, readTextFile } =
    useFileHook();
  const CLIP_THAT_FOLDER = "Clip-That";
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
  // File drop listener
  const handleDrop = async (event) => {
    const unlisten = await getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "drop") {
        // console.log("User dropped", event.payload.paths);
        setFilePath(event.payload.paths[0]);
      }
    });

    // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
    // unlisten();
  };

  // Call python to process video
  const generateClips = async () => {
    setIsGenerating(true);
    console.log(keyword, filePath, destinationPath);
    const command = Command.sidecar("./binaries/clip_that_script", [
      keyword,
      filePath,
      destinationPath,
    ]);
    const output = await command.execute();
    if (output.code === 0) {
      console.log("success", output.stdout);
      setInfo(
        `Clip generation complete. You can find your clips at ${destinationPath}`
      );
    } else {
      console.log("error", output.stderr);
      setInfo(`An Error occurred while generating clips ${output.stderr}`);
    }
    setIsGenerating(false);
    setTimeout(() => {
      setInfo("");
    }, 5000);
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
    const fileContent = await readTextFile({
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
      path: `${CLIP_THAT_FOLDER}`,
    });
    await createFolder({
      basePath: appFolderNumber,
      path: `${CLIP_THAT_FOLDER}/clips`,
    });
    if (appFolderExist) {
      // Set destination path
      let config_path = await documentDir();
      config_path += `\\${CLIP_THAT_FOLDER}\\clips`;
      setDestinationPath(config_path);
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
    isGenerating,
    info,
    handleDrop,
  };
};

export default useSettingsHook;
