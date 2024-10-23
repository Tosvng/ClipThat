import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useSettingsHook from "../hooks/useSettingsHook.jsx";

const Settings = () => {
  const {
    filePath,
    destinationPath,
    keyword,
    handleSelectFile,
    handleKeywordChange,
    changeDestinationPath,
    generateClips,
  } = useSettingsHook();

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        {/* <div className="grid w-full  items-center gap-1.5 flex-1">
          <Label htmlFor="video">Upload Video</Label>
          <Input id="video" type="file" onChange={handleFileChange} />
        </div> */}
        <Label htmlFor="video">Upload Video</Label>
        <div className="flex flex-row w-full  items-center gap-1.5 flex-1 border border-gray-200 p-1">
          <Button onClick={handleSelectFile}>Upload your Video</Button>
          {filePath ? <p> {filePath} </p> : <p>Choose your file </p>}
        </div>
        <div className="grid w-full  items-center gap-1.5 flex-1">
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            type="text"
            id="keyword"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Trigger word"
          />
        </div>
        <Label htmlFor="video">
          Select the folder you want your clipped videos in
        </Label>
        <div className="flex flex-row w-full  items-center gap-1.5 flex-1 border border-gray-200 p-1">
          <Button onClick={changeDestinationPath}>Select folder</Button>
          {destinationPath ? (
            <p> {destinationPath} </p>
          ) : (
            <p>Choose your folder </p>
          )}
        </div>
      </div>
      <Button onClick={generateClips}>Generate</Button>
    </>
  );
};

export default Settings;
