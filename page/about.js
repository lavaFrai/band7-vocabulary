import { AppGesture } from "../../lib/AppGesture";
import { BaseAboutScreen } from "../../lib/BaseAboutScreen";


class AboutScreen extends BaseAboutScreen {
  appId = 1034016522;
  appName = "Vocabulary";
  version = "v2023.05.17";

  infoRows = [
    ["lava_frai", "Developer"],
    ["lavafrai/band7-vocabulary", "GitHub"]
  ];
}

let __$$app$$__ = __$$hmAppManager$$__.currentApp;
let __$$module$$__ = __$$app$$__.current;
__$$module$$__.module = DeviceRuntimeCore.Page({
  onInit(p) {
    AppGesture.withYellowWorkaround("left", {
      appid: 1034016522,
      url: "page/about",
    });
    AppGesture.init();

    new AboutScreen().start();
  }
});