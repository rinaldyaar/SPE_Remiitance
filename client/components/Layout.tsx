import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MessageCircle,
  Shield,
  Banknote,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showWhatsApp?: boolean;
  className?: string;
}

export function Layout({
  children,
  title,
  showBack = false,
  showWhatsApp = true,
  className,
}: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleWhatsApp = () => {
    // Indonesian WhatsApp support number (example)
    const whatsappUrl =
      "https://wa.me/6281234567890?text=Halo%2C%20saya%20butuh%20bantuan%20dengan%20aplikasi%20transfer%20uang%20KirimUang";
    window.open(whatsappUrl, "_blank");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>Tidak ada koneksi internet</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {showBack && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="h-10 w-10 bg-muted/50 border-border hover:bg-muted hover:border-primary touch-manipulation active:scale-95"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {title ? (
              <h1 className="text-xl font-semibold text-balance">{title}</h1>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Banknote className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    KirimUang
                  </span>
                </div>
                {/* Online status indicator */}
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <Wifi className="h-3 w-3 text-success" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            )}
          </div>

          {showWhatsApp && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleWhatsApp}
              className="h-10 w-10 bg-success/10 text-success border-success/30 hover:bg-success/20 hover:border-success/50 touch-manipulation active:scale-95"
              aria-label="Hubungi Customer Service via WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={cn("flex-1 flex flex-col", className)}>{children}</main>

      {/* Trust Indicator Footer */}
      {location.pathname === "/" && (
        <footer className="bg-muted/50 border-t border-border">
          <div className="container px-4 py-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-trust" />
              <span>Terdaftar dan diawasi oleh Bank Indonesia</span>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>🔒 SSL Encrypted</span>
              <span>🛡️ FDIC Insured</span>
              <span>📱 24/7 Support</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
