import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MenuBar = () => {
  return (
    <div className="h-8 bg-charcoal/80 border-b border-gold/20 flex items-center px-2 text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-7 px-2 text-cream hover:text-gold"
          >
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-charcoal border-gold/20">
          <DropdownMenuItem className="text-cream hover:text-gold">
            New Clip (Ctrl+N)
          </DropdownMenuItem>
          <DropdownMenuItem className="text-cream hover:text-gold">
            Open Video (Ctrl+O)
          </DropdownMenuItem>
          <DropdownMenuItem className="text-cream hover:text-gold">
            Save (Ctrl+S)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-7 px-2 text-cream hover:text-gold"
          >
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-charcoal border-gold/20">
          <DropdownMenuItem className="text-cream hover:text-gold">
            Documentation
          </DropdownMenuItem>
          <DropdownMenuItem className="text-cream hover:text-gold">
            Check for Updates
          </DropdownMenuItem>
          <DropdownMenuItem className="text-cream hover:text-gold">
            About ClipThat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MenuBar;
