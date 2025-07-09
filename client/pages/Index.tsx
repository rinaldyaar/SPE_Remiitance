import React, { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Send,
  Clock,
  TrendingUp,
  Calculator,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Smartphone,
  Building2,
  RefreshCw,
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock exchange rate data with real-time simulation
const getExchangeRate = () => ({
  rate: 15780 + Math.floor(Math.random() * 100 - 50), // Simulate fluctuation
  change: (Math.random() - 0.5) * 2, // Random change between -1% and +1%
  lastUpdated: new Date(),
});

// Mock recent transactions
const recentTransactions = [
  {
    id: "1",
    amount: "500",
    currency: "USD",
    recipient: "Ibu Siti",
    bank: "Bank Mandiri",
    status: "completed",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    reference: "TXN-2024-001",
  },
  {
    id: "2",
    amount: "300",
    currency: "USD",
    recipient: "Bapak Ahmad",
    bank: "Bank BCA",
    status: "processing",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    reference: "TXN-2024-002",
  },
  {
    id: "3",
    amount: "750",
    currency: "USD",
    recipient: "Sari Dewi",
    bank: "Bank BRI",
    status: "completed",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reference: "TXN-2024-003",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState(getExchangeRate());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if user needs onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    if (!onboardingCompleted) {
      navigate("/onboarding");
    }
  }, [navigate]);

  // Auto-refresh exchange rate every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRate(getExchangeRate());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMoney = () => {
    navigate("/send");
  };

  const handleViewHistory = () => {
    navigate("/history");
  };

  const handleQuickCalculator = () => {
    // Scroll to calculator section
    document.getElementById("calculator-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const refreshExchangeRate = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setExchangeRate(getExchangeRate());
    setIsRefreshing(false);
  };

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const calculateIDR = (usd: string) => {
    const amount = parseFloat(usd);
    if (isNaN(amount)) return "";
    return formatCurrency(amount * exchangeRate.rate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-success";
      case "processing":
        return "text-yellow-600";
      case "failed":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "processing":
        return "Proses";
      case "failed":
        return "Gagal";
      default:
        return "Unknown";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "processing":
        return "bg-yellow-500";
      case "failed":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Welcome Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Selamat datang! 👋</h1>
            <p className="text-muted-foreground">
              Kirim uang ke Indonesia dengan mudah dan aman
            </p>
          </div>

          {/* Balance Card - Fixed visibility issue */}
          <Card
            variant="elevated"
            className="bg-gradient-to-r from-primary to-primary-600 text-white border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-primary-100 text-sm">Saldo Anda</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex-1">
                      {showBalance ? (
                        <span className="text-2xl font-bold">$2,450.00</span>
                      ) : (
                        <span className="text-2xl font-bold">••••••</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      className="h-9 w-9 text-white hover:bg-white/10 border border-white/20 hover:border-white/30 transition-smooth flex-shrink-0"
                    >
                      {showBalance ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-primary-100 ml-4" />
              </div>
            </CardContent>
          </Card>

          {/* Send Money Button */}
          <Button
            onClick={handleSendMoney}
            size="lg"
            className="w-full shadow-lg"
          >
            <Send className="h-5 w-5" />
            Kirim Uang Sekarang
          </Button>
        </div>

        {/* Exchange Rate Calculator */}
        <Card id="calculator-section">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Kalkulator Nilai Tukar
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshExchangeRate}
                disabled={isRefreshing}
                className="h-8 w-8"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Rate */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">1 USD =</p>
                <p className="font-semibold text-lg">
                  {formatCurrency(exchangeRate.rate)}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  exchangeRate.change >= 0
                    ? "text-success"
                    : "text-destructive",
                )}
              >
                {exchangeRate.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {Math.abs(exchangeRate.change).toFixed(2)}%
              </div>
            </div>

            {/* Calculator */}
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="Masukkan jumlah USD"
                value={calculatorAmount}
                onChange={(e) => setCalculatorAmount(e.target.value)}
                className="text-lg"
              />
              {calculatorAmount && (
                <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                  <p className="text-sm text-success-700 mb-1">
                    Penerima akan dapat:
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {calculateIDR(calculatorAmount)}
                  </p>
                  <p className="text-xs text-success-600 mt-2">
                    *Belum termasuk biaya transfer ($4.99)
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Terakhir diperbarui:{" "}
              {exchangeRate.lastUpdated.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Transaksi Terakhir
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewHistory}
                className="text-primary"
              >
                Lihat Semua
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
                  onClick={() => {
                    alert(
                      `Detail Transaksi:\nReferensi: ${transaction.reference}\nPenerima: ${transaction.recipient}\nBank: ${transaction.bank}\nJumlah: $${transaction.amount}\nStatus: ${getStatusText(transaction.status)}`,
                    );
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{transaction.recipient}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.bank} •{" "}
                        {transaction.date.toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${transaction.amount}</p>
                    <div className="flex items-center gap-1 justify-end">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getStatusDot(transaction.status),
                        )}
                      />
                      <p
                        className={cn(
                          "text-xs capitalize",
                          getStatusColor(transaction.status),
                        )}
                      >
                        {getStatusText(transaction.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Belum ada transaksi</p>
                <Button
                  variant="link"
                  onClick={handleSendMoney}
                  className="mt-2"
                >
                  Mulai kirim uang
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Now Functional */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:shadow-md transition-smooth"
            onClick={handleViewHistory}
          >
            <CardContent className="p-4 text-center">
              <History className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Riwayat Lengkap</p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-smooth"
            onClick={handleQuickCalculator}
          >
            <CardContent className="p-4 text-center">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Kalkulator</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support - Enhanced */}
        <Card className="bg-trust/5 border-trust/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Butuh bantuan?</p>
                <p className="text-xs text-muted-foreground">
                  Hubungi kami via WhatsApp 24/7
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const whatsappUrl =
                    "https://wa.me/6281234567890?text=Halo%2C%20saya%20butuh%20bantuan%20dengan%20aplikasi%20transfer%20uang";
                  window.open(whatsappUrl, "_blank");
                }}
                className="border-success text-success hover:bg-success hover:text-white"
              >
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
