"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserSettings() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [vehicleInformation, setVehicleInformation] = useState("");
  const [cloudProvider, setCloudProvider] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [showName, setShowName] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showBloodType, setShowBloodType] = useState(true);
  const [showMedicalConditions, setShowMedicalConditions] = useState(true);
  const [showVehicleInformation, setShowVehicleInformation] = useState(true);

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedName = localStorage.getItem("name");
    const storedAge = localStorage.getItem("age");
    const storedAddress = localStorage.getItem("address");
    const storedBloodType = localStorage.getItem("bloodType");
    const storedMedicalConditions = localStorage.getItem("medicalConditions");
    const storedVehicleInformation = localStorage.getItem("vehicleInformation");
    const storedCloudProvider = localStorage.getItem("cloudProvider");
    const storedPinCode = localStorage.getItem("pinCode");

    const storedShowName = localStorage.getItem("showName");
    const storedShowAge = localStorage.getItem("showAge");
    const storedShowAddress = localStorage.getItem("showAddress");
    const storedShowBloodType = localStorage.getItem("showBloodType");
    const storedShowMedicalConditions = localStorage.getItem("showMedicalConditions");
    const storedShowVehicleInformation = localStorage.getItem("showVehicleInformation");

    if (storedName) setName(storedName);
    if (storedAge) setAge(storedAge);
    if (storedAddress) setAddress(storedAddress);
    if (storedBloodType) setBloodType(storedBloodType);
    if (storedMedicalConditions) setMedicalConditions(storedMedicalConditions);
    if (storedVehicleInformation) setVehicleInformation(storedVehicleInformation);
    if (storedCloudProvider) setCloudProvider(storedCloudProvider);
    if (storedPinCode) setPinCode(storedPinCode);

    if (storedShowName) setShowName(JSON.parse(storedShowName));
    if (storedShowAge) setShowAge(JSON.parse(storedShowAge));
    if (storedShowAddress) setShowAddress(JSON.parse(storedShowAddress));
    if (storedShowBloodType) setShowBloodType(JSON.parse(storedShowBloodType));
    if (storedShowMedicalConditions) setShowMedicalConditions(JSON.parse(storedShowMedicalConditions));
    if (storedShowVehicleInformation) setShowVehicleInformation(JSON.parse(storedShowVehicleInformation));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Persist settings in localStorage
    localStorage.setItem("name", name);
    localStorage.setItem("age", age);
    localStorage.setItem("address", address);
    localStorage.setItem("bloodType", bloodType);
    localStorage.setItem("medicalConditions", medicalConditions);
    localStorage.setItem("vehicleInformation", vehicleInformation);
    localStorage.setItem("cloudProvider", cloudProvider);
    localStorage.setItem("pinCode", pinCode);

    localStorage.setItem("showName", JSON.stringify(showName));
    localStorage.setItem("showAge", JSON.stringify(showAge));
    localStorage.setItem("showAddress", JSON.stringify(showAddress));
    localStorage.setItem("showBloodType", JSON.stringify(showBloodType));
    localStorage.setItem("showMedicalConditions", JSON.stringify(showMedicalConditions));
    localStorage.setItem("showVehicleInformation", JSON.stringify(showVehicleInformation));

    console.log("Form submitted", {
      name,
      age,
      address,
      bloodType,
      medicalConditions,
      vehicleInformation,
      cloudProvider,
      pinCode,
      showName,
      showAge,
      showAddress,
      showBloodType,
      showMedicalConditions,
      showVehicleInformation,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="settings-panel">
      <h2>User Settings / Registration</h2>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <div className="checkbox-group">
          <Checkbox id="showName" checked={showName} onCheckedChange={(checked) => setShowName(!!checked)} />
          <Label htmlFor="showName">Show on Emergency Screen</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          type="number"
          id="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter your age"
        />
        <div className="checkbox-group">
          <Checkbox id="showAge" checked={showAge} onCheckedChange={(checked) => setShowAge(!!checked)} />
          <Label htmlFor="showAge">Show on Emergency Screen</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
        />
        <div className="checkbox-group">
          <Checkbox id="showAddress" checked={showAddress} onCheckedChange={(checked) => setShowAddress(!!checked)} />
          <Label htmlFor="showAddress">Show on Emergency Screen</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="bloodType">Blood Type</Label>
        <Input
          type="text"
          id="bloodType"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          placeholder="Enter your blood type"
        />
        <div className="checkbox-group">
          <Checkbox id="showBloodType" checked={showBloodType} onCheckedChange={(checked) => setShowBloodType(!!checked)} />
          <Label htmlFor="showBloodType">Show on Emergency Screen</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="medicalConditions">Medical Conditions/Allergies</Label>
        <Input
          type="text"
          id="medicalConditions"
          value={medicalConditions}
          onChange={(e) => setMedicalConditions(e.target.value)}
          placeholder="Enter medical conditions/allergies"
        />
        <div className="checkbox-group">
          <Checkbox id="showMedicalConditions" checked={showMedicalConditions} onCheckedChange={(checked) => setShowMedicalConditions(!!checked)} />
          <Label htmlFor="showMedicalConditions">Show on Emergency Screen</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="vehicleInformation">Vehicle Information (Make/Model)</Label>
        <Input
          type="text"
          id="vehicleInformation"
          value={vehicleInformation}
          onChange={(e) => setVehicleInformation(e.target.value)}
          placeholder="Enter vehicle information"
        />
        <div className="checkbox-group">
          <Checkbox id="showVehicleInformation" checked={showVehicleInformation} onCheckedChange={(checked) => setShowVehicleInformation(!!checked)} />
          <Label htmlFor="showVehicleInformation">Show on Emergency Screen</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="cloudProvider">Cloud Provider</Label>
        <Select onValueChange={(value) => setCloudProvider(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select cloud provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="googleDrive">Google Drive</SelectItem>
            <SelectItem value="oneDrive">OneDrive</SelectItem>
            <SelectItem value="dropBox">DropBox</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="pinCode">Emergency Event Unlock Pin-Code</Label>
        <Input
          type="text"
          id="pinCode"
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder="Enter pin code"
        />
      </div>

      <Button type="submit">Save Settings</Button>
    </form>
  );
}
