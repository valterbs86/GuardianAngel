"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";

export function EmergencyContacts() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "", phone: "", email: "" },
  ]);
  const [notificationMethod, setNotificationMethod] = useState("sms");
  const [personalizedMessage, setPersonalizedMessage] = useState("");

  useEffect(() => {
    // Load data from localStorage on component mount
    const storedContacts = localStorage.getItem("emergencyContacts");
    const storedNotificationMethod = localStorage.getItem("notificationMethod");
    const storedPersonalizedMessage = localStorage.getItem("personalizedMessage");

    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
    if (storedNotificationMethod) {
      setNotificationMethod(storedNotificationMethod);
    }
    if (storedPersonalizedMessage) {
      setPersonalizedMessage(storedPersonalizedMessage);
    }
  }, []);

  const addContact = () => {
    setContacts([
      ...contacts,
      { id: contacts.length + 1, name: "", phone: "", email: "" },
    ]);
  };

  const updateContact = (
    id: number,
    field: string,
    value: string
  ) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === id ? { ...contact, [field]: value } : contact
    );
    setContacts(updatedContacts);
  };

  const deleteContact = (id: number) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Persist settings in localStorage
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
    localStorage.setItem("notificationMethod", notificationMethod);
    localStorage.setItem("personalizedMessage", personalizedMessage);

    console.log("Form submitted", {
      contacts,
      notificationMethod,
      personalizedMessage,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="settings-panel">
      <h2>Configure Emergency Contacts</h2>

      {contacts.map((contact) => (
        <div key={contact.id} className="emergency-contact">
          <h3>Contact #{contact.id}</h3>
          <div>
            <Label htmlFor={`contactName-${contact.id}`}>Contact Name</Label>
            <Input
              type="text"
              id={`contactName-${contact.id}`}
              value={contact.name}
              onChange={(e) =>
                updateContact(contact.id, "name", e.target.value)
              }
              placeholder="Enter contact name"
            />
          </div>
          <div>
            <Label htmlFor={`contactPhone-${contact.id}`}>Phone Number</Label>
            <Input
              type="text"
              id={`contactPhone-${contact.id}`}
              value={contact.phone}
              onChange={(e) =>
                updateContact(contact.id, "phone", e.target.value)
              }
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor={`contactEmail-${contact.id}`}>Email Address</Label>
            <Input
              type="email"
              id={`contactEmail-${contact.id}`}
              value={contact.email}
              onChange={(e) =>
                updateContact(contact.id, "email", e.target.value)
              }
              placeholder="Enter email address"
            />
          </div>
           <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => deleteContact(contact.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
        </div>
      ))}

      <Button type="button" onClick={addContact}>
        Add New Contact
      </Button>

      <h3>Notification Preferences</h3>
      <div>
        <Label htmlFor="notificationMethod">Notification Method</Label>
        <Select onValueChange={(value) => setNotificationMethod(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select notification method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="personalizedMessage">Personalized Emergency Message</Label>
        <Textarea
          id="personalizedMessage"
          value={personalizedMessage}
          onChange={(e) => setPersonalizedMessage(e.target.value)}
          placeholder="Enter your personalized emergency message"
        />
      </div>

      <Button type="submit">Save Contacts</Button>
    </form>
  );
}
