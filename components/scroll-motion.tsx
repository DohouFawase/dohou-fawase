"use client";

import { useEffect } from "react";

export default function ScrollMotion() {
  useEffect(() => {
    const targets = new Set<Element>();
    let observer: IntersectionObserver | undefined;

    const observeRevealElements = (root: ParentNode) => {
      const elements = Array.from(root.querySelectorAll("[data-reveal]"));
      if (root instanceof Element && root.matches("[data-reveal]")) {
        elements.unshift(root);
      }

      elements.forEach((element) => {
        if (targets.has(element)) return;
        targets.add(element);
        observer?.observe(element);
      });
    };

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.setAttribute("data-revealed", "true");
            observer?.unobserve(entry.target);
            targets.delete(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
      );

      document.documentElement.dataset.motionReady = "true";
      observeRevealElements(document);

      const mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) observeRevealElements(node);
          });
        });
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        observer?.disconnect();
        mutationObserver.disconnect();
        delete document.documentElement.dataset.motionReady;
        document.querySelectorAll("[data-revealed]").forEach((element) => {
          element.removeAttribute("data-revealed");
        });
      };
    }

    return () => {
      observer?.disconnect();
    };
  }, []);

  return null;
}
