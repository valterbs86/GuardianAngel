"use client";

import { PanicButton } from "@/components/PanicButton";
import { EmergencyDisplay } from "@/components/EmergencyDisplay";
import { SettingsButton } from "@/components/SettingsButton";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActiveMonitoringButton } from "@/components/ActiveMonitoringButton";
// import GuardianAngelLogo from "@/components/GuardianAngelLogo";

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
        <img
            src="/GA logo.JPG" // Path to your logo image
            alt="Guardian Angel Logo"
            className="h-20"
          />
      </div>

      {emergency && <EmergencyDisplay />}

      <div className="flex flex-row items-center justify-center space-x-4">
        <PanicButton className="w-64 h-64" />
        <ActiveMonitoringButton
          activeMonitoring={activeMonitoring}
          toggleActiveMonitoring={toggleActiveMonitoring}
          className="w-64 h-64"
        />
      </div>

      {/* Advertisement Placeholder */}
      <div className="mt-auto mb-4">
        {/* Replace with your advertisement content */}
        <img src="/advert_logo.JPG" alt="Prosegur Alarms Advertisement" className="w-80 rounded-md" />
      </div>
    </div>
  );
}
