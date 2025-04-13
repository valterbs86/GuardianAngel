"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSettings } from "@/components/UserSettings";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { AlertHistory } from "@/components/AlertHistory";
import { AppSettings } from "@/components/AppSettings";

interface SettingsButtonProps {
  updateSoundEnabled: (enabled: boolean) => void;
}

export function SettingsButton({ updateSoundEnabled }: SettingsButtonProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground p-2">
          <Settings className="mr-2 h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your emergency contacts, communication preferences, and feature toggles.
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="user" className="w-full settings-panel">
          <TabsList>
            <TabsTrigger value="user">User Settings</TabsTrigger>
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="history">Alert History</TabsTrigger>
            <TabsTrigger value="app">App Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <UserSettings />
          </TabsContent>
          <TabsContent value="contacts">
            <EmergencyContacts />
          </TabsContent>
          <TabsContent value="history">
            <AlertHistory />
          </TabsContent>
          <TabsContent value="app">
            <AppSettings updateSoundEnabled={updateSoundEnabled} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

