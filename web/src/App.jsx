import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import TabLayout from "./layout/TabLayout";
import ProtectedRoute from "./widgets/ProtectedRoute";
import TitleBar from "./components/TitleBar";
import MenuBar from "./components/MenuBar";
import StatusBar from "./components/StatusBar";
import { Toaster } from "sonner";
// Import your other components

function App() {
  async function checkForAppUpdates(onUserClick) {
    const update = await check();
    if (update === null) {
      // await message("Failed to check for updates.\nPlease try again later.", {
      //   title: "Error",
      //   kind: "error",
      //   okLabel: "OK",
      // });
      return;
    } else if (update?.available) {
      const yes = await ask(
        `Update to ${update.version} is available!\n\nRelease notes: ${update.body}`,
        {
          title: "Update Available",
          kind: "info",
          okLabel: "Update",
          cancelLabel: "Cancel",
        }
      );
      if (yes) {
        await update.downloadAndInstall();
        // Restart the app after the update is installed by calling the Tauri command
        //that handles restart for your app
        // It is good practice to shut down any background processes gracefully before
        //restarting
        // As an alternative, you could ask the user to restart the app manually
        await relaunch();
      }
    } else if (onUserClick) {
      await message("You are on the latest version. Stay awesome!", {
        title: "No Update Available",
        kind: "info",
        okLabel: "OK",
      });
    }
  }
  checkForAppUpdates(false);
  return (
    <div className="flex flex-col h-screen">
      <Toaster richColors position="top-right" />
      <TitleBar />
      {/* <MenuBar /> */}
      <div className="flex-1 overflow-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            {/* Protect your feature routes */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <TabLayout />
                </ProtectedRoute>
              }
            />
            {/* Add more protected routes as needed */}
          </Routes>
        </BrowserRouter>
      </div>
      <StatusBar />
    </div>
  );
}

export default App;
