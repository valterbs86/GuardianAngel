"use client";

import { Button } from "@/components/ui/button";

interface ActiveMonitoringButtonProps {
  activeMonitoring: boolean;
  toggleActiveMonitoring: () => void;
  className?: string; // Make className optional
}

export function ActiveMonitoringButton({
  activeMonitoring,
  toggleActiveMonitoring,
  className
}: ActiveMonitoringButtonProps) {
  return (
    <Button
      variant="outline"
      className={className}
      onClick={toggleActiveMonitoring}
    >
      {activeMonitoring ? "Disable Monitoring" : "Enable Active Monitoring"}
    </Button>
  );
}
