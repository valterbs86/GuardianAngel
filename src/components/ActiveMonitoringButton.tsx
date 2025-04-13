"use client";

import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";

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
      {activeMonitoring ? (
        <>
          <Square className="mr-2 h-4 w-4" />
          Disable Monitoring
        </>
      ) : (
        <>
          <Play className="mr-2 h-4 w-4" />
          Enable Active Monitoring
        </>
      )}
    </Button>
  );
}
