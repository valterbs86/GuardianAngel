"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { assessSituation } from "@/ai/flows/assess-situation";
import { useEffect } from "react";
import { initializeButtonSequenceDetection, setPanicCallback } from "@/services/buttonSequenceService";

export function PanicButton() {
  const { toast } = useToast();

  const triggerEmergencySequence = async () => {
    toast({
      title: "Emergency sequence initiated!",
      description: "Recording video and audio and assessing the situation...",
    });

    // Simulate recording video and audio
    const videoUrl = "https://example.com/simulated-video.mp4";
    const audioUrl = "https://example.com/simulated-audio.mp3";

    try {
      const assessment = await assessSituation({ videoUrl, audioUrl });
      toast({
        title: "Situation assessed!",
        description: `Severity: ${assessment.severity}. Summary: ${assessment.summary}`,
      });
      // TODO: Integrate with services to send data to emergency contacts
    } catch (error: any) {
      toast({
        title: "Error assessing situation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    initializeButtonSequenceDetection();
    setPanicCallback(triggerEmergencySequence);

    // Cleanup function to remove the callback
    return () => {
      setPanicCallback(null);
    };
  }, []);

  return (
    <Button
      variant="default"
      className="bg-primary text-background text-4xl font-bold rounded-full p-12 shadow-lg hover:bg-accent hover:text-card"
      onClick={triggerEmergencySequence}
    >
      Panic Button
    </Button>
  );
}
