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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data
const exchangeRate = 15780;
const transferFee = 4.99;

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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    recipientName: "",
    recipientPhone: "",
    bankName: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const formatCurrency = (amount: number, currency: string = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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
      }
      if (!formData.recipientPhone.trim()) {
        newErrors.recipientPhone = "Nomor HP penerima wajib diisi";
      }
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Nama bank wajib diisi";
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Nomor rekening wajib diisi";
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

  const handleSend = () => {
    // Mock sending process
    alert("Transfer berhasil dikirim! ID: TXN-" + Date.now());
    navigate("/");
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
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
                        "flex-1 h-0.5 mx-2",
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
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => updateFormData("amount", e.target.value)}
                  error={errors.amount}
                  className="text-2xl text-center font-bold"
                  size="lg"
                />
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">USD</span>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Summary */}
            {formData.amount && !errors.amount && (
              <Card variant="outlined" className="border-success/20">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Jumlah kirim</span>
                    <span className="font-semibold">${formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Biaya transfer</span>
                    <span className="font-semibold">${transferFee}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold">Total bayar</span>
                    <span className="font-bold text-lg">
                      ${calculateTotalCost().toFixed(2)}
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
                  <AlertCircle className="h-4 w-4 text-primary" />
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
                  placeholder="08xxxxxxxxxx"
                  value={formData.recipientPhone}
                  onChange={(e) =>
                    updateFormData("recipientPhone", e.target.value)
                  }
                  error={errors.recipientPhone}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Rekening Bank
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Nama Bank"
                  placeholder="Contoh: Bank Mandiri"
                  value={formData.bankName}
                  onChange={(e) => updateFormData("bankName", e.target.value)}
                  error={errors.bankName}
                />
                <Input
                  label="Nomor Rekening"
                  placeholder="Contoh: 1234567890"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    updateFormData("accountNumber", e.target.value)
                  }
                  error={errors.accountNumber}
                />
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
                    <span className="font-semibold">${formData.amount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Biaya transfer</span>
                    <span className="font-semibold">${transferFee}</span>
                  </div>
                  <div className="border-t border-primary/20 pt-2 flex justify-between items-center">
                    <span className="font-semibold">Total bayar</span>
                    <span className="font-bold text-lg">
                      ${calculateTotalCost().toFixed(2)}
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
              (currentStep === 1 &&
                (!formData.amount || parseFloat(formData.amount) <= 0)) ||
              (currentStep === 2 &&
                (!formData.recipientName ||
                  !formData.bankName ||
                  !formData.accountNumber))
            }
          >
            {currentStep < 3 ? (
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

          {currentStep > 1 && (
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
    </Layout>
  );
}
