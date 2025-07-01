import React, { useState, useCallback } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceControlProps {
  onCommand: (command: string) => void;
  className?: string;
}

type VoiceState = "idle" | "listening" | "processing" | "speaking";

export function VoiceControl({ onCommand, className }: VoiceControlProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [lastCommand, setLastCommand] = useState<string>("");
  const [isSupported] = useState(
    () => "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
  );

  const toggleListening = useCallback(() => {
    if (!isSupported) {
      alert(
        "Voice recognition is not supported in this browser. Please try Chrome or Edge.",
      );
      return;
    }

    if (voiceState === "listening") {
      setVoiceState("idle");
      return;
    }

    setVoiceState("listening");

    // Simulate voice recognition (in real app, use Web Speech API)
    setTimeout(() => {
      const mockCommands = [
        "Turn off the lights",
        "Set thermostat to 22 degrees",
        "Lock the front door",
        "Turn on living room lights",
        "Set bedroom temperature to 20 degrees",
        "Show security cameras",
      ];

      const command =
        mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setLastCommand(command);
      setVoiceState("processing");

      setTimeout(() => {
        onCommand(command);
        setVoiceState("speaking");

        setTimeout(() => {
          setVoiceState("idle");
        }, 2000);
      }, 1000);
    }, 2000);
  }, [voiceState, onCommand, isSupported]);

  const getStateText = () => {
    switch (voiceState) {
      case "listening":
        return "Listening...";
      case "processing":
        return "Processing...";
      case "speaking":
        return "Executing command";
      default:
        return "Tap to speak";
    }
  };

  const getStateIcon = () => {
    if (voiceState === "speaking") return Volume2;
    if (voiceState === "listening") return Mic;
    return voiceState === "idle" ? Mic : MicOff;
  };

  const StateIcon = getStateIcon();

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Voice Button */}
      <div className="relative">
        {/* Pulse rings for listening state */}
        {voiceState === "listening" && (
          <>
            <div className="absolute inset-0 rounded-full bg-smart-blue animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-smart-blue animate-pulse-ring animation-delay-75" />
            <div className="absolute inset-0 rounded-full bg-smart-blue animate-pulse-ring animation-delay-150" />
          </>
        )}

        <Button
          size="lg"
          onClick={toggleListening}
          disabled={voiceState === "processing"}
          className={cn(
            "relative w-24 h-24 rounded-full shadow-2xl transition-all duration-300",
            "hover:scale-105 active:scale-95",
            {
              "bg-smart-blue hover:bg-smart-blue/90 animate-listening-glow":
                voiceState === "listening",
              "bg-smart-green hover:bg-smart-green/90":
                voiceState === "speaking",
              "bg-smart-orange hover:bg-smart-orange/90 animate-breathing":
                voiceState === "processing",
              "bg-primary hover:bg-primary/90": voiceState === "idle",
            },
          )}
        >
          <StateIcon className="w-8 h-8 text-white" />
        </Button>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <p
          className={cn("text-lg font-medium transition-colors duration-300", {
            "text-smart-blue": voiceState === "listening",
            "text-smart-green": voiceState === "speaking",
            "text-smart-orange": voiceState === "processing",
            "text-muted-foreground": voiceState === "idle",
          })}
        >
          {getStateText()}
        </p>

        {lastCommand && voiceState !== "idle" && (
          <p className="text-sm text-muted-foreground bg-smart-surface px-4 py-2 rounded-full max-w-md">
            "{lastCommand}"
          </p>
        )}
      </div>

      {/* Voice Commands Help */}
      {voiceState === "idle" && (
        <div className="text-center space-y-2 max-w-md">
          <p className="text-xs text-muted-foreground">Try saying:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              '"Turn off the lights"',
              '"Set temperature to 22°C"',
              '"Lock the doors"',
            ].map((example) => (
              <span
                key={example}
                className="text-xs bg-smart-surface text-smart-surface-foreground px-2 py-1 rounded-md"
              >
                {example}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
