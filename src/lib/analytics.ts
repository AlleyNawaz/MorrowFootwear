import type { AnalyticsEvent } from "./types";

type Listener = (event: AnalyticsEvent) => void;

class AnalyticsBus {
  private listeners: Listener[] = [];
  private history: AnalyticsEvent[] = [];

  track(event: AnalyticsEvent): void {
    // No collection or external dispatch until an approved consent-aware adapter exists.
    void event;
  }

  clear(): void {
    this.history = [];
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getHistory(): readonly AnalyticsEvent[] {
    return this.history;
  }
}

export const analytics = new AnalyticsBus();
