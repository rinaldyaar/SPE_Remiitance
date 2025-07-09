import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Shield, Banknote } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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

  const handleWhatsApp = () => {
    // Indonesian WhatsApp support number (example)
    const whatsappUrl =
      "https://wa.me/6281234567890?text=Halo%2C%20saya%20butuh%20bantuan%20dengan%20aplikasi%20transfer%20uang";
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-inset">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {showBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {title ? (
              <h1 className="text-xl font-semibold">{title}</h1>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Banknote className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-primary">
                    KirimUang
                  </span>
                </div>
              </div>
            )}
          </div>

          {showWhatsApp && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWhatsApp}
              className="h-10 w-10 text-success"
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
          </div>
        </footer>
      )}
    </div>
  );
}
