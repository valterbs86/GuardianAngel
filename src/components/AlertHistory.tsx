"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    // Load alert history from local storage on component mount
    const storedAlerts = localStorage.getItem("alertHistory");
    if (storedAlerts) {
      const parsedAlerts = JSON.parse(storedAlerts);
      // Sort alerts by date and time in descending order
      const sortedAlerts = parsedAlerts.sort((a: any, b: any) => {
        const dateA = new Date(a.date + " " + a.time);
        const dateB = new Date(b.date + " " + b.time);
        return dateB.getTime() - dateA.getTime();
       });
      setAlerts(sortedAlerts);
    } else {
      setAlerts([]); // Ensure alerts is an empty array if no data is found
    }
  };

  const deleteAllAlerts = () => {
    localStorage.removeItem("alertHistory");
    setAlerts([]);
  };

  const deleteAlert = (index: number) => {
    const storedAlerts = localStorage.getItem("alertHistory");
    if (storedAlerts) {
      const parsedAlerts = JSON.parse(storedAlerts);
      parsedAlerts.splice(index, 1);
      localStorage.setItem("alertHistory", JSON.stringify(parsedAlerts));
      loadAlerts(); // Reload alerts to update the state
    }
  };

  return (
    <div className="settings-panel">
      <h2>Alert History</h2>

      <Button
        variant="destructive"
        onClick={deleteAllAlerts}
        className="mb-4"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete All Alert History
      </Button>

      {alerts.map((alert: any, index: number) => (
        <div
          key={index}
          className="alert-history-item"
          onClick={() => setSelectedAlert(alert)}
        >
          <h4>
            {alert.date} - {alert.time}
          </h4>
          <p>Geolocation: {alert.gpsCoordinates}</p>
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation(); // Prevent alert selection when deleting
              deleteAlert(index);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {selectedAlert && (
        <div>
          <h3>Alert Details</h3>
          <p>Date: {selectedAlert.date}</p>
          <p>Time: {selectedAlert.time}</p>
          <p>Geolocation: {selectedAlert.gpsCoordinates}</p>
          <p>Front Camera Picture: {selectedAlert.frontCameraPicture}</p>
          <p>Rear Camera Picture: {selectedAlert.rearCameraPicture}</p>
          <p>Video URL: {selectedAlert.videoUrl}</p>
        </div>
      )}
    </div>
  );
}

