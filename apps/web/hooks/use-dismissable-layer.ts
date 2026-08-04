"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusableElements(
  container: HTMLElement | null,
): HTMLElement[] {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.offsetParent !== null);
}

type UseDismissableLayerOptions<
  TContainer extends HTMLElement,
  TTrigger extends HTMLElement,
> = {
  isOpen: boolean;
  onDismiss: () => void;
  containerRef: RefObject<TContainer | null>;
  triggerRef: RefObject<TTrigger | null>;
  /**
   * Modal-style layers trap Tab/Shift+Tab inside the container so background
   * content is never keyboard-reachable while open. Non-modal layers (e.g. a
   * dropdown) leave Tab native and rely on the focusout dismissal below.
   */
  trapFocus?: boolean;
};

export function useDismissableLayer<
  TContainer extends HTMLElement = HTMLElement,
  TTrigger extends HTMLElement = HTMLElement,
>({
  isOpen,
  onDismiss,
  containerRef,
  triggerRef,
  trapFocus = false,
}: UseDismissableLayerOptions<TContainer, TTrigger>) {
  // Kept in sync every render (not just on isOpen changes) so Escape/outside-
  // click/focusout always call the latest onDismiss - e.g. one that still
  // honors a pending-connection guard - without re-running the open/close
  // effect below on every unrelated re-render. Written from an effect (not
  // during render) per react-hooks/refs.
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    const trigger = triggerRef.current;
    const focusable = getFocusableElements(container);
    (focusable[0] ?? container)?.focus();

    function isInsideLayer(node: Node) {
      return Boolean(container?.contains(node)) || Boolean(trigger?.contains(node));
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && !isInsideLayer(target)) {
        onDismissRef.current();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onDismissRef.current();
        return;
      }

      if (!trapFocus || event.key !== "Tab" || !container) return;

      const focusableNow = getFocusableElements(container);
      if (focusableNow.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableNow[0];
      const last = focusableNow[focusableNow.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    function handleFocusOut(event: FocusEvent) {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && !isInsideLayer(nextTarget)) {
        onDismissRef.current();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    container?.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      container?.removeEventListener("focusout", handleFocusOut);
      trigger?.focus();
    };
  }, [isOpen, trapFocus, containerRef, triggerRef]);
}
