"use client";

import { useState, useEffect } from "react";

export function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    // Load alert history from local storage on component mount
    const storedAlerts = localStorage.getItem("alertHistory");
    if (storedAlerts) {
      setAlerts(JSON.parse(storedAlerts));
    }
  }, []);

  return (
    <div className="settings-panel">
      <h2>Alert History</h2>

      {alerts.map((alert, index) => (
        <div
          key={index}
          className="alert-history-item"
          onClick={() => setSelectedAlert(alert)}
        >
          <h4>
            {alert.date} - {alert.time}
          </h4>
          <p>Geolocation: {alert.gpsCoordinates}</p>
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

