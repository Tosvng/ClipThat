/* eslint-disable react/prop-types */
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useRef, useState } from "react";
import { documentDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/core";
import { CirclePlay, Play, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
// import YouTubeUploader from "./YouTubeUploader";

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
    <div className="w-full">
      <div className="flex flex-row gap-2 items-center justify-center">
        <h3 className="font-normal text-gray-700">{videoName}</h3>
      </div>
      <AspectRatio ratio={9 / 16}>
        <video
          ref={videoRef}
          className="h-full w-full rounded-sm"
          controls
          playsInline
          controlsList={window.innerWidth < 768 ? "nofullscreen" : ""}
        ></video>
      </AspectRatio>
      {/* <YouTubeUploader videoFile={video} /> */}
    </div>
  );
};

export default Clip;
