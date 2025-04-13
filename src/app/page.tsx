"use client";

import { PanicButton } from "@/components/PanicButton";
import { EmergencyDisplay } from "@/components/EmergencyDisplay";
import { SettingsButton } from "@/components/SettingsButton";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { InitializeButtonSequence } from "@/components/InitializeButtonSequence";

export default function Home() {
  const searchParams = useSearchParams();
  const emergency = searchParams.get("emergency") === "true";

  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (emergency && soundEnabled) {
      const audio = new Audio("/ambulance.mp3"); // Replace with your sound file
      audio.loop = true;
      audio.play();

      return () => {
        audio.pause();
      };
    }
  }, [emergency, soundEnabled]);

  useEffect(() => {
    // Retrieve soundEnabled from localStorage
    const storedSoundEnabled = localStorage.getItem("soundEnabled");
    if (storedSoundEnabled) {
      setSoundEnabled(JSON.parse(storedSoundEnabled));
    }
  }, []);

  // Function to update soundEnabled state and store it in localStorage
  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem("soundEnabled", JSON.stringify(enabled));
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-background text-foreground">
      <Toaster />
      <div className="absolute top-4 left-4">
        <SettingsButton updateSoundEnabled={updateSoundEnabled} />
      </div>
      {emergency && <EmergencyDisplay />}
      <PanicButton />
      <InitializeButtonSequence />
    </div>
  );
}
