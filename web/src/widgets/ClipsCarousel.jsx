/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { BaseDirectory } from "@tauri-apps/plugin-fs";
import Clip from "./Clip";
import { useEffect, useState } from "react";
import { documentDir } from "@tauri-apps/api/path";
import useFolderHook from "@/hooks/useFolderHook";

const ClipsCarousel = ({ heading = "Clips" }) => {
  const { readDirectory } = useFolderHook();
  const [videosPath, setVideosPath] = useState([]);
  const CLIPS_FOLDER = "Clip-That\\clips";

  const fullVideoPath = async (name) => {
    const docPath = await documentDir();
    return `${docPath}\\${CLIPS_FOLDER}\\${name}`;
  };

  useEffect(() => {
    const getVideosPath = async () => {
      const vid = await readDirectory({
        basePath: BaseDirectory.Document,
        path: CLIPS_FOLDER,
      });

      setVideosPath(vid.filter((v) => v.isFile));
      console.log(vid);
    };
    getVideosPath();
  }, []);
  return (
    <>
      <h2 className="mt-8 font-semibold">{heading}</h2>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-lg"
      >
        <CarouselContent>
          {videosPath.map((videoPath, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Clip vidName={videoPath.name} />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
};

export default ClipsCarousel;
