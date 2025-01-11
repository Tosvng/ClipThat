import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";

export const AppContextMenu = ({ children }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-charcoal border-gold/20">
        <ContextMenuItem className="text-cream hover:text-gold">
          Cut
        </ContextMenuItem>
        <ContextMenuItem className="text-cream hover:text-gold">
          Copy
        </ContextMenuItem>
        <ContextMenuItem className="text-cream hover:text-gold">
          Paste
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
