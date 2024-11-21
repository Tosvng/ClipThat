import { check } from "@tauri-apps/plugin-updater";
import { ask, message } from "@tauri-apps/plugin-dialog";
import { relaunch } from "@tauri-apps/plugin-process";
import TabLayout from "./layout/TabLayout";

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
        // Restart the app after the update is installed by calling the Tauri command that handles restart for your app
        // It is good practice to shut down any background processes gracefully before restarting
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
    <div className="min-h-screen">
      <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-gray-700 bg-blend-multiply p-4">
        <div className="px-4 mx-auto max-w-screen-xl text-center py-4">
          <h1 className="text-center mb-4 text-4xl font-semibold tracking-tight leading-none text-gray-50 md:text-5xl lg:text-6xl ">
            Clip That
          </h1>
        </div>
      </section>
      <div className="max-w-4xl mx-auto p-2 space-y-8">
        {/* <Instructions /> */}
        <TabLayout />
        {/* <ClipsCarousel /> */}
      </div>
    </div>
  );
}

export default App;
