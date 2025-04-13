
"use client";

import { useState } from "react";

const dummyAlerts = [
  {
    id: 1,
    date: "2024-07-15",
    time: "10:30 AM",
    geolocation: "34.0522, -118.2437",
    notificationsSent: "SMS, Email",
    recordings: "video.mp4, audio.mp3",
  },
  {
    id: 2,
    date: "2024-07-14",
    time: "05:45 PM",
    geolocation: "34.0522, -118.2437",
    notificationsSent: "SMS",
    recordings: "audio.mp3",
  },
];

export function AlertHistory() {
  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <div className="settings-panel">
      <h2>Alert History</h2>

      {dummyAlerts.map((alert) => (
        <div
          key={alert.id}
          className="alert-history-item"
          onClick={() => setSelectedAlert(alert)}
        >
          <h4>
            {alert.date} - {alert.time}
          </h4>
          <p>Geolocation: {alert.geolocation}</p>
        </div>
      ))}

      {selectedAlert && (
        <div>
          <h3>Alert Details</h3>
          <p>Date: {selectedAlert.date}</p>
          <p>Time: {selectedAlert.time}</p>
          <p>Geolocation: {selectedAlert.geolocation}</p>
          <p>Notifications Sent: {selectedAlert.notificationsSent}</p>
          <p>Recordings: {selectedAlert.recordings}</p>
        </div>
      )}
    </div>
  );
}
