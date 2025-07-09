import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Calculator,
  CheckCircle,
  CreditCard,
  MapPin,
  User,
  AlertCircle,
  Shield,
  Smartphone,
  Building2,
  RefreshCw,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTransactionNotifications } from "@/components/NotificationSystem";

// Mock data
const exchangeRate = 15780;
const transferFee = 4.99;

// Indonesian banks list
const indonesianBanks = [
  "Bank Mandiri",
  "Bank BCA",
  "Bank BRI",
  "Bank BNI",
  "Bank BTN",
  "Bank CIMB Niaga",
  "Bank Danamon",
  "Bank Permata",
  "Bank Maybank",
  "Bank OCBC NISP",
  "Bank Panin",
  "Bank Mega",
];

interface FormData {
  amount: string;
  recipientName: string;
  recipientPhone: string;
  bankName: string;
  accountNumber: string;
}

const steps = [
  { id: 1, title: "Jumlah", description: "Masukkan jumlah transfer" },
  { id: 2, title: "Penerima", description: "Data penerima" },
  { id: 3, title: "Konfirmasi", description: "Periksa detail" },
];

export default function SendMoney() {
  const navigate = useNavigate();
  const {
    notifyTransactionStarted,
    notifyTransactionProcessing,
    notifyTransactionSuccess,
  } = useTransactionNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    recipientName: "",
    recipientPhone: "",
    bankName: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);

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

  const calculateReceiveAmount = () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return 0;
    return amount * exchangeRate;
  };

  const calculateTotalCost = () => {
    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) return 0;
    return amount + transferFee;
  };

  // Indonesian phone number validation
  const validateIndonesianPhone = (phone: string): boolean => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, "");

    // Check various Indonesian phone number formats
    const patterns = [
      /^08\d{8,13}$/, // 08xxxxxxxxx (mobile)
      /^628\d{8,13}$/, // 628xxxxxxxxx (international mobile)
      /^8\d{8,13}$/, // 8xxxxxxxxx (mobile without 0)
      /^021\d{7,8}$/, // 021xxxxxxx (Jakarta landline)
      /^061\d{7,8}$/, // 061xxxxxxx (Medan landline)
      /^031\d{7,8}$/, // 031xxxxxxx (Surabaya landline)
    ];

    return patterns.some((pattern) => pattern.test(cleanPhone));
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, "");

    // Format mobile numbers
    if (cleanPhone.startsWith("08")) {
      return cleanPhone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
    }
    if (cleanPhone.startsWith("628")) {
      return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})(\d+)/, "+$1-$2-$3-$4");
    }

    return phone;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = "Masukkan jumlah yang valid";
      } else if (parseFloat(formData.amount) < 10) {
        newErrors.amount = "Minimal transfer $10";
      } else if (parseFloat(formData.amount) > 10000) {
        newErrors.amount = "Maksimal transfer $10,000";
      }
    }

    if (step === 2) {
      if (!formData.recipientName.trim()) {
        newErrors.recipientName = "Nama penerima wajib diisi";
      } else if (formData.recipientName.trim().length < 3) {
        newErrors.recipientName = "Nama minimal 3 karakter";
      }

      if (!formData.recipientPhone.trim()) {
        newErrors.recipientPhone = "Nomor HP penerima wajib diisi";
      } else if (!validateIndonesianPhone(formData.recipientPhone)) {
        newErrors.recipientPhone =
          "Format nomor HP tidak valid (contoh: 08123456789)";
      }

      if (!formData.bankName.trim()) {
        newErrors.bankName = "Nama bank wajib diisi";
      }

      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Nomor rekening wajib diisi";
      } else if (formData.accountNumber.length < 8) {
        newErrors.accountNumber = "Nomor rekening minimal 8 digit";
      } else if (!/^\d+$/.test(formData.accountNumber)) {
        newErrors.accountNumber = "Nomor rekening hanya boleh angka";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSend();
      }
    }
  };

  const handleSend = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const transactionId = "TXN-" + Date.now();
      alert(
        `✅ Transfer berhasil dikirim!\n\nID Transaksi: ${transactionId}\nPenerima: ${formData.recipientName}\nJumlah: ${formatUSD(parseFloat(formData.amount))}\n\nUang akan diterima dalam 5-15 menit.`,
      );
      navigate("/");
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Auto-format phone number
    if (field === "recipientPhone") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [field]: formatted }));
    }
  };

  const handleBankSelect = (bank: string) => {
    updateFormData("bankName", bank);
    setShowBankSuggestions(false);
  };

  const filteredBanks = indonesianBanks.filter((bank) =>
    bank.toLowerCase().includes(formData.bankName.toLowerCase()),
  );

  return (
    <Layout title="Kirim Uang" showBack={true} showWhatsApp={true}>
      <div className="container px-4 py-6 max-w-md mx-auto">
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-smooth",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 mx-2 transition-smooth",
                        currentStep > step.id ? "bg-primary" : "bg-muted",
                      )}
                    />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Amount */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Jumlah Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => updateFormData("amount", e.target.value)}
                    error={errors.amount}
                    className="text-3xl text-center font-bold pr-16"
                    size="lg"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                    USD
                  </span>
                </div>
                {formData.amount && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      ≈ {formatCurrency(calculateReceiveAmount())}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[100, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => updateFormData("amount", amount.toString())}
                  className="h-12"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {/* Calculation Summary */}
            {formData.amount && !errors.amount && (
              <Card variant="outlined" className="border-success/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Jumlah kirim</span>
                    <span className="font-semibold">
                      {formatUSD(parseFloat(formData.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Biaya transfer</span>
                    <span className="font-semibold">
                      {formatUSD(transferFee)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold">Total bayar</span>
                    <span className="font-bold text-lg">
                      {formatUSD(calculateTotalCost())}
                    </span>
                  </div>
                  <div className="bg-success-50 p-3 rounded-lg">
                    <p className="text-sm text-success-700">
                      Penerima akan dapat:
                    </p>
                    <p className="text-xl font-bold text-success-700">
                      {formatCurrency(calculateReceiveAmount())}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exchange Rate Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Nilai Tukar</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  1 USD = {formatCurrency(exchangeRate)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Nilai tukar dijamin hingga 30 menit
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Recipient Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Data Penerima
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Nama Lengkap Penerima"
                  placeholder="Contoh: Siti Nurhaliza"
                  value={formData.recipientName}
                  onChange={(e) =>
                    updateFormData("recipientName", e.target.value)
                  }
                  error={errors.recipientName}
                />
                <Input
                  label="Nomor HP Penerima"
                  placeholder="08123456789"
                  value={formData.recipientPhone}
                  onChange={(e) =>
                    updateFormData("recipientPhone", e.target.value)
                  }
                  error={errors.recipientPhone}
                  helper="Format: 08xxxxxxxxx atau +628xxxxxxxxx"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Rekening Bank
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    label="Nama Bank"
                    placeholder="Pilih atau ketik nama bank"
                    value={formData.bankName}
                    onChange={(e) => {
                      updateFormData("bankName", e.target.value);
                      setShowBankSuggestions(true);
                    }}
                    onFocus={() => setShowBankSuggestions(true)}
                    error={errors.bankName}
                  />
                  {showBankSuggestions &&
                    formData.bankName &&
                    filteredBanks.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {filteredBanks.slice(0, 5).map((bank) => (
                          <button
                            key={bank}
                            className="w-full text-left px-3 py-2 hover:bg-muted/50 transition-smooth first:rounded-t-lg last:rounded-b-lg"
                            onClick={() => handleBankSelect(bank)}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
                <Input
                  label="Nomor Rekening"
                  placeholder="Contoh: 1234567890"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    updateFormData("accountNumber", e.target.value)
                  }
                  error={errors.accountNumber}
                  helper="Minimal 8 digit, hanya angka"
                />
              </CardContent>
            </Card>

            {/* Bank verification notice */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Pastikan Data Benar
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Periksa kembali nama dan nomor rekening. Transfer yang
                      salah tidak dapat dibatalkan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card variant="outlined" className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Konfirmasi Transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Amount Summary */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Jumlah kirim</span>
                    <span className="font-semibold">
                      {formatUSD(parseFloat(formData.amount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Biaya transfer</span>
                    <span className="font-semibold">
                      {formatUSD(transferFee)}
                    </span>
                  </div>
                  <div className="border-t border-primary/20 pt-2 flex justify-between items-center">
                    <span className="font-semibold">Total bayar</span>
                    <span className="font-bold text-lg">
                      {formatUSD(calculateTotalCost())}
                    </span>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Detail Penerima</h4>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Nama
                      </span>
                      <span className="font-medium">
                        {formData.recipientName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Nomor HP
                      </span>
                      <span className="font-medium">
                        {formData.recipientPhone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bank
                      </span>
                      <span className="font-medium">{formData.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rekening
                      </span>
                      <span className="font-medium">
                        {formData.accountNumber}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receive Amount */}
                <div className="bg-success-50 p-4 rounded-lg">
                  <p className="text-sm text-success-700 mb-1">
                    Penerima akan dapat:
                  </p>
                  <p className="text-2xl font-bold text-success-700">
                    {formatCurrency(calculateReceiveAmount())}
                  </p>
                  <p className="text-xs text-success-600 mt-1">
                    Estimasi waktu: 5-15 menit
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-trust/5 border-trust/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-trust mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Transfer Aman</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transfer Anda dilindungi enkripsi bank dan diasuransikan
                      hingga $250,000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <Button
            onClick={handleNext}
            size="lg"
            className="w-full"
            disabled={
              isSubmitting ||
              (currentStep === 1 &&
                (!formData.amount || parseFloat(formData.amount) <= 0)) ||
              (currentStep === 2 &&
                (!formData.recipientName ||
                  !formData.recipientPhone ||
                  !formData.bankName ||
                  !formData.accountNumber))
            }
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : currentStep < 3 ? (
              <>
                Lanjut
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Kirim Sekarang
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </Button>

          {currentStep > 1 && !isSubmitting && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full"
            >
              Kembali
            </Button>
          )}
        </div>
      </div>

      {/* Click outside to close bank suggestions */}
      {showBankSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowBankSuggestions(false)}
        />
      )}
    </Layout>
  );
}
