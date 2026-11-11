type ElementRule = {
  selector: string;
  callback: (element: Element) => void;
};

export function observeElements(rules: ElementRule[]): MutationObserver {
  for (const { selector, callback } of rules) {
    document.querySelectorAll(selector).forEach(callback);
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;

        for (const { selector, callback } of rules) {
          // Check if the added node matches the selector or contains matching elements
          if (node.matches(selector)) callback(node);

          // Check for matching elements within the added node
          node.querySelectorAll(selector).forEach(callback);
        }
      });
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  return observer;
}
