
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

export function SettingsButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Configure your emergency contacts, communication preferences, and feature toggles.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Settings content will go here */}
          <p>Settings content coming soon...</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
