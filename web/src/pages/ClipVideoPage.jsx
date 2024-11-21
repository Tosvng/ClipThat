import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Terminal, Upload, Scissors } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useSettingsHook from "../hooks/useSettingsHook";

const ClipVideoPage = () => {
  const {
    filePath,
    keyword,
    handleSelectFile,
    handleKeywordChange,
    generateClips,
    isGenerating,
    info,
    handleDrop,
  } = useSettingsHook();
  handleDrop();

  return (
    <>
      <div className="flex flex-col gap-4 p-8">
        {/* Upload input */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-xs p-8 text-center cursor-pointer"
          onClick={handleSelectFile}
          data-testid="file-upload-area"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop a video file here, or click to select a file
          </p>
          {filePath && <p className="mt-2 text-sm text-blue-500">{filePath}</p>}
        </div>
        {/* KEYWORD */}
        <div className="flex space-x-4 mt-4">
          <Input
            type="text"
            placeholder="Enter keyword"
            value={keyword}
            onChange={handleKeywordChange}
            className="flex-grow"
          />
          {/* Generate button */}
          <Button
            onClick={generateClips}
            disabled={!filePath || !keyword || isGenerating}
          >
            <Scissors className="mr-2 h-4 w-4" /> Clip Video
          </Button>
        </div>
      </div>

      {isGenerating && <p>Generating clips. This might take a while</p>}
      {!isGenerating && info && (
        <Alert>
          <Terminal className="m-8 h-4 w-4" />

          <AlertDescription>{info}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ClipVideoPage;
