import React, { useState } from "react";
import { Plus, Home, Settings, User, Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeviceCard, Device } from "./DeviceCard";
import { VoiceControl } from "./VoiceControl";
import { cn } from "@/lib/utils";

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "Living Room Lights",
      type: "light",
      status: "on",
      value: 75,
      room: "Living Room",
      isOnline: true,
    },
    {
      id: "2",
      name: "Main Thermostat",
      type: "thermostat",
      status: "on",
      value: 22,
      unit: "C",
      room: "Hallway",
      isOnline: true,
    },
    {
      id: "3",
      name: "Front Door",
      type: "lock",
      status: "locked",
      room: "Entrance",
      battery: 85,
      isOnline: true,
    },
    {
      id: "4",
      name: "Security System",
      type: "security",
      status: "disarmed",
      room: "Main Panel",
      isOnline: true,
    },
    {
      id: "5",
      name: "Bedroom Lights",
      type: "light",
      status: "off",
      value: 0,
      room: "Bedroom",
      isOnline: true,
    },
    {
      id: "6",
      name: "Kitchen Camera",
      type: "camera",
      status: "on",
      room: "Kitchen",
      isOnline: false,
    },
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDeviceToggle = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === deviceId) {
          let newStatus: Device["status"];

          switch (device.type) {
            case "lock":
              newStatus = device.status === "locked" ? "unlocked" : "locked";
              break;
            case "security":
              newStatus = device.status === "armed" ? "disarmed" : "armed";
              break;
            default:
              newStatus = device.status === "on" ? "off" : "on";
          }

          return { ...device, status: newStatus };
        }
        return device;
      }),
    );
  };

  const handleDeviceValueChange = (deviceId: string, value: number) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, value } : device,
      ),
    );
  };

  const handleDeviceSettings = (deviceId: string) => {
    console.log("Settings for device:", deviceId);
  };

  const handleVoiceCommand = (command: string) => {
    console.log("Voice command received:", command);

    // Simple command processing (in real app, use NLP)
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes("turn off") && lowerCommand.includes("light")) {
      setDevices((prev) =>
        prev.map((device) =>
          device.type === "light"
            ? { ...device, status: "off" as const }
            : device,
        ),
      );
    } else if (
      lowerCommand.includes("turn on") &&
      lowerCommand.includes("light")
    ) {
      setDevices((prev) =>
        prev.map((device) =>
          device.type === "light"
            ? { ...device, status: "on" as const }
            : device,
        ),
      );
    } else if (
      lowerCommand.includes("thermostat") ||
      lowerCommand.includes("temperature")
    ) {
      const tempMatch = lowerCommand.match(/(\d+)/);
      if (tempMatch) {
        const temp = parseInt(tempMatch[1]);
        setDevices((prev) =>
          prev.map((device) =>
            device.type === "thermostat" ? { ...device, value: temp } : device,
          ),
        );
      }
    } else if (lowerCommand.includes("lock")) {
      setDevices((prev) =>
        prev.map((device) =>
          device.type === "lock"
            ? { ...device, status: "locked" as const }
            : device,
        ),
      );
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const onlineDevices = devices.filter((d) => d.isOnline).length;
  const activeDevices = devices.filter(
    (d) => d.status === "on" || d.status === "locked" || d.status === "armed",
  ).length;

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Home className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">SmartHome</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-smart-green">
              {onlineDevices} online
            </Badge>
            <Badge variant="outline" className="text-smart-blue">
              {activeDevices} active
            </Badge>

            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Voice Control Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Voice Control Center</h2>
            <p className="text-muted-foreground">
              Control your smart home with voice commands
            </p>
          </div>

          <VoiceControl
            onCommand={handleVoiceCommand}
            className="flex justify-center"
          />
        </section>

        {/* Devices Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Devices</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Device
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleDeviceToggle}
                onValueChange={handleDeviceValueChange}
                onSettings={handleDeviceSettings}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => handleVoiceCommand("turn off all lights")}
            >
              Turn Off All Lights
            </Button>
            <Button
              variant="outline"
              onClick={() => handleVoiceCommand("set thermostat to 20 degrees")}
            >
              Set Comfort Mode
            </Button>
            <Button
              variant="outline"
              onClick={() => handleVoiceCommand("lock all doors")}
            >
              Lock All Doors
            </Button>
            <Button
              variant="outline"
              onClick={() => handleVoiceCommand("good night")}
            >
              Good Night Mode
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
