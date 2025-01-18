import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClipVideoPage from "@/pages/ClipVideoPage";
import VideoLibrary from "@/pages/VideoLibrary";
import { TabsContent } from "@radix-ui/react-tabs";
import LogoutButton from "@/components/LogoutButton";
import UnsubscribeButton from "@/components/UnsubscribeButton";
import { HelpCircle, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { open } from "@tauri-apps/plugin-shell";
import { documentDir } from "@tauri-apps/api/path";
import { join } from "@tauri-apps/api/path";
import { useState, useEffect } from "react";

const TabLayout = () => {
  const [outputPath, setOutputPath] = useState("");

  useEffect(() => {
    const initializePath = async () => {
      try {
        const documentsPath = await documentDir();
        const clipThatPath = await join(documentsPath, "Clip-That");
        setOutputPath(clipThatPath);
      } catch (error) {
        console.error("Error getting documents path:", error);
      }
    };

    initializePath();
  }, []);

  const openOutputFolder = async () => {
    try {
      if (outputPath) {
        await open(outputPath);
      }
    } catch (error) {
      console.error("Error opening folder:", error);
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-charcoal to-slate">
      <Tabs
        defaultValue="clip"
        orientation="vertical"
        className="h-full flex flex-1"
      >
        {/* Sidebar */}
        <div className="w-64 bg-charcoal/50 backdrop-blur-sm border-r border-gold/20 p-4 flex flex-col">
          <div className="space-y-6">
            <h1 className="text-gold text-xl font-semibold">Video Suite</h1>
            <TabsList className="flex flex-col space-y-2 bg-transparent border-0">
              <TabsTrigger
                value="clip"
                className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-gold data-[state=active]:text-charcoal text-cream hover:text-gold transition-colors"
              >
                Clip Video
              </TabsTrigger>
              <TabsTrigger
                value="library"
                className="w-full justify-start px-4 py-2 text-left data-[state=active]:bg-gold data-[state=active]:text-charcoal text-cream hover:text-gold transition-colors"
              >
                Video Library
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Getting Started Section */}
          <div className="mt-8 p-4 bg-charcoal/40 rounded-lg border border-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-4 w-4 text-gold" />
              <h3 className="text-gold font-semibold">Getting Started</h3>
            </div>
            <div className="space-y-3 text-sm">
              <p className="text-cream/80">
                Your clips are saved in your Documents folder:
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={openOutputFolder}
              >
                <FolderOpen className="h-4 w-4" />
                Open Clips Folder
              </Button>
              <p className="text-xs text-cream/60">
                Clips are automatically named with timestamps and saved in
                vertical format
              </p>
            </div>
          </div>

          {/* Push buttons to bottom */}
          <div className="mt-auto space-y-2">
            <UnsubscribeButton />
            <LogoutButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <TabsContent value="clip" className="h-full m-0">
            <ClipVideoPage />
          </TabsContent>
          <TabsContent value="library" className="h-full m-0">
            <VideoLibrary />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TabLayout;
