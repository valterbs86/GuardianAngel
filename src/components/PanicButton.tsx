"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assessSituation } from "@/ai/flows/assess-situation";
import { useEffect } from "react";
import { setPanicCallback } from "@/services/buttonSequenceService";

interface PanicButtonProps {
    className?: string;
    triggerEmergencySequence: () => void;
}

export function PanicButton({ className, triggerEmergencySequence }: PanicButtonProps) {
  const { toast } = useToast();

  useEffect(() => {
    setPanicCallback(triggerEmergencySequence);

    // Cleanup function to remove the callback
    return () => {
      setPanicCallback(null);
    };
  }, [triggerEmergencySequence]);

  return (
    <Button
      variant="default"
      className={`bg-primary text-background text-4xl font-bold rounded-full p-12 shadow-lg hover:bg-accent hover:text-card ${className ?? ''}`}
      onClick={triggerEmergencySequence}
    >
      Panic Button
    </Button>
  );
}

