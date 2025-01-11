import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClipVideoPage from "@/pages/ClipVideoPage";
import VideoLibrary from "@/pages/VideoLibrary";
import { TabsContent } from "@radix-ui/react-tabs";
import LogoutButton from "@/components/LogoutButton";
import UnsubscribeButton from "@/components/UnsubscribeButton";

const TabLayout = () => {
  return (
    <div className="h-full flex bg-gradient-to-br from-charcoal to-slate">
      <Tabs
        defaultValue="clip"
        orientation="vertical"
        className="h-full flex flex-1"
      >
        {/* Sidebar */}
        <div className="w-64 bg-charcoal/50 backdrop-blur-sm border-r border-gold/20 p-4">
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

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
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
