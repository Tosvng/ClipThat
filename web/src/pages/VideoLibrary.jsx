import { useState, useEffect } from "react";
import { readDir, BaseDirectory, watch, remove } from "@tauri-apps/plugin-fs";
import { documentDir, join } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-shell";
import { Button } from "@/components/ui/button";
import { Play, Trash2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VideoLibrary = () => {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatClipName = (filename) => {
    // Remove the extension
    const nameWithoutExt = filename.replace(".mp4", "");

    // Extract timestamp parts from the filename
    // Example filename: clip_1_20240319_153022.mp4
    const parts = nameWithoutExt.split("_");
    if (parts.length === 4) {
      const [prefix, clipNumber, date, time] = parts;

      // Format date: 20240319 -> Mar 19, 2024
      const year = date.slice(0, 4);
      const month = new Date(
        date.slice(0, 4),
        parseInt(date.slice(4, 6)) - 1
      ).toLocaleString("default", { month: "short" });
      const day = parseInt(date.slice(6, 8));

      // Format time: 153022 -> 15:30:22
      const hours = time.slice(0, 2);
      const minutes = time.slice(2, 4);
      const seconds = time.slice(4, 6);

      return (
        <div className="space-y-1">
          <div className="font-medium text-gold">Clip {clipNumber}</div>
          <div className="text-xs text-cream/80">
            {`${month} ${day}, ${year}`}
          </div>
          <div className="text-xs text-cream/60">
            {`${hours}:${minutes}:${seconds}`}
          </div>
        </div>
      );
    }

    // Fallback if filename doesn't match expected format
    return <div className="text-cream">{filename}</div>;
  };

  const loadClips = async () => {
    try {
      setLoading(true);
      const documentsPath = await documentDir();
      const clipsPath = await join(documentsPath, "Clip-That", "clips");
      const entries = await readDir(clipsPath);

      // Filter for MP4 files and sort by date (newest first)
      const videoFiles = entries
        .filter((entry) => entry.name?.toLowerCase().endsWith(".mp4"))
        .sort((a, b) => {
          const aTime = a.name?.split("_")[2] || "";
          const bTime = b.name?.split("_")[2] || "";
          return bTime.localeCompare(aTime); // Reverse chronological order
        });

      setClips(videoFiles);
    } catch (error) {
      console.error("Error loading clips:", error);
    } finally {
      setLoading(false);
    }
  };

  const watchClipsFolder = async () => {
    try {
      await watch(
        "Clip-That\\clips", // Path relative to Documents
        async (_) => {
          // Reload clips when changes are detected
          await loadClips();
        },
        {
          baseDir: BaseDirectory.Document,
          delayMs: 1000, // 1 second delay to batch changes
          recursive: true,
        }
      );
    } catch (error) {
      console.error("Error watching clips folder:", error);
    }
  };

  useEffect(() => {
    loadClips();
    watchClipsFolder();
  }, []);

  const playClip = async (filename) => {
    try {
      const documentsPath = await documentDir();
      const clipPath = await join(
        documentsPath,
        "Clip-That",
        "clips",
        filename
      );
      await open(clipPath);
    } catch (error) {
      console.error("Error playing clip:", error);
    }
  };

  const deleteClip = async (filename) => {
    try {
      const documentsPath = await documentDir();
      const clipPath = await join("Clip-That", "clips", filename);

      await remove(clipPath, { baseDir: BaseDirectory.Document });

      // No need to manually reload clips as the watch function will handle it
      toast.success("Clip deleted successfully");
    } catch (error) {
      console.error("Error deleting clip:", error);
      toast.error("Failed to delete clip");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <div
            key={clip.name}
            className="bg-charcoal/40 backdrop-blur-sm border border-gold/20 rounded-lg p-4 space-y-4"
          >
            {formatClipName(clip.name)}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => playClip(clip.name)}
              >
                <Play className="h-4 w-4" />
                Play
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-charcoal border-gold/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-gold">
                      Delete Clip
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-cream/80">
                      Are you sure you want to delete "{clip.name}"? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:bg-gold/10 border-gold/50 text-cream">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteClip(clip.name)}
                      className="bg-red-500 hover:bg-red-600 text-white border-0"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>

      {clips.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="text-cream/60">No clips found</div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={loadClips}
          >
            <FolderOpen className="h-4 w-4" />
            Refresh Library
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;
