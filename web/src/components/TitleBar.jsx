// import { appWindow } from '@tauri-apps/api/window';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from "./ui/button";
import clipThatLogo from "../assets/clip_that_logo.png";

const TitleBar = () => {
  const appWindow = getCurrentWindow();
  return (
    <div
      data-tauri-drag-region
      className="h-10 flex justify-between items-center bg-charcoal border-b border-gold/20 select-none"
    >
      <div className="flex items-center px-4">
        <img src={clipThatLogo} alt="ClipThat" className="h-6 w-6 mr-2" />
        <span className="text-gold font-semibold">ClipThat</span>
      </div>

      <div className="flex">
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-none hover:bg-gold/10"
          onClick={() => appWindow.minimize()}
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <path fill="currentColor" d="M0 0h10v1H0z" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          className="h-10 w-10 rounded-none hover:bg-gold/10"
          onClick={() => appWindow.toggleMaximize()}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path fill="currentColor" d="M0 0h10v10H0V0zm1 1v8h8V1H1z" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          className="h-10 w-10 rounded-none hover:bg-red-500 hover:text-white"
          onClick={() => appWindow.close()}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              fill="currentColor"
              d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default TitleBar;
