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
  User,
  Settings,
  Moon,
  Sun,
  Globe,
  Palette,
  Languages,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { theme, setTheme, actualTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
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

  const handleViewProfile = () => {
    navigate("/profile");
  };

  const handleQuickCalculator = () => {
    // Scroll to calculator section
    document.getElementById("calculator-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const toggleTheme = () => {
    setTheme(actualTheme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
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
        return t("status.completed");
      case "processing":
        return t("status.processing");
      case "failed":
        return t("status.failed");
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
      {/* Main Container - Responsive */}
      <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header with Quick Settings - Responsive */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 xs:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-responsive-2xl font-bold text-balance">
              {t("dashboard.welcome")}
            </h1>
            <p className="text-responsive text-muted-foreground text-balance mt-1">
              {t("dashboard.subtitle")}
            </p>
          </div>

          {/* Quick Settings - Responsive Grid */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleTheme}
              className="bg-muted/50 border-border hover:bg-muted hover:border-primary transition-smooth"
              title={
                actualTheme === "dark" ? t("theme.light") : t("theme.dark")
              }
            >
              {actualTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={toggleLanguage}
              className="bg-muted/50 border-border hover:bg-muted hover:border-primary transition-smooth"
              title={language === "id" ? "English" : "Bahasa Indonesia"}
            >
              <Languages className="h-4 w-4" />
            </Button>

            {/* Profile Button */}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={handleViewProfile}
              className="bg-muted/50 border-border hover:bg-muted hover:border-primary transition-smooth"
              title={t("profile.title")}
            >
              <UserCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balance Card - Enhanced Responsive */}
        <Card
          variant="elevated"
          className="bg-gradient-to-r from-primary to-primary-600 text-white border-0"
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-primary-100 text-sm sm:text-base mb-1">
                  {t("dashboard.balance")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    {showBalance ? (
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold block">
                        $2,450.00
                      </span>
                    ) : (
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold block">
                        ••••••
                      </span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="bg-white/20 text-white border-white/40 hover:bg-white/30 hover:border-white/60 transition-smooth flex-shrink-0"
                    title={showBalance ? "Hide balance" : "Show balance"}
                  >
                    {showBalance ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-white/10 rounded-full flex-shrink-0">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Money Button - Responsive */}
        <Button
          onClick={handleSendMoney}
          size="lg"
          className="w-full shadow-lg text-base sm:text-lg"
          leftIcon={<Send />}
        >
          {t("dashboard.sendMoney")}
        </Button>

        {/* Exchange Rate Calculator - Responsive */}
        <Card id="calculator-section">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-responsive-lg">
                  {t("exchange.title")}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={refreshExchangeRate}
                loading={isRefreshing}
                className="bg-muted/50 border-border hover:bg-muted hover:border-primary flex-shrink-0"
                title="Refresh exchange rate"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Rate - Responsive */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">1 USD =</p>
                <p className="font-semibold text-base sm:text-lg">
                  {formatCurrency(exchangeRate.rate)}
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full flex-shrink-0",
                  exchangeRate.change >= 0
                    ? "text-success bg-success/10"
                    : "text-destructive bg-destructive/10",
                )}
              >
                {exchangeRate.change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                <span className="text-no-wrap">
                  {Math.abs(exchangeRate.change).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Calculator Input - Responsive */}
            <div className="space-y-3">
              <Input
                type="number"
                placeholder={t("exchange.enterAmount")}
                value={calculatorAmount}
                onChange={(e) => setCalculatorAmount(e.target.value)}
                className="text-responsive-lg"
              />
              {calculatorAmount && (
                <div className="p-3 sm:p-4 bg-success-50 border border-success-200 rounded-lg">
                  <p className="text-sm text-success-700 mb-1">
                    {t("exchange.receiverWillGet")}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-success-700 break-words">
                    {calculateIDR(calculatorAmount)}
                  </p>
                  <p className="text-xs text-success-600 mt-2">
                    {t("exchange.excludesFee")} ($4.99)
                  </p>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {t("exchange.lastUpdated")}{" "}
              {exchangeRate.lastUpdated.toLocaleTimeString(
                language === "id" ? "id-ID" : "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </p>
          </CardContent>
        </Card>

        {/* Recent Transactions - Responsive */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-responsive-lg">
                  {t("dashboard.recentTransactions")}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewHistory}
                className="text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50 flex-shrink-0"
                rightIcon={<ArrowUpRight />}
              >
                {t("dashboard.viewAll")}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 3).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer group"
                  onClick={() => {
                    alert(
                      `${language === "id" ? "Detail Transaksi" : "Transaction Details"}:\nReferensi: ${transaction.reference}\nPenerima: ${transaction.recipient}\nBank: ${transaction.bank}\nJumlah: $${transaction.amount}\nStatus: ${getStatusText(transaction.status)}`,
                    );
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-smooth flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-responsive truncate">
                        {transaction.recipient}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {transaction.bank} •{" "}
                        {transaction.date.toLocaleDateString(
                          language === "id" ? "id-ID" : "en-US",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-responsive">
                      ${transaction.amount}
                    </p>
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
              <div className="text-center py-6 sm:py-8">
                <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-responsive mb-2">
                  {t("dashboard.noTransactions")}
                </p>
                <Button
                  variant="link"
                  onClick={handleSendMoney}
                  className="mt-2"
                  leftIcon={<Send />}
                >
                  {t("dashboard.startSending")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions - Responsive Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-smooth group"
            onClick={handleViewHistory}
          >
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-smooth">
                <History className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-balance">
                {t("dashboard.fullHistory")}
              </p>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-md transition-smooth group"
            onClick={handleQuickCalculator}
          >
            <CardContent className="p-3 sm:p-4 text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-smooth">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-balance">
                {t("dashboard.calculator")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support - Responsive */}
        <Card className="bg-trust/5 border-trust/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm sm:text-base font-medium text-balance">
                  {t("dashboard.needHelp")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground text-balance">
                  {t("dashboard.whatsappSupport")}
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
                className="border-success text-success hover:bg-success hover:text-white flex-shrink-0"
                leftIcon={<Smartphone />}
              >
                {t("dashboard.chat")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
