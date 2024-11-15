import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClipVideoPage from "@/pages/ClipVideoPage";
import VideoLibrary from "@/pages/VideoLibrary";
import { TabsContent } from "@radix-ui/react-tabs";

const TabLayout = () => {
  return (
    <>
      <Tabs defaultValue="clip" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clip">Clip Video</TabsTrigger>
          <TabsTrigger value="library">Video Library</TabsTrigger>
        </TabsList>
        <TabsContent value="clip">
          <ClipVideoPage />
        </TabsContent>
        <TabsContent value="library">
          <VideoLibrary />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TabLayout;
