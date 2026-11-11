import { observeElements } from "./lib/dom/dom-manipulation";
import { restrictionStorage } from "./lib/storage/restriction";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  async main(ctx) {
    console.log("Hello content.");
    const storage = await restrictionStorage.getValue();

    if (!storage) {
      console.error("Failed to retrieve storage values.");
      return;
    }

    const youtubeRestriction = storage.youtube;
    console.log("YouTube Restriction:", youtubeRestriction);

    ctx.addEventListener(window, "wxt:locationchange", () => {
      console.log("Location changed:", location.href);
    });

    const observer = observeElements(
      'ytd-rich-section-renderer[page-subtype="home"]',
      (element) => {
        element.remove();
        console.log("Removed YouTube Shorts section:", element);
      },
    );

    ctx.addEventListener(window, "pagehide", () => {
      observer.disconnect();
      console.log("Observer disconnected on pagehide.");
    });
  },
});
