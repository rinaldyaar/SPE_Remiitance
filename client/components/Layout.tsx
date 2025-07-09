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
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Offline indicator - responsive */}
      {!isOnline && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4">
          <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
            <WifiOff className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tidak ada koneksi internet</span>
          </div>
        </div>
      )}

      {/* Header - responsive */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="w-full">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto">
            {/* Left side - responsive */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {showBack && (
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={handleBack}
                  className="bg-muted/50 border-border hover:bg-muted hover:border-primary touch-manipulation active:scale-95 flex-shrink-0"
                  title="Go back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}

              {title ? (
                <h1 className="text-lg sm:text-xl font-semibold text-balance truncate">
                  {title}
                </h1>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    <span className="text-lg sm:text-xl font-bold text-primary hidden xs:block">
                      KirimUang
                    </span>
                    <span className="text-lg font-bold text-primary xs:hidden">
                      KU
                    </span>
                  </div>

                  {/* Online status indicator */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {isOnline ? (
                      <Wifi className="h-3 w-3 text-success" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right side - responsive */}
            {showWhatsApp && (
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleWhatsApp}
                className="bg-success/10 text-success border-success/30 hover:bg-success/20 hover:border-success/50 touch-manipulation active:scale-95 flex-shrink-0"
                aria-label="Hubungi Customer Service via WhatsApp"
                title="Contact WhatsApp Support"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - responsive container */}
      <main className={cn("flex-1 flex flex-col w-full", className)}>
        {children}
      </main>

      {/* Trust Indicator Footer - responsive */}
      {location.pathname === "/" && (
        <footer className="bg-muted/50 border-t border-border">
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-trust flex-shrink-0" />
                <span className="text-balance">{t("trust.bankIndonesia")}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  🔒 {t("trust.sslEncrypted")}
                </span>
                <span className="flex items-center gap-1">
                  🛡️ {t("trust.fdicInsured")}
                </span>
                <span className="flex items-center gap-1">
                  📱 {t("trust.support247")}
                </span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
