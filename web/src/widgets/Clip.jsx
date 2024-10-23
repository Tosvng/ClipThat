import { AspectRatio } from "@/components/ui/aspect-ratio";

const Clip = () => {
  return (
    <div>
      <div className="w-[450px]">
        <AspectRatio ratio={16 / 9}>
          <img src="..." alt="Image" className="rounded-md object-cover" />
        </AspectRatio>
      </div>
    </div>
  );
};

export default Clip;
