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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock exchange rate data
const exchangeRate = {
  rate: 15780,
  change: +0.5,
  lastUpdated: new Date(),
};

// Mock recent transactions
const recentTransactions = [
  {
    id: "1",
    amount: "500",
    currency: "USD",
    recipient: "Ibu Siti",
    status: "completed",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    amount: "300",
    currency: "USD",
    recipient: "Bapak Ahmad",
    status: "processing",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState("");

  // Check if user needs onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem("onboarding_completed");
    if (!onboardingCompleted) {
      navigate("/onboarding");
    }
  }, [navigate]);

  const handleSendMoney = () => {
    navigate("/send");
  };

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateIDR = (usd: string) => {
    const amount = parseFloat(usd);
    if (isNaN(amount)) return "";
    return formatCurrency(amount * exchangeRate.rate);
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

          {/* Balance Card */}
          <Card
            variant="elevated"
            className="bg-gradient-to-r from-primary to-primary-600 text-white border-0"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm">Saldo Anda</p>
                  <div className="flex items-center gap-2 mt-1">
                    {showBalance ? (
                      <span className="text-2xl font-bold">$2,450.00</span>
                    ) : (
                      <span className="text-2xl font-bold">••••••</span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowBalance(!showBalance)}
                      className="h-8 w-8 text-white hover:bg-white/20"
                    >
                      {showBalance ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-primary-100" />
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Kalkulator Nilai Tukar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Rate */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">1 USD =</p>
                <p className="font-semibold">
                  {formatCurrency(exchangeRate.rate)}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm",
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
                {Math.abs(exchangeRate.change)}%
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
                <div className="p-3 bg-success-50 border border-success-100 rounded-lg">
                  <p className="text-sm text-success-700">
                    Penerima akan dapat:
                  </p>
                  <p className="text-xl font-bold text-success-700">
                    {calculateIDR(calculatorAmount)}
                  </p>
                  <p className="text-xs text-success-600 mt-1">
                    *Belum termasuk biaya transfer
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Terakhir diperbarui:{" "}
              {exchangeRate.lastUpdated.toLocaleTimeString("id-ID")}
            </p>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Transaksi Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex-1">
                    <p className="font-medium">{transaction.recipient}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date.toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${transaction.amount}</p>
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          transaction.status === "completed"
                            ? "bg-success"
                            : transaction.status === "processing"
                              ? "bg-yellow-500"
                              : "bg-destructive",
                        )}
                      />
                      <p
                        className={cn(
                          "text-xs capitalize",
                          transaction.status === "completed"
                            ? "text-success"
                            : transaction.status === "processing"
                              ? "text-yellow-600"
                              : "text-destructive",
                        )}
                      >
                        {transaction.status === "completed"
                          ? "Selesai"
                          : transaction.status === "processing"
                            ? "Proses"
                            : "Gagal"}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-smooth">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Riwayat Lengkap</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-smooth">
            <CardContent className="p-4 text-center">
              <Calculator className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Kalkulator</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
