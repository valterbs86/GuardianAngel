
import { PanicButton } from "@/components/PanicButton";
import { EmergencyDisplay } from "@/components/EmergencyDisplay";
import { SettingsButton } from "@/components/SettingsButton";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-background text-foreground">
      <Toaster />
      <div className="absolute top-4 left-4">
        <SettingsButton />
      </div>
      <EmergencyDisplay />
      <PanicButton />
    </div>
  );
}
