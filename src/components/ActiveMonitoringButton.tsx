"use client";

import { Button } from "@/components/ui/button";

interface ActiveMonitoringButtonProps {
  activeMonitoring: boolean;
  toggleActiveMonitoring: () => void;
}

export function ActiveMonitoringButton({
  activeMonitoring,
  toggleActiveMonitoring,
}: ActiveMonitoringButtonProps) {
  return (
    <Button
      variant="outline"
      className="mt-4"
      onClick={toggleActiveMonitoring}
    >
      {activeMonitoring ? "Disable Monitoring" : "Enable Active Monitoring"}
    </Button>
  );
}
