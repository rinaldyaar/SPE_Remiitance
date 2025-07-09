import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const onboardingSteps = [
  {
    id: 1,
    icon: Shield,
    title: "Aman & Terpercaya",
    description:
      "Transfer uang ke Indonesia dengan aman. Diawasi Bank Indonesia dan menggunakan enkripsi bank.",
    color: "text-trust",
    bgColor: "bg-trust/10",
  },
  {
    id: 2,
    icon: Clock,
    title: "Cepat & Mudah",
    description:
      "Kirim uang hanya dalam 3 langkah sederhana. Keluarga di rumah bisa terima dalam hitungan menit.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 3,
    icon: DollarSign,
    title: "Biaya Transparan",
    description:
      "Tidak ada biaya tersembunyi. Lihat total biaya dan nilai tukar real-time sebelum kirim.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed and navigate to home
      localStorage.setItem("onboarding_completed", "true");
      navigate("/");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/");
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;

  return (
    <Layout className="justify-center p-4">
      <div className="max-w-md mx-auto w-full space-y-8">
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-8 rounded-full transition-smooth",
                index <= currentStep ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        {/* Main Content */}
        <Card variant="elevated" className="text-center">
          <CardContent className="p-8 space-y-6">
            {/* Icon */}
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto",
                step.bgColor,
              )}
            >
              <IconComponent className={cn("h-10 w-10", step.color)} />
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-balance">{step.title}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-balance">
                {step.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleNext} size="lg" className="w-full">
            {currentStep < onboardingSteps.length - 1 ? (
              <>
                Lanjut
                <ArrowRight className="h-5 w-5" />
              </>
            ) : (
              <>
                Mulai Transfer
                <CheckCircle className="h-5 w-5" />
              </>
            )}
          </Button>

          <Button variant="ghost" onClick={handleSkip} className="w-full">
            Lewati
          </Button>
        </div>

        {/* Trust Indicator */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4 text-trust" />
            <span>Terdaftar Bank Indonesia</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
