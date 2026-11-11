export const removeElements = (selector: string): void => {
  document.querySelectorAll(selector).forEach((element) => {
    element.remove();
  });
};

export function observeElements(
    selector: string,
    callback: (element: Element) => void,
): MutationObserver {
    const process = (root: ParentNode) => {
        root.querySelectorAll(selector).forEach(callback);
    }

    process(document);

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof Element)) return;

                if (node.matches(selector)) {
                    callback(node);
                }

                process(node);
            });
        }
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    return observer;
}