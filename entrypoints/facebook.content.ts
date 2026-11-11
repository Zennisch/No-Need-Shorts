import { restrictionStorage } from "./lib/storage/restriction";

export default defineContentScript({
    matches: ['*://*.facebook.com/*'],
    async main(ctx) {
        const storage = await restrictionStorage.getValue();
        const facebookRestriction = storage.facebook;

        ctx.addEventListener(window, 'wxt:locationchange', (event) => {
            if (facebookRestriction && event.newUrl.pathname.startsWith('/reel/')) {
                window.location.href = 'https://www.facebook.com/';
            }
        });

        // No DOM manipulation is needed for Facebook as of now
    }
})