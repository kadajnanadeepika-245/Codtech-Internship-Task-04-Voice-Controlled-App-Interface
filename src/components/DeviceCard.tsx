import React from "react";
import {
  Lightbulb,
  Thermometer,
  Lock,
  Shield,
  Camera,
  Speaker,
  Tv,
  Wind,
  Power,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type DeviceType =
  | "light"
  | "thermostat"
  | "lock"
  | "security"
  | "camera"
  | "speaker"
  | "tv"
  | "fan";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: "on" | "off" | "locked" | "unlocked" | "armed" | "disarmed";
  value?: number;
  unit?: string;
  room?: string;
  battery?: number;
  isOnline: boolean;
}

interface DeviceCardProps {
  device: Device;
  onToggle: (deviceId: string) => void;
  onValueChange: (deviceId: string, value: number) => void;
  onSettings: (deviceId: string) => void;
  className?: string;
}

const deviceIcons = {
  light: Lightbulb,
  thermostat: Thermometer,
  lock: Lock,
  security: Shield,
  camera: Camera,
  speaker: Speaker,
  tv: Tv,
  fan: Wind,
};

const deviceColors = {
  light: "smart-orange",
  thermostat: "smart-blue",
  lock: "smart-purple",
  security: "smart-green",
  camera: "smart-blue",
  speaker: "smart-purple",
  tv: "smart-blue",
  fan: "smart-green",
};

export function DeviceCard({
  device,
  onToggle,
  onValueChange,
  onSettings,
  className,
}: DeviceCardProps) {
  const DeviceIcon = deviceIcons[device.type];
  const colorClass = deviceColors[device.type];

  const isActive =
    device.status === "on" ||
    device.status === "locked" ||
    device.status === "armed";

  const getStatusText = () => {
    switch (device.type) {
      case "thermostat":
        return `${device.value}°${device.unit || "C"}`;
      case "light":
        return device.status === "on"
          ? `${device.value || 100}% brightness`
          : "Off";
      case "lock":
        return device.status === "locked" ? "Locked" : "Unlocked";
      case "security":
        return device.status === "armed" ? "Armed" : "Disarmed";
      default:
        return device.status === "on" ? "On" : "Off";
    }
  };

  const handleValueChange = (newValue: number[]) => {
    onValueChange(device.id, newValue[0]);
  };

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "border-2 hover:border-primary/20",
        !device.isOnline && "opacity-60",
        className,
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "p-2 rounded-lg transition-colors duration-300",
                isActive
                  ? `bg-${colorClass} text-${colorClass}-foreground`
                  : "bg-muted text-muted-foreground",
              )}
            >
              <DeviceIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{device.name}</h3>
              {device.room && (
                <p className="text-xs text-muted-foreground">{device.room}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!device.isOnline && (
              <div className="w-2 h-2 bg-destructive rounded-full" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSettings(device.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Controls */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{getStatusText()}</span>

          {device.type !== "thermostat" && (
            <Switch
              checked={isActive}
              onCheckedChange={() => onToggle(device.id)}
              disabled={!device.isOnline}
            />
          )}
        </div>

        {/* Value Controls */}
        {(device.type === "light" || device.type === "thermostat") &&
          device.value !== undefined && (
            <div className="space-y-2">
              <Slider
                value={[device.value]}
                onValueChange={handleValueChange}
                max={device.type === "thermostat" ? 30 : 100}
                min={device.type === "thermostat" ? 10 : 0}
                step={device.type === "thermostat" ? 1 : 5}
                disabled={
                  !device.isOnline ||
                  (device.type === "light" && device.status === "off")
                }
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{device.type === "thermostat" ? "10°" : "0%"}</span>
                <span>{device.type === "thermostat" ? "30°" : "100%"}</span>
              </div>
            </div>
          )}

        {/* Battery Indicator */}
        {device.battery !== undefined && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Power className="w-3 h-3" />
            <span>{device.battery}%</span>
            <div className="flex-1 bg-muted rounded-full h-1">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  device.battery > 20 ? "bg-smart-green" : "bg-destructive",
                )}
                style={{ width: `${device.battery}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
