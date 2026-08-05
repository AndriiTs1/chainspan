"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { getFocusableElements, useDismissableLayer } from "@/hooks/use-dismissable-layer";

export type SelectorOption<T extends string> = {
  value: T;
  label: ReactNode;
  description?: ReactNode;
};

type SelectorProps<T extends string> = {
  id: string;
  label: string;
  options: readonly SelectorOption<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
};

// A button-triggered WAI-ARIA listbox (not role="menu" - this picks a value,
// it doesn't run actions; not a full combobox - there's no text input).
// Options are real, individually focusable buttons (not aria-activedescendant
// with a single roving tabindex) so arrow-key navigation can reuse the exact
// getFocusableElements() + index-walking technique wallet-control.tsx already
// uses for its own dropdown, instead of inventing a second technique.
export function Selector<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
  isOpen,
  onOpenChange,
  disabled,
  placeholder = "Select...",
}: SelectorProps<T>) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const listboxId = `${id}-listbox`;

  function close() {
    onOpenChange(false);
  }

  useDismissableLayer({
    isOpen,
    onDismiss: close,
    containerRef: popoverRef,
    triggerRef,
    trapFocus: false,
  });

  // Focus the currently selected option (not just the first focusable one)
  // when opening, matching native <select> behavior. Declared after
  // useDismissableLayer so this effect's focus() call runs later in the same
  // commit and wins.
  useEffect(() => {
    if (!isOpen) return;

    const container = popoverRef.current;
    if (!container) return;

    const selected = container.querySelector<HTMLElement>('[data-selected="true"]');
    const focusable = getFocusableElements(container);
    (selected ?? focusable[0])?.focus();
  }, [isOpen]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onOpenChange(true);
    }
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const container = popoverRef.current;
    if (!container) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (currentIndex + delta + focusable.length) % focusable.length;

      focusable[nextIndex]?.focus();
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) return;

      const target = event.key === "Home" ? focusable[0] : focusable[focusable.length - 1];
      target?.focus();
    }
  }

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => onOpenChange(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-white transition hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-zinc-500">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          aria-hidden="true"
          className={[
            "size-4 shrink-0 text-zinc-500 transition-transform duration-150",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={popoverRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute top-full left-0 z-40 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-blue-300/10 bg-[#070b14]/98 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected ? "true" : undefined}
                  onClick={() => {
                    onChange(option.value);
                    close();
                    triggerRef.current?.focus();
                  }}
                  className={[
                    "flex min-h-11 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition",
                    isSelected
                      ? "bg-blue-400/10 text-white"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">{option.label}</span>

                    {option.description ? (
                      <span className="mt-0.5 block truncate text-xs text-zinc-500">
                        {option.description}
                      </span>
                    ) : null}
                  </span>

                  {isSelected ? (
                    <Check aria-hidden="true" className="size-4 shrink-0 text-blue-300" />
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
