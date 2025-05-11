
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


// import GuardianAngelLogo from "@/components/GuardianAngelLogo";

function HomeComponent() {
  const {toast} = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Safely access search parameters
  const emergencyParam = searchParams.get('emergency');

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeMonitoringState, setActiveMonitoringState] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('activeMonitoring');
      return storedValue === 'true';
    }
    return false;
  });
  const [emergency, setEmergency] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("emergency") === 'true';
    }
    return false;
  });
  const [emergencyIndicatorVisible, setEmergencyIndicatorVisible] = useState(false);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmergency = localStorage.getItem("emergency");
      if (storedEmergency) {
        setEmergency(JSON.parse(storedEmergency));
      }

      const storedSoundEnabled = localStorage.getItem("soundEnabled");
      if (storedSoundEnabled) {
        setSoundEnabled(JSON.parse(storedSoundEnabled));
      }

      // No need to set activeMonitoringState here again, it's done in useState initializer
    }
  }, []);

  useEffect(() => {
    setEmergencyIndicatorVisible(emergency);
  }, [emergency]);


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


  // Function to update soundEnabled state and store it in localStorage
  const updateSoundEnabled = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (typeof window !== 'undefined') {
      localStorage.setItem("soundEnabled", JSON.stringify(enabled));
    }
  };

  const toggleActiveMonitoring = () => {
    const newState = !activeMonitoringState;
    setActiveMonitoringState(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMonitoring', newState.toString());
      if (newState && emergency) { // If monitoring is enabled during an emergency, show display
        // This condition might need adjustment based on desired behavior for EmergencyDisplay
      }
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream; // Store the stream
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
        // Request a new stream specifically for capturing the picture
        const currentStreamForCapture = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        if (!currentStreamForCapture) {
            toast({ title: "Camera Error", description: "Failed to get camera stream for picture.", variant: "destructive" });
            return null;
        }
        streamToStop = currentStreamForCapture;


        const tempVideoEl = document.createElement('video');
        tempVideoEl.srcObject = streamToStop;
        
        // Wait for the video to be ready to play to ensure dimensions are set
        await new Promise(resolve => tempVideoEl.onloadedmetadata = resolve);
        await tempVideoEl.play(); 

        return new Promise((resolve) => {
            const handleCanPlay = () => {
                const canvas = document.createElement('canvas');
                canvas.width = tempVideoEl.videoWidth;
                canvas.height = tempVideoEl.videoHeight;
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
                 handleCanPlay(); // If already ready, call directly
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
    if (!streamRef.current || !streamRef.current.active) {
        const stream = await getCameraPermission('user'); 
        if (!stream) {
            toast({ title: "Recording Error", description: "Failed to get camera stream for recording.", variant: "destructive" });
            setHasCameraPermission(false); 
            return;
        }
        streamRef.current = stream;
        if (videoRef.current) { 
            videoRef.current.srcObject = streamRef.current;
        }
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
                    const existingEventData = localStorage.getItem(`panicEvent-${panicEventId}`);
                    if (existingEventData) {
                        const parsedData = JSON.parse(existingEventData);
                        const reader = new FileReader();
                        reader.readAsDataURL(videoBlob);
                        reader.onloadend = function() {
                            parsedData.videoUrl = reader.result; // Changed from videoDataUrl to videoUrl
                            localStorage.setItem(`panicEvent-${panicEventId}`, JSON.stringify(parsedData));
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
         toast({ title: "Recording Error", description: "Camera stream is not active.", variant: "destructive" });
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
    // toast({ title: "Recording Stopped", description: "Video and audio recording has ended." }); // Toast moved to validatePin for better flow
  };

  const triggerEmergencySequence = async () => {
    // Check and request camera permissions before starting the sequence
    if (!hasCameraPermission) {
      const stream = await getCameraPermission();
      if (!stream) {
        toast({ title: "Emergency Error", description: "Cannot start emergency sequence without camera permission.", variant: "destructive" });
        return;
      }
    }
    // At this point, permissions should be granted and streamRef.current should be set

    setEmergency(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem("emergency", 'true');
    }
    setEmergencyIndicatorVisible(true);

    const newPanicEventId = `panic-${Date.now()}`;
    setPanicEventId(newPanicEventId);

    toast({
      title: "Emergency sequence initiated!",
      description: "Capturing data...",
    });

    const frontPicture = await capturePicture('user');
    const rearPicture = await capturePicture('environment');
    
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
    }
    await startRecording(); 

    const location = await getCurrentLocation();
    const startTime = new Date();

    const initialEventData = {
      id: newPanicEventId,
      date: startTime.toLocaleDateString(),
      time: startTime.toLocaleTimeString(),
      frontCameraPicture: frontPicture,
      rearCameraPicture: rearPicture,
      gpsCoordinates: `${location.lat}, ${location.lng}`,
      locationHistory: [{ lat: location.lat, lng: location.lng, timestamp: startTime.toISOString() }],
      videoUrl: null, 
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`panicEvent-${newPanicEventId}`, JSON.stringify(initialEventData));
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

      const frontPictureStop = await capturePicture('user');
      const rearPictureStop = await capturePicture('environment');
      stopRecordingAndReleaseCamera(); 
      
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
          parsedData.frontCameraPictureStop = frontPictureStop;
          parsedData.rearCameraPictureStop = rearPictureStop; 
          parsedData.finalGpsCoordinates = `${finalLocation.lat}, ${finalLocation.lng}`;
          parsedData.endTime = endTime.toLocaleTimeString();
          // videoUrl is set in mediaRecorder.onstop when it finishes.
          // To ensure it's there before pushing to history, we might need a small delay or handle it in onstop directly.
          // For simplicity, assuming onstop has completed.
          localStorage.setItem(`panicEvent-${panicEventId}`, JSON.stringify(parsedData));
          alertHistory.push(parsedData); // Add the completed event data
        }
        localStorage.setItem("alertHistory", JSON.stringify(alertHistory));
      }

      setEmergency(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem("emergency", 'false');
      }
      setEmergencyIndicatorVisible(false);
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

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-start bg-background text-foreground p-4">
      <Toaster/>

      <div className="w-full max-w-md mx-auto">
        <div className="mt-8 mb-4 relative text-center">
          {emergencyIndicatorVisible && (
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full"
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

        <div className="my-4 w-full aspect-video bg-muted rounded-md overflow-hidden relative">
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            { !hasCameraPermission && isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <Alert variant="destructive" className="w-auto">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                            Please allow camera access to use this feature. Recording may not work.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
             { !hasCameraPermission && !isRecording && streamRef.current === null && ( 
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-foreground">Camera preview will appear here</p>
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
                className="p-3" 
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
          <img src="/Advert logo.JPG" alt="Prosegur Alarms Advertisement" className="w-72 rounded-md inline-block" data-ai-hint="advertisement banner"/>
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
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}

    
