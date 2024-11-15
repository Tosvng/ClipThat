/* eslint-disable react/prop-types */
import { AspectRatio } from "@/components/ui/aspect-ratio";
import useFileHook from "../hooks/useFileHook";
import { useEffect, useRef, useState } from "react";
import { documentDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { CirclePlay, Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Clip = ({ videoName }) => {
  const videoRef = useRef(null);
  const [video, setVideo] = useState("");
  const [assetUrl, setAssetUrl] = useState(null);
  const CLIPS_FOLDER = "Clip-That/clips";

  const fullVideoPath = async () => {
    const docPath = await documentDir();
    const filePath = await join(docPath, `${CLIPS_FOLDER}/${videoName}`);
    setAssetUrl(convertFileSrc(filePath));
    setVideo(filePath);
  };
  fullVideoPath();

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const source = document.createElement("source");
      source.type = "video/mp4";
      source.src = assetUrl;
      video.appendChild(source);
      video.load();
    }
  }, [assetUrl]);

  return (
    <div className="p-4">
      <div className="flex flex-row gap-2 items-center justify-center">
        <h3 className="font-normal text-gray-700">{videoName}</h3>
      </div>
      <AspectRatio ratio={9 / 16}>
        <video
          ref={videoRef}
          className="h-full w-full rounded-sm"
          controls
        ></video>
      </AspectRatio>
      <div className="p-4 rounded-xs flex items-center justify-between w-full">
        {/* <Button variant="outline" size="sm" className="rounded-xs">
          Upload to YouTube
          <Upload className="h-4 w-4" />
          <span className="sr-only">Upload to YouTube</span>
        </Button> */}
      </div>
    </div>
  );
};

export default Clip;
