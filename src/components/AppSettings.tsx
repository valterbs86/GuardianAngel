"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AppSettingsProps {
  updateSoundEnabled: (enabled: boolean) => void;
}

export function AppSettings({ updateSoundEnabled }: AppSettingsProps) {
  const [shareLocation, setShareLocation] = useState(true);
  const [sendNotifications, setSendNotifications] = useState(true);
  const [triggerSoundAlarm, setTriggerSoundAlarm] = useState(true);
  const [showInfoOnScreen, setShowInfoOnScreen] = useState(true);
  const [emergencyUnlockPin, setEmergencyUnlockPin] = useState(true);
  const [cloudBackup, setCloudBackup] = useState(true);

  useEffect(() => {
    // Retrieve triggerSoundAlarm from localStorage
    const storedTriggerSoundAlarm = localStorage.getItem("triggerSoundAlarm");
    if (storedTriggerSoundAlarm) {
      setTriggerSoundAlarm(JSON.parse(storedTriggerSoundAlarm));
    }
  }, []);

  // Function to update triggerSoundAlarm state and store it in localStorage
  const updateTriggerSoundAlarm = (enabled: boolean) => {
    setTriggerSoundAlarm(enabled);
    localStorage.setItem("triggerSoundAlarm", JSON.stringify(enabled));
    updateSoundEnabled(enabled);
  };

  return (
    <div className="settings-panel">
      <h2>App Settings</h2>

      <div className="app-setting">
        <Label htmlFor="shareLocation">Share Location During Emergency Event</Label>
        <Switch
          id="shareLocation"
          checked={shareLocation}
          onCheckedChange={(checked) => setShareLocation(checked)}
        />
      </div>

      <div className="app-setting">
        <Label htmlFor="sendNotifications">Send Notifications</Label>
        <Switch
          id="sendNotifications"
          checked={sendNotifications}
          onCheckedChange={(checked) => setSendNotifications(checked)}
        />
      </div>

      <div className="app-setting">
        <Label htmlFor="triggerSoundAlarm">Trigger Sound Alarm</Label>
        <Switch
          id="triggerSoundAlarm"
          checked={triggerSoundAlarm}
          onCheckedChange={(checked) => updateTriggerSoundAlarm(checked)}
        />
      </div>

      <div className="app-setting">
        <Label htmlFor="showInfoOnScreen">Show Info on the Screen</Label>
        <Switch
          id="showInfoOnScreen"
          checked={showInfoOnScreen}
          onCheckedChange={(checked) => setShowInfoOnScreen(checked)}
        />
      </div>

      <div className="app-setting">
        <Label htmlFor="emergencyUnlockPin">Emergency Event Unlock Pin-Code</Label>
        <Switch
          id="emergencyUnlockPin"
          checked={emergencyUnlockPin}
          onCheckedChange={(checked) => setEmergencyUnlockPin(checked)}
        />
      </div>

      <div className="app-setting">
        <Label htmlFor="cloudBackup">Cloud Backup</Label>
        <Switch
          id="cloudBackup"
          checked={cloudBackup}
          onCheckedChange={(checked) => setCloudBackup(checked)}
        />
      </div>
    </div>
  );
}

