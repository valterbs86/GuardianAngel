
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { LatLngExpression } from 'leaflet'; 
import dynamic from 'next/dynamic';
import { useToast } from "@/hooks/use-toast";

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false, loading: () => <p>Loading map...</p> });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });


// Define the type for an alert
interface AlertEvent {
  id: string;
  date: string;
  time: string;
  frontCameraPicture?: string | null;
  rearCameraPicture?: string | null;
  frontCameraPictureStop?: string | null;
  rearCameraPictureStop?: string | null;
  videoUrl?: string | null;
  gpsCoordinates?: string;
  locationHistory?: { lat: number; lng: number; timestamp: string }[];
  finalGpsCoordinates?: string;
  endTime?: string;
}


export function AlertHistory() {
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertEvent | null>(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [mapForceRemountKey, setMapForceRemountKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      // Dynamically import leaflet CSS to prevent server-side rendering issues
      import('leaflet/dist/leaflet.css').catch(err => console.error("Failed to load leaflet CSS", err));
    }
  }, []);


  useEffect(() => {
    if (isClient) { 
        loadAlerts();
    }
  }, [isClient]);

  const loadAlerts = () => {
    if (typeof window === 'undefined') return;
    const storedAlerts = localStorage.getItem("alertHistory");
    if (storedAlerts) {
      try {
        let parsedAlerts: AlertEvent[] = JSON.parse(storedAlerts);
        parsedAlerts = parsedAlerts.filter(
          alert => alert && typeof alert.id === 'string' && alert.id.trim() !== ''
        ).map(alert => ({
          ...alert,
          locationHistory: Array.isArray(alert.locationHistory) ? alert.locationHistory : []
        }));
        
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
    if (typeof window === 'undefined') return;
    
    alerts.forEach(alert => {
        localStorage.removeItem(`panicEvent-${alert.id}`);
        localStorage.removeItem(`panicEvent-${alert.id}-frontPicStart`);
        localStorage.removeItem(`panicEvent-${alert.id}-rearPicStart`);
        localStorage.removeItem(`panicEvent-${alert.id}-frontPicStop`);
        localStorage.removeItem(`panicEvent-${alert.id}-rearPicStop`);
        localStorage.removeItem(`panicEvent-${alert.id}-videoData`);
    });

    localStorage.removeItem("alertHistory");
    setAlerts([]);
    setSelectedAlert(null);
    toast({
      title: "Alert History Cleared",
      description: "All alerts have been deleted.",
    });
  };

  const deleteAlert = (alertIdToDelete: string) => {
    if (typeof window === 'undefined') return;
    const updatedAlerts = alerts.filter((alert) => alert.id !== alertIdToDelete);
    localStorage.setItem("alertHistory", JSON.stringify(updatedAlerts));

    localStorage.removeItem(`panicEvent-${alertIdToDelete}`);
    localStorage.removeItem(`panicEvent-${alertIdToDelete}-frontPicStart`);
    localStorage.removeItem(`panicEvent-${alertIdToDelete}-rearPicStart`);
    localStorage.removeItem(`panicEvent-${alertIdToDelete}-frontPicStop`);
    localStorage.removeItem(`panicEvent-${alertIdToDelete}-rearPicStop`);
    localStorage.removeItem(`panicEvent-${alertIdToDelete}-videoData`);

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
    if (typeof window === 'undefined') return;
    const eventData = localStorage.getItem(`panicEvent-${alert.id}`);
    let enrichedAlert: AlertEvent = { ...alert, locationHistory: Array.isArray(alert.locationHistory) ? alert.locationHistory : [] };

    if (eventData) {
      try {
        const parsedEventData = JSON.parse(eventData);
        enrichedAlert = {
          ...enrichedAlert, 
          ...parsedEventData,
          locationHistory: Array.isArray(parsedEventData.locationHistory) ? parsedEventData.locationHistory : [],
        };
      } catch(error) {
         console.error("Failed to parse event data:", error);
         toast({
            variant: "destructive",
            title: "Error loading alert details",
            description: "Could not parse detailed event data.",
         });
      }
    }
    
    // Load images and video from their separate localStorage items
    enrichedAlert.frontCameraPicture = localStorage.getItem(`panicEvent-${alert.id}-frontPicStart`) || undefined;
    enrichedAlert.rearCameraPicture = localStorage.getItem(`panicEvent-${alert.id}-rearPicStart`) || undefined;
    enrichedAlert.frontCameraPictureStop = localStorage.getItem(`panicEvent-${alert.id}-frontPicStop`) || undefined;
    enrichedAlert.rearCameraPictureStop = localStorage.getItem(`panicEvent-${alert.id}-rearPicStop`) || undefined;
    enrichedAlert.videoUrl = localStorage.getItem(`panicEvent-${alert.id}-videoData`) || undefined;

    setSelectedAlert(enrichedAlert);
  };

  const openMapModalForSelectedAlert = () => {
    setMapForceRemountKey(prev => prev + 1);
    setIsMapModalOpen(true);
  };

  const defaultIcon = useMemo(() => {
    if (typeof window !== 'undefined' && isClient) { 
      const L = require('leaflet');
      return new L.Icon({
          iconUrl: '/marker-icon.png', 
          iconRetinaUrl: '/marker-icon-2x.png',
          shadowUrl: '/marker-shadow.png',
          iconSize: [25, 41] as [number, number],
          iconAnchor: [12, 41] as [number, number],
          popupAnchor: [1, -34] as [number, number],
          shadowSize: [41, 41] as [number, number]
      });
    }
    return undefined; 
  }, [isClient]);


  if (!isClient) {
    return <div className="p-4">Loading alert history...</div>;
  }

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
        <Dialog open={!!selectedAlert} onOpenChange={() => {setSelectedAlert(null); setIsMapModalOpen(false);}}>
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

              {selectedAlert.locationHistory && selectedAlert.locationHistory.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Location History</h3>
                   <Button onClick={openMapModalForSelectedAlert} variant="outline" className="mb-2">View Route on Map</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isMapModalOpen && selectedAlert && selectedAlert.locationHistory && selectedAlert.locationHistory.length > 0 && defaultIcon && (
         <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
            <DialogContent className="sm:max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Route Map - Event ID: {selectedAlert.id}</DialogTitle>
                </DialogHeader>
                <div className="flex-grow mt-4">
                    { selectedAlert.locationHistory[0] ? (
                        <MapContainer
                            key={`map-remount-${mapForceRemountKey}`} 
                            center={[selectedAlert.locationHistory[0].lat, selectedAlert.locationHistory[0].lng] as LatLngExpression}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                            scrollWheelZoom={true}
                            className="rounded-md"
                        >
                            <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {selectedAlert.locationHistory[0] && (
                                <Marker position={[selectedAlert.locationHistory[0].lat, selectedAlert.locationHistory[0].lng] as LatLngExpression} icon={defaultIcon}>
                                </Marker>
                            )}
                            {selectedAlert.locationHistory.length > 1 && selectedAlert.locationHistory[selectedAlert.locationHistory.length-1] &&(
                                 <Marker position={[selectedAlert.locationHistory[selectedAlert.locationHistory.length-1].lat, selectedAlert.locationHistory[selectedAlert.locationHistory.length-1].lng] as LatLngExpression} icon={defaultIcon}>
                                 </Marker>
                            )}
                            <Polyline positions={selectedAlert.locationHistory.map(p => [p.lat, p.lng]) as LatLngExpression[]} color="blue" />
                        </MapContainer>
                    ) : (
                        <p>Location history is available but the map cannot be centered (missing initial point).</p>
                    )}
                </div>
            </DialogContent>
         </Dialog>
      )}
    </div>
  );
}

