"use client";
import { useSyncExternalStore } from "react";
function subscribe(notify: () => void) {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => { window.removeEventListener("online", notify); window.removeEventListener("offline", notify); };
}
export function ConnectionStatus() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  return online ? null : <aside className="connection-status" role="status">You’re offline. Loaded demo controls can still work; opening another page may require a connection. Your bag stays in this browser.</aside>;
}
