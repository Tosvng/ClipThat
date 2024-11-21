import useFolderHook from "@/hooks/useFolderHook";
import { watch, BaseDirectory } from "@tauri-apps/plugin-fs";
import { useEffect, useState, useCallback } from "react";
import { isVideoFile } from "@/lib/utils";
import Clip from "@/widgets/Clip";

const VideoLibrary = () => {
  const { readDirectory } = useFolderHook();
  const [videosPath, setVideosPath] = useState([]);
  const CLIPS_FOLDER = "Clip-That\\clips";

  // read the clips directory for video files
  const getVideosPath = useCallback(
    async (e) => {
      const vid = await readDirectory({
        basePath: BaseDirectory.Document,
        path: CLIPS_FOLDER,
      });
      //   Only add video files to the state
      setVideosPath(vid.filter((v) => v.isFile && isVideoFile(v.name)));
    },
    [readDirectory]
  );

  //   Watch for changes in the clips folder and update every minute after a change
  const watchResultsFolderForChanges = async () => {
    try {
      await watch(CLIPS_FOLDER, getVideosPath, {
        baseDir: BaseDirectory.Document,
        delayMs: 60000,
        recursive: true,
      });
    } catch (e) {
      // console.error(e);
    }
  };

  watchResultsFolderForChanges();

  useEffect(() => {
    getVideosPath();
  }, [getVideosPath]);

  return (
    <div className="py-8 px-2 space-y-4">
      <h2 className="text-xl font-semibold">Your Video Clips</h2>
      {videosPath.length === 0 ? (
        <p className="text-gray-500">
          No clips available. Start by clipping a video!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {videosPath.map((video) => (
              <Clip key={video.name} videoName={video.name} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoLibrary;
