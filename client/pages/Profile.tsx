import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User,
  Settings,
  Globe,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  Lock,
  MessageCircle,
  HelpCircle,
  LogOut,
  Edit,
  Check,
  X,
  Smartphone,
  Mail,
  MapPin,
  Camera,
  Save,
  UserCircle,
  Languages,
  Palette,
  Eye,
  Key,
  ShieldCheck,
  Phone,
  LifeBuoy,
  FileQuestion,
  Power,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

// Mock user data
const mockUser = {
  name: "Ahmad Hidayat",
  email: "ahmad.hidayat@email.com",
  phone: "+628123456789",
  address: "Jl. Sudirman No. 123, Jakarta Selatan, Indonesia",
  avatar: null,
  joinDate: new Date("2023-01-15"),
  totalTransactions: 45,
  totalSent: 12500,
};

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    address: mockUser.address,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  });

  const handleEdit = (field: string) => {
    setEditingField(field);
  };

  const handleSave = (field: string) => {
    // Here you would normally save to backend
    console.log(`Saving ${field}:`, formData[field as keyof typeof formData]);
    setEditingField(null);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      address: mockUser.address,
    });
    setEditingField(null);
  };

  const handleLogout = () => {
    if (
      confirm(
        language === "id"
          ? "Apakah Anda yakin ingin keluar?"
          : "Are you sure you want to logout?",
      )
    ) {
      // Handle logout logic
      console.log("Logging out...");
      // Redirect to login or home
    }
  };

  const themeOptions = [
    { value: "light", label: t("theme.light"), icon: Sun },
    { value: "dark", label: t("theme.dark"), icon: Moon },
    { value: "system", label: t("theme.system"), icon: Monitor },
  ];

  const languageOptions = [
    { value: "id", label: t("language.indonesian"), flag: "🇮🇩" },
    { value: "en", label: t("language.english"), flag: "🇺🇸" },
  ];

  return (
    <Layout title={t("profile.title")} showBack={true}>
      <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile Header - Responsive */}
        <Card variant="elevated">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                  {mockUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <Button
                  size="icon-sm"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-background bg-background hover:bg-muted"
                  title="Change profile photo"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold truncate">
                  {mockUser.name}
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm text-balance">
                  Member since{" "}
                  {mockUser.joinDate.toLocaleDateString(
                    language === "id" ? "id-ID" : "en-US",
                    { month: "long", year: "numeric" },
                  )}
                </p>
                <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <UserCircle className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      {mockUser.totalTransactions} transaksi
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">
                      ${mockUser.totalSent.toLocaleString()} terkirim
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              {t("profile.personalInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("profile.name")}
              </label>
              <div className="flex items-center gap-2">
                {editingField === "name" ? (
                  <>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleSave("name")}
                      className="h-10 w-10 bg-success/10 border-success/30 hover:bg-success hover:text-white"
                      title="Save changes"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-10 w-10 bg-destructive/10 border-destructive/30 hover:bg-destructive hover:text-white"
                      title="Cancel changes"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 p-3 bg-muted/50 rounded-lg">
                      {formData.name}
                    </div>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleEdit("name")}
                      className="h-10 w-10 bg-muted/50 border-border hover:bg-muted hover:border-primary"
                      title="Edit name"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("profile.email")}
              </label>
              <div className="flex items-center gap-2">
                {editingField === "email" ? (
                  <>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleSave("email")}
                      className="h-10 w-10 bg-success/10 border-success/30 hover:bg-success hover:text-white"
                      title="Save changes"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-10 w-10 bg-destructive/10 border-destructive/30 hover:bg-destructive hover:text-white"
                      title="Cancel changes"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 p-3 bg-muted/50 rounded-lg">
                      {formData.email}
                    </div>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleEdit("email")}
                      className="h-10 w-10 bg-muted/50 border-border hover:bg-muted hover:border-primary"
                      title="Edit email"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t("profile.phone")}
              </label>
              <div className="flex items-center gap-2">
                {editingField === "phone" ? (
                  <>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleSave("phone")}
                      className="h-10 w-10 bg-success/10 border-success/30 hover:bg-success hover:text-white"
                      title="Save changes"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={handleCancel}
                      className="h-10 w-10 bg-destructive/10 border-destructive/30 hover:bg-destructive hover:text-white"
                      title="Cancel changes"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 p-3 bg-muted/50 rounded-lg">
                      {formData.phone}
                    </div>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleEdit("phone")}
                      className="h-10 w-10 bg-muted/50 border-border hover:bg-muted hover:border-primary"
                      title="Edit phone"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("profile.address")}
              </label>
              <div className="flex items-start gap-2">
                {editingField === "address" ? (
                  <>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="flex-1 p-3 border border-input rounded-lg resize-none h-20 text-sm"
                    />
                    <div className="flex flex-col gap-1">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => handleSave("address")}
                        className="h-10 w-10 bg-success/10 border-success/30 hover:bg-success hover:text-white"
                        title="Save changes"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-10 w-10 bg-destructive/10 border-destructive/30 hover:bg-destructive hover:text-white"
                        title="Cancel changes"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 p-3 bg-muted/50 rounded-lg text-sm leading-relaxed">
                      {formData.address}
                    </div>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => handleEdit("address")}
                      className="h-10 w-10 bg-muted/50 border-border hover:bg-muted hover:border-primary"
                      title="Edit address"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {t("profile.preferences")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t("profile.language")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={language === option.value ? "default" : "outline"}
                    onClick={() => setLanguage(option.value as "id" | "en")}
                    className="justify-start gap-2"
                    leftIcon={<span className="text-lg">{option.flag}</span>}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {t("profile.theme")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={theme === option.value ? "default" : "outline"}
                      onClick={() => setTheme(option.value as any)}
                      className="flex-col gap-1 h-auto py-3"
                      size="sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {t("profile.notifications")}
              </label>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize flex items-center gap-2">
                      {key === "email" && <Mail className="h-3 w-3" />}
                      {key === "push" && <Bell className="h-3 w-3" />}
                      {key === "sms" && <Phone className="h-3 w-3" />}
                      {key === "marketing" && (
                        <MessageCircle className="h-3 w-3" />
                      )}
                      {key}
                    </span>
                    <button
                      onClick={() =>
                        setNotifications({ ...notifications, [key]: !value })
                      }
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        value ? "bg-primary" : "bg-muted",
                      )}
                      title={`Toggle ${key} notifications`}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-smooth",
                          value ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("profile.security")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              leftIcon={<Key />}
            >
              {t("profile.changePassword")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              leftIcon={<ShieldCheck />}
            >
              {t("profile.twoFactor")}
            </Button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-primary" />
              {t("profile.support")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => {
                const whatsappUrl =
                  "https://wa.me/6281234567890?text=Halo%2C%20saya%20butuh%20bantuan%20dengan%20akun%20saya";
                window.open(whatsappUrl, "_blank");
              }}
              leftIcon={<MessageCircle />}
            >
              {t("profile.contactSupport")}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              leftIcon={<FileQuestion />}
            >
              {t("profile.faq")}
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-destructive/20">
          <CardContent className="p-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full gap-3"
              leftIcon={<Power />}
            >
              {t("profile.logout")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
