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
      variant="ghost"
      className={`flex flex-col items-center justify-center text-2xl font-bold rounded-md p-6 shadow-lg ${
        activeMonitoring
          ? 'text-red-500 border-red-500 hover:bg-red-500 hover:text-background'
          : 'text-green-500 border-green-500 hover:bg-green-500 hover:text-background'
      } border-2 bg-transparent ${className ?? ''}`}
      onClick={toggleActiveMonitoring}
    >
      {activeMonitoring ? (
        <>
          <Pause className="h-12 w-12 mb-2" />
          Disable Monitoring
        </>
      ) : (
        <>
          <Play className="h-12 w-12 mb-2" />
          Enable Active Monitoring
        </>
      )}
    </Button>
  );
}
