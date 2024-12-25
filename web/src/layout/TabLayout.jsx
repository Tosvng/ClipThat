import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClipVideoPage from "@/pages/ClipVideoPage";
import VideoLibrary from "@/pages/VideoLibrary";
import { TabsContent } from "@radix-ui/react-tabs";
import LogoutButton from "@/components/LogoutButton";
import UnsubscribeButton from "@/components/UnsubscribeButton";
import { luxuryColors } from "@/lib/colors";

const TabLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal to-slate p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gold text-3xl font-semibold">Video Suite</h1>
          <div className="flex gap-4">
            <UnsubscribeButton />
            <LogoutButton />
          </div>
        </div>
        <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl p-6 shadow-xl">
          <Tabs defaultValue="clip" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent">
              <TabsTrigger
                value="clip"
                className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-cream hover:text-gold transition-colors"
              >
                Clip Video
              </TabsTrigger>
              <TabsTrigger
                value="library"
                className="data-[state=active]:bg-gold data-[state=active]:text-charcoal text-cream hover:text-gold transition-colors"
              >
                Video Library
              </TabsTrigger>
            </TabsList>
            <TabsContent value="clip">
              <ClipVideoPage />
            </TabsContent>
            <TabsContent value="library">
              <VideoLibrary />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TabLayout;
