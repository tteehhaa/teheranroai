"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics/client";

/** Starts the first-party visit collector (lib/analytics/client.ts). Renders nothing. */
export function Analytics() {
  useEffect(() => initAnalytics(), []);
  return null;
}
