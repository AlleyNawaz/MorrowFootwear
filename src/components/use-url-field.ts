"use client";
import { useSyncExternalStore } from "react";
const event = "morrow:query-changed";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(event, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(event, callback);
  };
}
export function useUrlField(
  key: string,
  fallback: string,
): [string, (value: string) => void] {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const value = new URLSearchParams(search).get(key) ?? fallback;
  function setValue(next: string) {
    const url = new URL(window.location.href);
    if (next === fallback || !next) url.searchParams.delete(key);
    else url.searchParams.set(key, next);
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    window.dispatchEvent(new Event(event));
  }
  return [value, setValue];
}
