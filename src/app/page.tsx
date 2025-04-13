"use client";

import { PanicButton } from "@/components/PanicButton";
import { EmergencyDisplay } from "@/components/EmergencyDisplay";
import { SettingsButton } from "@/components/SettingsButton";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActiveMonitoringButton } from "@/components/ActiveMonitoringButton";

export default function Home() {
  const searchParams = useSearchParams();
  const emergency = searchParams.get("emergency") === "true";

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeMonitoring, setActiveMonitoring] = useState(false); // State for active monitoring

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

  const toggleActiveMonitoring = () => {
    setActiveMonitoring(!activeMonitoring);
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-start bg-background text-foreground">
      <Toaster />
      <div className="absolute top-4 left-4">
        <SettingsButton updateSoundEnabled={updateSoundEnabled} />
      </div>

      {/* App Logo Placeholder */}
      <div className="mt-8 mb-4">
        {/* Replace with your app logo */}
        <img src="https://picsum.photos/100/80" alt="Guardian Angel Logo" className="h-20" />
      </div>

      {emergency && <EmergencyDisplay />}

      <PanicButton />

      <ActiveMonitoringButton
        activeMonitoring={activeMonitoring}
        toggleActiveMonitoring={toggleActiveMonitoring}
      />

      {/* Advertisement Placeholder */}
      <div className="mt-auto mb-4">
        {/* Replace with your advertisement content */}
        <img src="https://picsum.photos/320/50" alt="Advertisement" className="w-80 rounded-md" />
      </div>
    </div>
  );
}

