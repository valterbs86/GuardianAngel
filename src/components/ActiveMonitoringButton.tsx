"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

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
      className={`flex flex-col items-center justify-center bg-background text-primary text-2xl font-bold rounded-full p-6 shadow-lg hover:bg-accent hover:text-accent-foreground ${className ?? ''}`}
      onClick={toggleActiveMonitoring}
    >
      {activeMonitoring ? (
        <>
          <Pause className="h-12 w-12 mb-2 text-red-500" />
          Disable Monitoring
        </>
      ) : (
        <>
          <Play className="h-12 w-12 mb-2 text-green-500" />
          Enable Active Monitoring
        </>
      )}
    </Button>
  );
}
