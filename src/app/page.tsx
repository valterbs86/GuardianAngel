'use client';

import { PanicButton } from "@/components/PanicButton";
import { EmergencyDisplay } from "@/components/EmergencyDisplay";
import { SettingsButton } from "@/components/SettingsButton";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ActiveMonitoringButton } from "@/components/ActiveMonitoringButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getCurrentLocation } from "@/services/location";
import { Play, PauseSquare } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";

// import GuardianAngelLogo from "@/components/GuardianAngelLogo";

export default function Home() {
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [soundEnabled, setSoundEnabled] = useState(false);
    const [activeMonitoringState, setActiveMonitoringState] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const storedValue = localStorage.getItem('activeMonitoring');
            return storedValue === 'true';
        }
        return false;
    });
    const [emergency, setEmergency] = useState<boolean>(false);


    const activeMonitoring = activeMonitoringState;

    useEffect(() => {
        // Retrieve emergency status from localStorage on component mount
        const storedEmergency = localStorage.getItem("emergency");
        if (storedEmergency) {
            setEmergency(JSON.parse(storedEmergency));
        }
    }, []);

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
    const [age, setAge] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("age") || "";
        }
        return "";
    });
    const [address, setAddress] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("address") || "";
        }
        return "";
    });
    const [bloodType, setBloodType] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("bloodType") || "";
        }
        return "";
    });
    const [medicalConditions, setMedicalConditions] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("medicalConditions") || "";
        }
        return "";
    });
    const [vehicleInformation, setVehicleInformation] = useState(() => {
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
    const [showAge, setShowAge] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("showAge") === 'true';
        }
        return false;
    });
    const [showAddress, setShowAddress] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("showAddress") === 'true';
        }
        return false;
    });
    const [showBloodType, setShowBloodType] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("showBloodType") === 'true';
        }
        return false;
    });
    const [showMedicalConditions, setShowMedicalConditions] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("showMedicalConditions") === 'true';
        }
        return false;
    });
    const [showVehicleInformation, setShowVehicleInformation] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem("showVehicleInformation") === 'true';
        }
        return false;
    });

    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [emergencyPin, setEmergencyPin] = useState<string | null>(null);
    const [pinInput, setPinInput] = useState('');
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [stopPanicConfirmed, setStopPanicConfirmed] = useState(false);

    // useEffect(() => {
    //     const getCameraPermission = async () => {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //             setHasCameraPermission(true);

    //             if (videoRef.current) {
    //                 videoRef.current.srcObject = stream;
    //             }
    //         } catch (error) {
    //             console.error('Error accessing camera:', error);
    //             setHasCameraPermission(false);
    //             toast({
    //                 variant: 'destructive',
    //                 title: 'Camera Access Denied',
    //                 description: 'Please enable camera permissions in your browser settings to use this app.',
    //             });
    //         }
    //     };

    //     getCameraPermission();
    // }, [toast]);

    const triggerEmergencySequence = async () => {
        toast({
            title: "Emergency sequence initiated!",
            description: "Recording video and audio and assessing the situation...",
        });

        try {
            // Simulate recording video and audio
            const videoUrl = "https://example.com/simulated-video.mp4";
            const audioUrl = "https://example.com/simulated-audio.mp3";
            const frontCameraPicture = "https://picsum.photos/200/300"; // Placeholder
            const rearCameraPicture = "https://picsum.photos/200/300"; // Placeholder
            const location = await getCurrentLocation();

            // Store event details in local storage
            const eventData = {
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                frontCameraPicture,
                rearCameraPicture,
                videoUrl,
                gpsCoordinates: `${location.lat}, ${location.lng}`,
            };
             // Persist the new event
                localStorage.setItem('lastEmergencyEvent', JSON.stringify(eventData));
                localStorage.setItem("emergency", 'true');
                setEmergency(true);

        } catch (error: any) {
            toast({
                title: "Error assessing situation",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleStopPanic = () => {
        setShowPinDialog(true);
        const storedPin = localStorage.getItem("pinCode");
        setEmergencyPin(storedPin);
    };

    const validatePin = () => {
        if (pinInput === emergencyPin) {
            setStopPanicConfirmed(true);
            setShowPinDialog(false);
            setPinInput('');
            toast({
                title: "Emergency sequence stopped!",
                description: "Emergency mode deactivated.",
            });

            // Retrieve the last emergency event from localStorage
            const lastEmergencyEvent = localStorage.getItem('lastEmergencyEvent');

            if (lastEmergencyEvent) {
                // Parse the event data
                const eventData = JSON.parse(lastEmergencyEvent);

                // Retrieve alert history from localStorage
                const storedAlerts = localStorage.getItem("alertHistory");
                let alertHistory = storedAlerts ? JSON.parse(storedAlerts) : [];

                // Add the new event to the alert history
                alertHistory.push(eventData);

                // Persist the updated alert history
                localStorage.setItem("alertHistory", JSON.stringify(alertHistory));
            }

            // Clear emergency status from local storage
            localStorage.removeItem('lastEmergencyEvent');
                localStorage.setItem("emergency", 'false');
                setEmergency(false);
            router.push('/');
        } else {
            toast({
                variant: 'destructive',
                title: "Incorrect PIN",
                description: "Please enter the correct emergency PIN code.",
            });
            setPinInput('');
        }
    };

    const emergencyActive = searchParams.get("emergency") === "true";

    return (
        <div className="flex flex-col h-screen w-screen items-center justify-start bg-background text-foreground">
            <Toaster/>

            {/* App Logo Placeholder */}
            <div className="mt-8 mb-4">
                {/* Replace with your app logo */}
                <img
                    src="/GA logo.JPG" // Path to your logo image
                    alt="Guardian Angel Logo"
                    className="h-20"
                />
            </div>

            {emergencyActive && <EmergencyDisplay/>}

            <div className="flex flex-col items-center justify-center space-y-4">
                <ActiveMonitoringButton
                    activeMonitoring={activeMonitoring}
                    toggleActiveMonitoring={toggleActiveMonitoring}
                    className="w-72"
                />
                <div className="flex items-center justify-center">
                    <PanicButton className="w-72" triggerEmergencySequence={triggerEmergencySequence}/>
                    {emergencyActive && (
                        <Button
                            variant="destructive"
                            className="ml-4"
                            onClick={handleStopPanic}
                        >
                            Stop Panic
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
                                <label htmlFor="pin" className="text-right font-medium">
                                    PIN Code
                                </label>
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
                                <Input type="text" id="name" value={name} readOnly className="col-span-3"/>
                                <Switch id="showName" checked={showName}
                                        className="col-span-1 data-[state=checked]:bg-primary"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="age" className="text-right font-medium">
                                    Age
                                </label>
                                <Input type="text" id="age" value={age} readOnly className="col-span-3"/>
                                <Switch id="showAge" checked={showAge}
                                        className="col-span-1 data-[state=checked]:bg-primary"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="address" className="text-right font-medium">
                                    Address
                                </label>
                                <Input type="text" id="address" value={address} readOnly className="col-span-3"/>
                                <Switch id="showAddress" checked={showAddress}
                                        className="col-span-1 data-[state=checked]:bg-primary"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="bloodType" className="text-right font-medium">
                                    Blood Type
                                </label>
                                <Input type="text" id="bloodType" value={bloodType} readOnly className="col-span-3"/>
                                <Switch id="showBloodType" checked={showBloodType}
                                        className="col-span-1 data-[state=checked]:bg-primary"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="medicalConditions" className="text-right font-medium">
                                    Medical Conditions
                                </label>
                                <Input type="text" id="medicalConditions" value={medicalConditions} readOnly
                                       className="col-span-3"/>
                                <Switch id="showMedicalConditions" checked={showMedicalConditions}
                                        className="col-span-1 data-[state=checked]:bg-primary"/>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="vehicleInformation" className="text-right font-medium">
                                    Vehicle Information
                                </label>
                                <Input type="text" id="vehicleInformation" value={vehicleInformation} readOnly
                                       className="col-span-3"/>
                                <Switch id="showVehicleInformation" checked={showVehicleInformation}
                                        className="col-span-1 data-[state=checked]:bg-primary"/>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Advertisement Placeholder */}
            <div className="mt-auto mb-4">
                {/* Replace with your advertisement content */}
                <img src="/Advert logo.JPG" alt="Prosegur Alarms Advertisement" className="w-80 rounded-md"/>
            </div>
            <div className="absolute top-4 right-4">
                <SettingsButton updateSoundEnabled={updateSoundEnabled}/>
            </div>
            <video ref={videoRef} className="w-0 h-0" autoPlay muted
                   style={{position: "absolute", left: -1000, top: -1000}}/>
        </div>
    );
}
