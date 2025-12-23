"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Download, Smartphone } from "lucide-react";
import { logError, LogModule } from "@/lib/logger";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * PWA Installer Component
 * Shows install button when browser's native install prompt is available.
 */
const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Register service worker (required for PWA)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Service worker registered successfully
          // Optional: Check for updates
          registration.update();
        })
        .catch((error) => {
          logError({
            message: "Service Worker registration failed",
            error,
            context: { function: "PWAInstaller" },
            module: LogModule.App,
          });
        });
    }

    // Listen for browser's install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  // Only show when install prompt is available
  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-70 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              TaxiBoy Admin
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleInstallClick}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstaller;

