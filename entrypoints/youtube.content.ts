import { observeElements } from "./lib/dom/dom-manipulation";
import { restrictionStorage } from "./lib/storage/restriction";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  async main(ctx) {
    const storage = await restrictionStorage.getValue();

    if (!storage) {
      console.error("Failed to retrieve storage values.");
      return;
    }

    const youtubeRestriction = storage.youtube;

    ctx.addEventListener(window, "wxt:locationchange", (event) => {
      if (youtubeRestriction && event.newUrl.pathname.startsWith("/shorts/")) {
        window.location.href = "https://www.youtube.com/";
      }
    });

    if (youtubeRestriction) {
      const removeElements = [
        {'selector': 'ytd-rich-section-renderer[page-subtype="home"]', 'callback': (element: Element) => element.remove()},
        {'selector': 'yt-horizontal-list-renderer', 'callback': (element: Element) => element.remove()}
      ];

      const observer = observeElements(removeElements);

      ctx.addEventListener(window, "pagehide", () => {
        observer.disconnect();
      });
    }
  },
});
