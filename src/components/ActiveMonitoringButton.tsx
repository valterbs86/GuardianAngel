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
      variant="default"
      className={`bg-primary text-background text-4xl font-bold rounded-full p-12 shadow-lg hover:bg-accent hover:text-card ${className ?? ''}`}
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

