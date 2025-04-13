"use client";

import { PanicButton } from "@/components/PanicButton";
import { EmergencyDisplay } from "@/components/EmergencyDisplay";
import { SettingsButton } from "@/components/SettingsButton";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ActiveMonitoringButton } from "@/components/ActiveMonitoringButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// import GuardianAngelLogo from "@/components/GuardianAngelLogo";

export default function Home() {
  const searchParams = useSearchParams();
  const emergency = searchParams.get("emergency") === "true";

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeMonitoringState, setActiveMonitoringState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('activeMonitoring');
      return storedValue === 'true';
    }
    return false;
  });

  const activeMonitoring = activeMonitoringState;

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
    if (typeof window !== 'undefined') {
      const storedSoundEnabled = localStorage.getItem("soundEnabled");
      if (storedSoundEnabled) {
        setSoundEnabled(JSON.parse(storedSoundEnabled));
      }
    }
  }, []);

  // Function to update soundEnabled state and store it in localStorage
  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem("soundEnabled", JSON.stringify(enabled));
    }
  };

  const toggleActiveMonitoring = () => {
    const newState = !activeMonitoring;
    setActiveMonitoringState(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMonitoring', newState.toString());
    }
  };

    // Retrieve user settings from local storage
    const [name, setName] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("name") || "";
        }
        return "";
    });
    const [age, setAge] = useState(() =>  {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("age") || "";
        }
        return "";
    });
    const [address, setAddress] = useState(() =>  {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("address") || "";
        }
        return "";
    });
    const [bloodType, setBloodType] = useState(() =>  {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("bloodType") || "";
        }
        return "";
    });
    const [medicalConditions, setMedicalConditions] = useState(() =>  {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("medicalConditions") || "";
        }
        return "";
    });
    const [vehicleInformation, setVehicleInformation] = useState(() =>  {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("vehicleInformation") || "";
        }
        return "";
    });

    const [showName, setShowName] = useState(() => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem("showName") === 'true';
      }
      return false;
  });
  const [showAge, setShowAge] = useState(() =>  {
      if (typeof window !== 'undefined') {
          return localStorage.getItem("showAge") === 'true';
      }
      return false;
  });
  const [showAddress, setShowAddress] = useState(() =>  {
      if (typeof window !== 'undefined') {
          return localStorage.getItem("showAddress") === 'true';
      }
      return false;
  });
  const [showBloodType, setShowBloodType] = useState(() =>  {
      if (typeof window !== 'undefined') {
          return localStorage.getItem("showBloodType") === 'true';
      }
      return false;
  });
  const [showMedicalConditions, setShowMedicalConditions] = useState(() =>  {
      if (typeof window !== 'undefined') {
          return localStorage.getItem("showMedicalConditions") === 'true';
      }
      return false;
  });
  const [showVehicleInformation, setShowVehicleInformation] = useState(() =>  {
      if (typeof window !== 'undefined') {
          return localStorage.getItem("showVehicleInformation") === 'true';
      }
      return false;
  });


  return (
    <div className="flex flex-col h-screen w-screen items-center justify-start bg-background text-foreground">
      <Toaster />

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

      <div className="flex flex-col items-center justify-center space-y-4">
        <ActiveMonitoringButton
          activeMonitoring={activeMonitoring}
          toggleActiveMonitoring={toggleActiveMonitoring}
          className="w-72"
        />
        <PanicButton className="w-72" />
          <Dialog>
              <DialogTrigger asChild>
                  <Button variant="outline">Show Saved Info</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                      <DialogTitle>Saved User Information</DialogTitle>
                      <DialogDescription>
                          This information is saved locally.
                      </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="name" className="text-right font-medium">
                              Name
                          </label>
                          <Input type="text" id="name" value={name} readOnly className="col-span-3" />
                            <Switch id="showName" checked={showName} disabled />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="age" className="text-right font-medium">
                              Age
                          </label>
                          <Input type="text" id="age" value={age} readOnly className="col-span-3" />
                            <Switch id="showAge" checked={showAge} disabled />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="address" className="text-right font-medium">
                              Address
                          </label>
                          <Input type="text" id="address" value={address} readOnly className="col-span-3" />
                            <Switch id="showAddress" checked={showAddress} disabled />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="bloodType" className="text-right font-medium">
                              Blood Type
                          </label>
                          <Input type="text" id="bloodType" value={bloodType} readOnly className="col-span-3" />
                          <Switch id="showBloodType" checked={showBloodType} disabled />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="medicalConditions" className="text-right font-medium">
                              Medical Conditions
                          </label>
                          <Input type="text" id="medicalConditions" value={medicalConditions} readOnly className="col-span-3" />
                            <Switch id="showMedicalConditions" checked={showMedicalConditions} disabled />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                          <label htmlFor="vehicleInformation" className="text-right font-medium">
                              Vehicle Information
                          </label>
                          <Input type="text" id="vehicleInformation" value={vehicleInformation} readOnly className="col-span-3" />
                            <Switch id="showVehicleInformation" checked={showVehicleInformation} disabled />
                      </div>
                  </div>
              </DialogContent>
          </Dialog>
      </div>

      {/* Advertisement Placeholder */}
      <div className="mt-auto mb-4">
        {/* Replace with your advertisement content */}
        <img src="/Advert logo.JPG" alt="Prosegur Alarms Advertisement" className="w-80 rounded-md" />
      </div>
      <div className="absolute top-4 right-4">
        <SettingsButton updateSoundEnabled={updateSoundEnabled} />
      </div>
    </div>
  );
}







