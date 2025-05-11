
'use client';

import React, {Suspense} from 'react';
import {PanicButton} from "@/components/PanicButton";
import {EmergencyDisplay} from "@/components/EmergencyDisplay";
import {SettingsButton} from "@/components/SettingsButton";
import {Toaster} from "@/components/ui/toaster";
import {useEffect, useState, useRef} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {ActiveMonitoringButton} from "@/components/ActiveMonitoringButton";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {useToast} from "@/hooks/use-toast";
import {getCurrentLocation, Location} from "@/services/location";
import {Play, PauseSquare, Gear, StopCircle} from "lucide-react";
import {CheckCircle, XCircle} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';


// Helper function to safely set item in localStorage
const safeSetLocalStorageItem = (key: string, value: string, itemName: string, toastFn: Function) => {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e: any) {
    if (e.name === 'QuotaExceededError') {
      toastFn({
        variant: 'destructive',
        title: 'Storage Full',
        description: `Could not save ${itemName}. Local storage quota exceeded. Consider deleting old alerts from settings.`,
      });
    } else {
      toastFn({
        variant: 'destructive',
        title: 'Storage Error',
        description: `Failed to save ${itemName}: ${e.message}`,
      });
    }
    return false;
  }
};

// Helper function to safely remove item from localStorage
const safeRemoveLocalStorageItem = (key: string) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (e: any) {
    console.error(`Failed to remove ${key} from localStorage:`, e);
  }
};


function HomeComponent() {
  const {toast} = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isClient, setIsClient] = useState(false);

  // Safely access search parameters
   const emergencyParam = isClient ? searchParams.get('emergency') : null;


  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeMonitoringState, setActiveMonitoringState] = useState(false);

  const [emergency, setEmergency] = useState<boolean>(false);
  const [emergencyIndicatorVisible, setEmergencyIndicatorVisible] = useState(false);


  useEffect(() => {
    setIsClient(true); // Component has mounted on the client

    if (typeof window !== 'undefined') {
        const storedEmergency = localStorage.getItem("emergency");
        if (storedEmergency) {
          setEmergency(JSON.parse(storedEmergency));
        } else {
            setEmergency(false); // Default to false if not found
        }

        const storedSoundEnabled = localStorage.getItem("soundEnabled");
        if (storedSoundEnabled) {
          setSoundEnabled(JSON.parse(storedSoundEnabled));
        }
        
        const storedActiveMonitoring = localStorage.getItem('activeMonitoring');
        if (storedActiveMonitoring) {
            setActiveMonitoringState(storedActiveMonitoring === 'true');
        }  else {
            setActiveMonitoringState(false); // Default if not found
        }
        
        // Load user info from localStorage
        setName(localStorage.getItem("name") || "");
        setAge(localStorage.getItem("age") || "");
        setAddress(localStorage.getItem("address") || "");
        setBloodType(localStorage.getItem("bloodType") || "");
        setMedicalConditions(localStorage.getItem("medicalConditions") || "");
        setVehicleInformation(localStorage.getItem("vehicleInformation") || "");
        setShowName(localStorage.getItem("showName") === 'true');
        setShowAge(localStorage.getItem("showAge") === 'true');
        setShowAddress(localStorage.getItem("showAddress") === 'true');
        setShowBloodType(localStorage.getItem("showBloodType") === 'true');
        setShowMedicalConditions(localStorage.getItem("showMedicalConditions") === 'true');
        setShowVehicleInformation(localStorage.getItem("showVehicleInformation") === 'true');
    }

  }, []);

  useEffect(() => {
    if (isClient) {
      setEmergencyIndicatorVisible(emergency);
    }
  }, [isClient, emergency]);


  useEffect(() => {
    if (!isClient) return;

    if (emergency && soundEnabled) {
      const audio = new Audio("/ambulance.mp3"); // Replace with your sound file
      audio.loop = true;
      audio.play();

      return () => {
        audio.pause();
      };
    }
  }, [isClient, emergency, soundEnabled]);


  // Function to update soundEnabled state and store it in localStorage
  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (typeof window !== 'undefined') {
      safeSetLocalStorageItem("soundEnabled", JSON.stringify(enabled), "sound preference", toast);
    }
  };

  const toggleActiveMonitoring = () => {
    const newState = !activeMonitoringState;
    setActiveMonitoringState(newState);
    if (typeof window !== 'undefined') {
      safeSetLocalStorageItem('activeMonitoring', newState.toString(), "active monitoring state", toast);
    }
  };

  // Retrieve user settings from local storage
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [vehicleInformation, setVehicleInformation] = useState("");

  const [showName, setShowName] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showBloodType, setShowBloodType] = useState(false);
  const [showMedicalConditions, setShowMedicalConditions] = useState(false);
  const [showVehicleInformation, setShowVehicleInformation] = useState(false);


  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [emergencyPin, setEmergencyPin] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [showPinDialog, setShowPinDialog] = useState(false);

  const [panicEventId, setPanicEventId] = useState<string | null>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRecording, setIsRecording] = useState(false);


  const getCameraPermission = async (facingMode: 'user' | 'environment' = 'user') => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          variant: 'destructive',
          title: 'Camera API not supported',
          description: 'Your browser does not support camera access.',
        });
        setHasCameraPermission(false);
        return null;
      }
      try {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true, 
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream; 
        return stream;
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
        return null;
      }
    };


  const capturePicture = async (facingMode: 'user' | 'environment'): Promise<string | null> => {
    let streamToStop: MediaStream | null = null;
    try {
        const currentStreamForCapture = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        if (!currentStreamForCapture) {
            toast({ title: "Camera Error", description: "Failed to get camera stream for picture.", variant: "destructive" });
            return null;
        }
        streamToStop = currentStreamForCapture;

        const tempVideoEl = document.createElement('video');
        tempVideoEl.srcObject = streamToStop;
        
        await new Promise(resolve => { tempVideoEl.onloadedmetadata = resolve; tempVideoEl.play().catch(console.error); });

        return new Promise((resolve) => {
            const handleCanPlay = () => {
                const canvas = document.createElement('canvas');
                const videoTrack = streamToStop!.getVideoTracks()[0];
                const settings = videoTrack.getSettings();
                canvas.width = settings.width || tempVideoEl.videoWidth;
                canvas.height = settings.height || tempVideoEl.videoHeight;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(tempVideoEl, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    resolve(null);
                }
                tempVideoEl.removeEventListener('canplay', handleCanPlay);
                 streamToStop?.getTracks().forEach(track => track.stop()); 
            };
            
            if (tempVideoEl.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
                 handleCanPlay(); 
            } else {
                tempVideoEl.addEventListener('canplay', handleCanPlay, { once: true });
            }
        });
    } catch (error) {
        console.error(`Error capturing ${facingMode} picture:`, error);
        toast({ title: `Capture Error (${facingMode})`, description: (error as Error).message, variant: "destructive" });
        streamToStop?.getTracks().forEach(track => track.stop());
        return null;
    }
  };


  const startRecording = async () => {
    const userStream = await getCameraPermission('user');
    if (!userStream) {
        toast({ title: "Recording Error", description: "Failed to get camera stream for recording.", variant: "destructive" });
        setHasCameraPermission(false);
        return;
    }
    if (videoRef.current && streamRef.current) {
        videoRef.current.srcObject = streamRef.current; 
    }

    if (streamRef.current && streamRef.current.active) { 
        try {
            let mimeType = 'video/webm; codecs=vp9';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm; codecs=vp8';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm'; 
                     if (!MediaRecorder.isTypeSupported(mimeType)) {
                        toast({ title: "Recording Error", description: "No supported video mimeType found.", variant: "destructive" });
                        return;
                    }
                }
            }

            mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType });
            recordedChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const videoBlob = new Blob(recordedChunksRef.current, { type: mimeType });
                
                if (typeof window !== 'undefined' && panicEventId) {
                    const reader = new FileReader();
                    reader.readAsDataURL(videoBlob);
                    reader.onloadend = function() {
                        if (reader.result) {
                             safeSetLocalStorageItem(`panicEvent-${panicEventId}-videoData`, reader.result as string, 'video recording', toast);
                        } else {
                            safeRemoveLocalStorageItem(`panicEvent-${panicEventId}-videoData`);
                        }
                    }
                }
                setIsRecording(false);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            toast({ title: "Recording Started", description: "Video and audio recording has begun." });
        } catch (error) {
            console.error('Failed to start recording:', error);
            toast({ title: "Recording Error", description: `Failed to start recording: ${(error as Error).message}`, variant: "destructive" });
            setIsRecording(false);
        }
    } else {
         toast({ title: "Recording Error", description: "Camera stream is not active or available for recording.", variant: "destructive" });
         setHasCameraPermission(false);
    }
  };

  const stopRecordingAndReleaseCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop(); 
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasCameraPermission(false); 
    setIsRecording(false);
  };

  const triggerEmergencySequence = async () => {
    const stream = await getCameraPermission('user');
    if (!stream) {
      toast({ title: "Emergency Error", description: "Cannot start emergency sequence without camera permission.", variant: "destructive" });
      return;
    }
    if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
    }

    setEmergency(true);
    if (typeof window !== 'undefined') {
      safeSetLocalStorageItem("emergency", 'true', "emergency state", toast);
    }

    const newPanicEventId = `panic-${Date.now()}`;
    setPanicEventId(newPanicEventId);

    toast({
      title: "Emergency sequence initiated!",
      description: "Capturing data...",
    });

    const frontPicture = await capturePicture('user');
    const rearPicture = await capturePicture('environment'); 
    
    if (!streamRef.current || !streamRef.current.active) {
        const userStreamForRecording = await getCameraPermission('user');
        if (!userStreamForRecording) {
             toast({ title: "Recording Error", description: "Failed to re-acquire camera for recording.", variant: "destructive" });
             return; 
        }
        if (videoRef.current) videoRef.current.srcObject = streamRef.current; 
    }
    await startRecording(); 

    const location = await getCurrentLocation();
    const startTime = new Date();

    const initialEventData = {
      id: newPanicEventId,
      date: startTime.toLocaleDateString(),
      time: startTime.toLocaleTimeString(),
      gpsCoordinates: `${location.lat}, ${location.lng}`,
      locationHistory: [{ lat: location.lat, lng: location.lng, timestamp: startTime.toISOString() }],
    };

    if (typeof window !== 'undefined') {
      const eventDataSaved = safeSetLocalStorageItem(`panicEvent-${newPanicEventId}`, JSON.stringify(initialEventData), 'emergency event data', toast);
      if (eventDataSaved) {
        if (frontPicture) {
          safeSetLocalStorageItem(`panicEvent-${newPanicEventId}-frontPicStart`, frontPicture, 'front picture (start)', toast);
        } else {
          safeRemoveLocalStorageItem(`panicEvent-${newPanicEventId}-frontPicStart`);
        }
        if (rearPicture) {
          safeSetLocalStorageItem(`panicEvent-${newPanicEventId}-rearPicStart`, rearPicture, 'rear picture (start)', toast);
        } else {
          safeRemoveLocalStorageItem(`panicEvent-${newPanicEventId}-rearPicStart`);
        }
      }
    }


    if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    locationIntervalRef.current = setInterval(async () => {
      const currentLocation = await getCurrentLocation();
      const currentTime = new Date();
      if (typeof window !== 'undefined') {
        const existingEventData = localStorage.getItem(`panicEvent-${newPanicEventId}`);
        if (existingEventData) {
          const parsedData = JSON.parse(existingEventData);
          parsedData.locationHistory.push({ lat: currentLocation.lat, lng: currentLocation.lng, timestamp: currentTime.toISOString() });
          // No need for safeSetLocalStorageItem here if the main data is already there and subsequent items might fill quota.
          // However, if this update itself could be large, it should also be wrapped. For now, assuming it's smaller.
          localStorage.setItem(`panicEvent-${newPanicEventId}`, JSON.stringify(parsedData));
        }
      }
    }, 5000);
  };


  const handleStopPanic = () => {
    if (typeof window !== 'undefined') {
      const storedPin = localStorage.getItem("pinCode");
      if (!storedPin) {
        toast({
          variant: 'destructive',
          title: "PIN Not Set",
          description: "Please set an emergency PIN in settings. Stopping without PIN.",
        });
        setEmergencyPin(null); 
      } else {
        setEmergencyPin(storedPin);
      }
    }
    setShowPinDialog(true);
  };

  const validatePin = async () => {
    if (pinInput === emergencyPin || !emergencyPin) {
      setShowPinDialog(false);
      setPinInput('');
      toast({
        title: "Emergency sequence stopped!",
        description: "Emergency mode deactivated.",
      });

      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
      
      stopRecordingAndReleaseCamera(); 
      
      const frontPictureStop = await capturePicture('user');
      const rearPictureStop = await capturePicture('environment');
      
      const finalLocation = await getCurrentLocation();
      const endTime = new Date();


      if (typeof window !== 'undefined' && panicEventId) {
        const existingEventData = localStorage.getItem(`panicEvent-${panicEventId}`);
        let alertHistory: any[] = [];
        const storedAlerts = localStorage.getItem("alertHistory");
        if (storedAlerts) {
          try {
            alertHistory = JSON.parse(storedAlerts);
          } catch (e) {
            console.error("Error parsing alert history:", e);
            alertHistory = [];
          }
        }

        if (existingEventData) {
          const parsedData = JSON.parse(existingEventData);
          parsedData.finalGpsCoordinates = `${finalLocation.lat}, ${finalLocation.lng}`;
          parsedData.endTime = endTime.toLocaleTimeString();
          safeSetLocalStorageItem(`panicEvent-${panicEventId}`, JSON.stringify(parsedData), "final event data", toast);


          if (frontPictureStop) {
            safeSetLocalStorageItem(`panicEvent-${panicEventId}-frontPicStop`, frontPictureStop, 'front picture (stop)', toast);
          } else {
            safeRemoveLocalStorageItem(`panicEvent-${panicEventId}-frontPicStop`);
          }
          if (rearPictureStop) {
            safeSetLocalStorageItem(`panicEvent-${panicEventId}-rearPicStop`, rearPictureStop, 'rear picture (stop)', toast);
          } else {
            safeRemoveLocalStorageItem(`panicEvent-${panicEventId}-rearPicStop`);
          }
          
          const completeAlertDataForHistory = {
              ...parsedData, 
              frontCameraPicture: localStorage.getItem(`panicEvent-${panicEventId}-frontPicStart`),
              rearCameraPicture: localStorage.getItem(`panicEvent-${panicEventId}-rearPicStart`),
              frontCameraPictureStop: frontPictureStop, 
              rearCameraPictureStop: rearPictureStop,   
              videoUrl: localStorage.getItem(`panicEvent-${panicEventId}-videoData`),
          };
          alertHistory.push(completeAlertDataForHistory); 
        }
        safeSetLocalStorageItem("alertHistory", JSON.stringify(alertHistory), 'alert history', toast);
      }

      setEmergency(false);
      if (typeof window !== 'undefined') {
        safeSetLocalStorageItem("emergency", 'false', "emergency state", toast);
      }
      setPanicEventId(null);
    } else {
      toast({
        variant: 'destructive',
        title: "Incorrect PIN",
        description: "Please enter the correct emergency PIN code.",
      });
      setPinInput('');
    }
  };

  if (!isClient) {
    return <div className="flex flex-col h-screen w-screen items-center justify-center bg-background text-foreground p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-start bg-background text-foreground p-4 overflow-y-auto">
      <Toaster/>

      <div className="w-full max-w-md mx-auto">
        <div className="mt-8 mb-4 relative text-center">
          {emergencyIndicatorVisible && (
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse"
              aria-hidden="true"
            />
          )}
          <img
            src="/GA logo.JPG"
            alt="Guardian Angel Logo"
            className="h-16 inline-block" 
            style={{ width: 'auto' }}
            data-ai-hint="app logo" 
          />
        </div>

        {emergency && activeMonitoringState && (
            <EmergencyDisplay />
        )}

        <div className="my-4 w-full aspect-video bg-muted rounded-md overflow-hidden relative shadow-lg">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            { isRecording && !hasCameraPermission && ( 
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <Alert variant="destructive" className="w-auto m-4">
                        <AlertTitle>Camera Issue During Recording</AlertTitle>
                        <AlertDescription>
                            Camera access might have been revoked or lost. Recording may be affected.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
             { !streamRef.current && !isRecording && ( 
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-foreground/70 text-center p-4">Camera preview will appear here when needed or during recording.</p>
                </div>
            )}
        </div>


        <div className="flex flex-col items-center justify-center space-y-3">
          <ActiveMonitoringButton
            activeMonitoring={activeMonitoringState}
            toggleActiveMonitoring={toggleActiveMonitoring}
            className="w-64 h-36" 
          />
          <div className="flex items-center justify-center space-x-2">
            <PanicButton className="w-64 py-10 text-3xl" triggerEmergencySequence={triggerEmergencySequence}/>
            {emergency && (
              <Button
                variant="destructive"
                className="p-3 h-auto aspect-square flex items-center justify-center shadow-lg" 
                onClick={handleStopPanic}
                aria-label="Stop Panic"
              >
                <StopCircle className="h-8 w-8" />
              </Button>
            )}
          </div>
          <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enter Emergency PIN</DialogTitle>
                <DialogDescription>
                  Please enter your emergency PIN code to stop the panic action.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pin" className="text-right font-medium">
                    PIN Code
                  </Label>
                  <Input
                    type="password"
                    id="pin"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={validatePin}>Validate</Button>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-64">Show Saved Info</Button>
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
                  <Label htmlFor="name-display" className="text-right font-medium">
                    Name
                  </Label>
                  <Input type="text" id="name-display" value={name} readOnly className="col-span-3"/>
                  <Switch id="showName-display" checked={showName} disabled
                          className="col-span-1 data-[state=checked]:bg-primary"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age-display" className="text-right font-medium">
                    Age
                  </Label>
                  <Input type="text" id="age-display" value={age} readOnly className="col-span-3"/>
                  <Switch id="showAge-display" checked={showAge} disabled
                          className="col-span-1 data-[state=checked]:bg-primary"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address-display" className="text-right font-medium">
                    Address
                  </Label>
                  <Input type="text" id="address-display" value={address} readOnly className="col-span-3"/>
                  <Switch id="showAddress-display" checked={showAddress} disabled
                          className="col-span-1 data-[state=checked]:bg-primary"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bloodType-display" className="text-right font-medium">
                    Blood Type
                  </Label>
                  <Input type="text" id="bloodType-display" value={bloodType} readOnly className="col-span-3"/>
                  <Switch id="showBloodType-display" checked={showBloodType} disabled
                          className="col-span-1 data-[state=checked]:bg-primary"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="medicalConditions-display" className="text-right font-medium">
                    Medical Conditions
                  </Label>
                  <Input type="text" id="medicalConditions-display" value={medicalConditions} readOnly
                        className="col-span-3"/>
                  <Switch id="showMedicalConditions-display" checked={showMedicalConditions} disabled
                          className="col-span-1 data-[state=checked]:bg-primary"/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicleInformation-display" className="text-right font-medium">
                    Vehicle Information
                  </Label>
                  <Input type="text" id="vehicleInformation-display" value={vehicleInformation} readOnly
                        className="col-span-3"/>
                  <Switch id="showVehicleInformation-display" checked={showVehicleInformation} disabled
                          className="col-span-1 data-[state=checked]:bg-primary"/>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-auto mb-4 text-center pt-4">
          <img src="/Advert logo.JPG" alt="Prosegur Alarms Advertisement" className="w-72 rounded-md inline-block shadow-md" data-ai-hint="advertisement banner"/>
        </div>
        <div className="absolute top-4 right-4">
          <SettingsButton updateSoundEnabled={updateSoundEnabled}/>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex flex-col h-screen w-screen items-center justify-center bg-background text-foreground p-4">Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}

    
