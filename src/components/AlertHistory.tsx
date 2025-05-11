"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
} from "react-leaflet";
// import "leaflet/dist/leaflet.css"; // This was problematic
import { useToast } from "@/hooks/use-toast";

// Define the type for an alert
interface AlertEvent {
  id: string;
  date: string;
  time: string;
  frontCameraPicture?: string;
  rearCameraPicture?: string;
  frontCameraPictureStop?: string;
  rearCameraPictureStop?: string;
  videoUrl?: string;
  gpsCoordinates?: string;
  locationHistory?: { lat: number; lng: number }[];
  finalGpsCoordinates?: string;
  endTime?: string;
}


export function AlertHistory() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertEvent | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { toast } = useToast();

  // Dynamically import leaflet CSS
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet/dist/leaflet.css').catch(err => console.error("Failed to load leaflet CSS", err));
    }
  }, []);


  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const storedAlerts = localStorage.getItem("alertHistory");
    if (storedAlerts) {
      try {
        const parsedAlerts: AlertEvent[] = JSON.parse(storedAlerts);
        // Sort alerts by date and time in descending order (most recent first)
        const sortedAlerts = parsedAlerts.sort((a, b) => {
          const dateTimeA = new Date(`${a.date} ${a.time}`);
          const dateTimeB = new Date(`${b.date} ${b.time}`);
          return dateTimeB.getTime() - dateTimeA.getTime();
        });
        setAlerts(sortedAlerts);
      } catch (error) {
        console.error("Failed to parse alert history:", error);
        setAlerts([]);
        toast({
          variant: "destructive",
          title: "Error loading alert history",
          description: "There was an issue parsing the alert history data.",
        });
      }
    } else {
      setAlerts([]);
    }
  };

  const deleteAllAlerts = () => {
    localStorage.removeItem("alertHistory");
    // Remove individual alert data and associated location history
    alerts.forEach(alert => {
        localStorage.removeItem(`panicEvent-${alert.id}`);
        localStorage.removeItem(`locationHistory-${alert.id}`);
    });
    setAlerts([]);
    setSelectedAlert(null);
    toast({
      title: "Alert History Cleared",
      description: "All alerts have been deleted.",
    });
  };

  const deleteAlert = (alertIdToDelete: string) => {
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertIdToDelete);
    localStorage.setItem("alertHistory", JSON.stringify(updatedAlerts));
    localStorage.removeItem(`panicEvent-${alertIdToDelete}`);
    localStorage.removeItem(`locationHistory-${alertIdToDelete}`); // Remove associated location history
    setAlerts(updatedAlerts);
    if (selectedAlert?.id === alertIdToDelete) {
      setSelectedAlert(null);
    }
    toast({
      title: "Alert Deleted",
      description: `Alert ${alertIdToDelete} has been deleted.`,
    });
  };

  const handleAlertClick = (alert: AlertEvent) => {
    const eventData = localStorage.getItem(`panicEvent-${alert.id}`);
    const locationData = localStorage.getItem(`locationHistory-${alert.id}`);
    if (eventData) {
      try {
        const parsedEventData = JSON.parse(eventData);
        const enrichedAlert: AlertEvent = {
          ...alert,
          ...parsedEventData,
          locationHistory: locationData ? JSON.parse(locationData) : [],
        };
        setSelectedAlert(enrichedAlert);
      } catch(error) {
         console.error("Failed to parse event data:", error);
         setSelectedAlert(alert); // Fallback to basic alert info
         toast({
            variant: "destructive",
            title: "Error loading alert details",
            description: "Could not parse detailed event data.",
         });
      }
    } else {
      setSelectedAlert(alert); // Fallback to basic alert info
    }
  };

  const L = typeof window !== 'undefined' ? require('leaflet') : null;
  const defaultIcon = L ? new L.Icon({
      iconUrl: '/marker-icon.png', 
      iconRetinaUrl: '/marker-icon-2x.png', 
      shadowUrl: '/marker-shadow.png', 
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
  }) : undefined;


  return (
    <div className="settings-panel p-4">
      <h2 className="text-2xl font-bold mb-4">Alert History</h2>

      <Button
        variant="destructive"
        onClick={deleteAllAlerts}
        className="mb-4"
        aria-label="Delete all alert history"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete All Alert History
      </Button>

      {alerts.length === 0 && <p>No alerts recorded.</p>}

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="alert-history-item border rounded-md p-3 cursor-pointer hover:bg-muted flex justify-between items-center"
            onClick={() => handleAlertClick(alert)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleAlertClick(alert)}
            role="button"
            aria-labelledby={`alert-title-${alert.id}`}
            aria-describedby={`alert-details-${alert.id}`}
          >
            <div>
              <h4 id={`alert-title-${alert.id}`} className="text-lg font-semibold">
                Event ID: {alert.id}
              </h4>
              <p id={`alert-details-${alert.id}`} className="text-sm text-muted-foreground">
                {alert.date} - {alert.time}
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteAlert(alert.id);
              }}
              aria-label={`Delete alert ${alert.id}`}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Alert Details - ID: {selectedAlert.id}</DialogTitle>
              <DialogDescription>
                Detailed information for the selected emergency event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <p><strong>Date:</strong> {selectedAlert.date}</p>
              <p><strong>Time:</strong> {selectedAlert.time}</p>
              {selectedAlert.endTime && <p><strong>End Time:</strong> {selectedAlert.endTime}</p>}
              {selectedAlert.gpsCoordinates && <p><strong>Initial GPS:</strong> {selectedAlert.gpsCoordinates}</p>}
              {selectedAlert.finalGpsCoordinates && <p><strong>Final GPS:</strong> {selectedAlert.finalGpsCoordinates}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {selectedAlert.frontCameraPicture && (
                  <div>
                    <p><strong>Front Camera (Start):</strong></p>
                    <img src={selectedAlert.frontCameraPicture} alt="Front camera at start" data-ai-hint="person face" className="rounded-md max-w-full h-auto" />
                  </div>
                )}
                {selectedAlert.rearCameraPicture && (
                  <div>
                    <p><strong>Rear Camera (Start):</strong></p>
                    <img src={selectedAlert.rearCameraPicture} alt="Rear camera at start" data-ai-hint="street view" className="rounded-md max-w-full h-auto" />
                  </div>
                )}
                {selectedAlert.frontCameraPictureStop && (
                  <div>
                    <p><strong>Front Camera (Stop):</strong></p>
                    <img src={selectedAlert.frontCameraPictureStop} alt="Front camera at stop" data-ai-hint="person face" className="rounded-md max-w-full h-auto" />
                  </div>
                )}
                {selectedAlert.rearCameraPictureStop && (
                  <div>
                    <p><strong>Rear Camera (Stop):</strong></p>
                    <img src={selectedAlert.rearCameraPictureStop} alt="Rear camera at stop" data-ai-hint="street view" className="rounded-md max-w-full h-auto" />
                  </div>
                )}
              </div>

              {selectedAlert.videoUrl && (
                <div className="mt-2">
                  <p><strong>Video Recording:</strong></p>
                  <video src={selectedAlert.videoUrl} controls className="rounded-md w-full" />
                </div>
              )}

              {selectedAlert.locationHistory && selectedAlert.locationHistory.length > 0 && L && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Location History</h3>
                   <Button onClick={() => setIsMapModalOpen(true)} variant="outline" className="mb-2">View Route on Map</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedAlert && selectedAlert.locationHistory && selectedAlert.locationHistory.length > 0 && L && isMapModalOpen && (
         <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
            <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Route Map - Event ID: {selectedAlert.id}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow mt-4">
                    { selectedAlert.locationHistory[0] ? (
                        <MapContainer
                            center={[selectedAlert.locationHistory[0].lat, selectedAlert.locationHistory[0].lng]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={true}
                            className="rounded-md"
                        >
                            <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {defaultIcon && selectedAlert.locationHistory[0] && (
                                <Marker position={[selectedAlert.locationHistory[0].lat, selectedAlert.locationHistory[0].lng]} icon={defaultIcon}>
                                </Marker>
                            )}
                            {defaultIcon && selectedAlert.locationHistory.length > 1 && selectedAlert.locationHistory[selectedAlert.locationHistory.length-1] &&(
                                 <Marker position={[selectedAlert.locationHistory[selectedAlert.locationHistory.length-1].lat, selectedAlert.locationHistory[selectedAlert.locationHistory.length-1].lng]} icon={defaultIcon}>
                                 </Marker>
                            )}
                            <Polyline positions={selectedAlert.locationHistory.map(p => [p.lat, p.lng])} color="blue" />
                        </MapContainer>
                    ) : (
                        <p>Location history is available but map cannot be centered.</p>
                    )}
                </div>
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}
