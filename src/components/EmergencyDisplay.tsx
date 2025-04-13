
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Location, getCurrentLocation } from "@/services/location";

export function EmergencyDisplay() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);
    };

    getLocation();
  }, []);

  // Placeholder for user's critical health information
  const healthInfo = {
    name: "John Doe",
    bloodType: "O+",
    allergies: "Peanuts, Shellfish",
    medicalConditions: "Asthma",
  };

  return (
    <Card className="w-96 bg-card text-card-foreground shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Emergency Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Health Information:</h3>
          <p>Name: {healthInfo.name}</p>
          <p>Blood Type: {healthInfo.bloodType}</p>
          <p>Allergies: {healthInfo.allergies}</p>
          <p>Medical Conditions: {healthInfo.medicalConditions}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Current Location:</h3>
          {location ? (
            <p>
              Latitude: {location.lat}, Longitude: {location.lng}
            </p>
          ) : (
            <p>Loading location...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
