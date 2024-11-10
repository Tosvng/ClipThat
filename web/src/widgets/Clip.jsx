import { BaseDirectory } from "@tauri-apps/plugin-fs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import useFileHook from "../hooks/useFileHook";
import { useState } from "react";

const Clip = ({ vidName }) => {
  const { readFile } = useFileHook();
  const [vid, setVid] = useState(null);
  const CLIPS_FOLDER = "Clip-That/clips";
  const readVideo = async () => {
    const video = await readFile({
      basePath: BaseDirectory.Document,
      filepath: `${CLIPS_FOLDER}/${vidName}`,
    });
    setVid(video);
    return video;
  };
  return (
    <div>
      {vidName && (
        <div className="w-[450px]">
          <AspectRatio ratio={16 / 9}>
            <video width="600" controls>
              <source
                src={vid}
                type="video/*"
                className="rounded-md object-cover"
              />
              Your browser does not support the video tag.
            </video>
          </AspectRatio>
        </div>
      )}
    </div>
  );
};

export default Clip;
