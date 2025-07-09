import React, { useState, useEffect, createContext, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Bell,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHide?: boolean;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-success-50",
    borderColor: "border-success-200",
    iconColor: "text-success-600",
    titleColor: "text-success-800",
  },
  info: {
    icon: Bell,
    bgColor: "bg-primary-50",
    borderColor: "border-primary-200",
    iconColor: "text-primary-600",
    titleColor: "text-primary-800",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-800",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-destructive-50",
    borderColor: "border-destructive-200",
    iconColor: "text-destructive-600",
    titleColor: "text-destructive-800",
  },
};

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => {
    const id = Date.now().toString();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      autoHide: notification.autoHide ?? true,
      duration: notification.duration ?? 5000,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-hide notification
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    // Request notification permission and send push notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Simulate transaction notifications for demo
  useEffect(() => {
    const simulateNotifications = () => {
      // Simulate a processing notification after 3 seconds
      setTimeout(() => {
        addNotification({
          type: "info",
          title: "Transfer Diproses",
          message: "Transfer Anda ke Ibu Siti sedang diproses oleh bank.",
          action: {
            label: "Lihat Detail",
            onClick: () => console.log("View transaction details"),
          },
        });
      }, 3000);

      // Simulate a success notification after 8 seconds
      setTimeout(() => {
        addNotification({
          type: "success",
          title: "Transfer Berhasil!",
          message: "Transfer $500 ke Ibu Siti telah berhasil diterima.",
          action: {
            label: "Lihat Bukti",
            onClick: () => console.log("View receipt"),
          },
        });
      }, 8000);
    };

    // Only simulate notifications if there are none
    if (notifications.length === 0) {
      simulateNotifications();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification, clearAll }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 space-y-2 max-w-md mx-auto">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: () => void;
}) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "shadow-lg border-l-4 animate-in slide-in-from-top-2",
        config.bgColor,
        config.borderColor,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon
            className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)}
          />
          <div className="flex-1 min-w-0">
            <h4 className={cn("font-semibold text-sm", config.titleColor)}>
              {notification.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {notification.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {notification.timestamp.toLocaleTimeString("id-ID")}
            </p>
            {notification.action && (
              <Button
                variant="link"
                size="sm"
                onClick={notification.action.onClick}
                className="p-0 h-auto mt-2 text-primary"
              >
                {notification.action.label}
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onDismiss}
            className="h-6 w-6 bg-background/50 text-muted-foreground border-border/50 hover:text-foreground hover:bg-background hover:border-border"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper hooks for common notification scenarios
export const useTransactionNotifications = () => {
  const { addNotification } = useNotifications();

  const notifyTransactionStarted = (amount: string, recipient: string) => {
    addNotification({
      type: "info",
      title: "Transfer Dimulai",
      message: `Transfer $${amount} ke ${recipient} sedang diproses.`,
      autoHide: false,
    });
  };

  const notifyTransactionProcessing = (transactionId: string) => {
    addNotification({
      type: "info",
      title: "Transfer Diproses",
      message: `Transfer dengan ID ${transactionId} sedang diproses bank.`,
      action: {
        label: "Lacak Status",
        onClick: () => console.log("Track transaction:", transactionId),
      },
    });
  };

  const notifyTransactionSuccess = (
    amount: string,
    recipient: string,
    transactionId: string,
  ) => {
    addNotification({
      type: "success",
      title: "Transfer Berhasil! 🎉",
      message: `Transfer $${amount} ke ${recipient} telah berhasil diterima.`,
      action: {
        label: "Lihat Bukti",
        onClick: () => console.log("View receipt:", transactionId),
      },
    });
  };

  const notifyTransactionFailed = (
    amount: string,
    recipient: string,
    reason?: string,
  ) => {
    addNotification({
      type: "error",
      title: "Transfer Gagal",
      message: `Transfer $${amount} ke ${recipient} gagal. ${reason || "Silakan coba lagi."}`,
      action: {
        label: "Coba Lagi",
        onClick: () => console.log("Retry transfer"),
      },
      autoHide: false,
    });
  };

  const notifyExchangeRateUpdate = (oldRate: number, newRate: number) => {
    const change = ((newRate - oldRate) / oldRate) * 100;
    addNotification({
      type: "info",
      title: "Nilai Tukar Diperbarui",
      message: `Nilai tukar ${change > 0 ? "naik" : "turun"} ${Math.abs(change).toFixed(2)}%. Nilai tukar sekarang: Rp ${newRate.toLocaleString("id-ID")}`,
      duration: 3000,
    });
  };

  const notifyLowBalance = (currentBalance: number) => {
    addNotification({
      type: "warning",
      title: "Saldo Rendah",
      message: `Saldo Anda tinggal $${currentBalance.toFixed(2)}. Silakan top up untuk melanjutkan transfer.`,
      action: {
        label: "Top Up",
        onClick: () => console.log("Top up balance"),
      },
      autoHide: false,
    });
  };

  return {
    notifyTransactionStarted,
    notifyTransactionProcessing,
    notifyTransactionSuccess,
    notifyTransactionFailed,
    notifyExchangeRateUpdate,
    notifyLowBalance,
  };
};
