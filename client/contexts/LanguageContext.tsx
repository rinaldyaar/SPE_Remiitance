import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation keys
const translations = {
  id: {
    // Dashboard
    "dashboard.welcome": "Selamat datang! 👋",
    "dashboard.subtitle": "Kirim uang ke Indonesia dengan mudah dan aman",
    "dashboard.balance": "Saldo Anda",
    "dashboard.sendMoney": "Kirim Uang Sekarang",
    "dashboard.calculator": "Kalkulator Nilai Tukar",
    "dashboard.recentTransactions": "Transaksi Terakhir",
    "dashboard.viewAll": "Lihat Semua",
    "dashboard.noTransactions": "Belum ada transaksi",
    "dashboard.startSending": "Mulai kirim uang",
    "dashboard.quickActions": "Aksi Cepat",
    "dashboard.fullHistory": "Riwayat Lengkap",
    "dashboard.needHelp": "Butuh bantuan?",
    "dashboard.whatsappSupport": "Hubungi kami via WhatsApp 24/7",
    "dashboard.chat": "Chat",
    "dashboard.settings": "Pengaturan",
    "dashboard.profile": "Profil",

    // Exchange Rate
    "exchange.title": "Kalkulator Nilai Tukar",
    "exchange.enterAmount": "Masukkan jumlah USD",
    "exchange.receiverWillGet": "Penerima akan dapat:",
    "exchange.excludesFee": "*Belum termasuk biaya transfer",
    "exchange.lastUpdated": "Terakhir diperbarui:",
    "exchange.guaranteedFor": "Nilai tukar dijamin hingga 30 menit",

    // Send Money
    "send.title": "Kirim Uang",
    "send.amount": "Jumlah",
    "send.recipient": "Penerima",
    "send.confirmation": "Konfirmasi",
    "send.enterAmount": "Masukkan jumlah transfer",
    "send.amountToSend": "Jumlah kirim",
    "send.transferFee": "Biaya transfer",
    "send.totalPayment": "Total bayar",
    "send.recipientData": "Data Penerima",
    "send.fullName": "Nama Lengkap Penerima",
    "send.phoneNumber": "Nomor HP Penerima",
    "send.bankAccount": "Rekening Bank",
    "send.bankName": "Nama Bank",
    "send.accountNumber": "Nomor Rekening",
    "send.next": "Lanjut",
    "send.back": "Kembali",
    "send.sendNow": "Kirim Sekarang",
    "send.processing": "Memproses...",

    // Profile
    "profile.title": "Profil & Pengaturan",
    "profile.personalInfo": "Informasi Pribadi",
    "profile.preferences": "Preferensi",
    "profile.security": "Keamanan",
    "profile.support": "Dukungan",
    "profile.name": "Nama",
    "profile.email": "Email",
    "profile.phone": "Nomor HP",
    "profile.address": "Alamat",
    "profile.language": "Bahasa",
    "profile.theme": "Tema",
    "profile.notifications": "Notifikasi",
    "profile.changePassword": "Ubah Kata Sandi",
    "profile.twoFactor": "Autentikasi Dua Faktor",
    "profile.contactSupport": "Hubungi Dukungan",
    "profile.faq": "FAQ",
    "profile.logout": "Keluar",

    // Languages
    "language.indonesian": "Bahasa Indonesia",
    "language.english": "English",

    // Themes
    "theme.light": "Terang",
    "theme.dark": "Gelap",
    "theme.system": "Sistem",

    // Common
    "common.save": "Simpan",
    "common.cancel": "Batal",
    "common.edit": "Edit",
    "common.delete": "Hapus",
    "common.confirm": "Konfirmasi",
    "common.close": "Tutup",
    "common.loading": "Memuat...",
    "common.error": "Terjadi kesalahan",
    "common.success": "Berhasil",

    // Status
    "status.completed": "Selesai",
    "status.processing": "Proses",
    "status.failed": "Gagal",

    // Trust & Security
    "trust.bankIndonesia": "Terdaftar dan diawasi oleh Bank Indonesia",
    "trust.sslEncrypted": "SSL Encrypted",
    "trust.fdicInsured": "FDIC Insured",
    "trust.support247": "24/7 Support",
  },
  en: {
    // Dashboard
    "dashboard.welcome": "Welcome! 👋",
    "dashboard.subtitle": "Send money to Indonesia easily and securely",
    "dashboard.balance": "Your Balance",
    "dashboard.sendMoney": "Send Money Now",
    "dashboard.calculator": "Exchange Rate Calculator",
    "dashboard.recentTransactions": "Recent Transactions",
    "dashboard.viewAll": "View All",
    "dashboard.noTransactions": "No transactions yet",
    "dashboard.startSending": "Start sending money",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.fullHistory": "Full History",
    "dashboard.needHelp": "Need help?",
    "dashboard.whatsappSupport": "Contact us via WhatsApp 24/7",
    "dashboard.chat": "Chat",
    "dashboard.settings": "Settings",
    "dashboard.profile": "Profile",

    // Exchange Rate
    "exchange.title": "Exchange Rate Calculator",
    "exchange.enterAmount": "Enter USD amount",
    "exchange.receiverWillGet": "Receiver will get:",
    "exchange.excludesFee": "*Excludes transfer fee",
    "exchange.lastUpdated": "Last updated:",
    "exchange.guaranteedFor": "Exchange rate guaranteed for 30 minutes",

    // Send Money
    "send.title": "Send Money",
    "send.amount": "Amount",
    "send.recipient": "Recipient",
    "send.confirmation": "Confirmation",
    "send.enterAmount": "Enter transfer amount",
    "send.amountToSend": "Amount to send",
    "send.transferFee": "Transfer fee",
    "send.totalPayment": "Total payment",
    "send.recipientData": "Recipient Data",
    "send.fullName": "Recipient Full Name",
    "send.phoneNumber": "Recipient Phone Number",
    "send.bankAccount": "Bank Account",
    "send.bankName": "Bank Name",
    "send.accountNumber": "Account Number",
    "send.next": "Next",
    "send.back": "Back",
    "send.sendNow": "Send Now",
    "send.processing": "Processing...",

    // Profile
    "profile.title": "Profile & Settings",
    "profile.personalInfo": "Personal Information",
    "profile.preferences": "Preferences",
    "profile.security": "Security",
    "profile.support": "Support",
    "profile.name": "Name",
    "profile.email": "Email",
    "profile.phone": "Phone Number",
    "profile.address": "Address",
    "profile.language": "Language",
    "profile.theme": "Theme",
    "profile.notifications": "Notifications",
    "profile.changePassword": "Change Password",
    "profile.twoFactor": "Two-Factor Authentication",
    "profile.contactSupport": "Contact Support",
    "profile.faq": "FAQ",
    "profile.logout": "Logout",

    // Languages
    "language.indonesian": "Bahasa Indonesia",
    "language.english": "English",

    // Themes
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.confirm": "Confirm",
    "common.close": "Close",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",

    // Status
    "status.completed": "Completed",
    "status.processing": "Processing",
    "status.failed": "Failed",

    // Trust & Security
    "trust.bankIndonesia": "Registered and supervised by Bank Indonesia",
    "trust.sslEncrypted": "SSL Encrypted",
    "trust.fdicInsured": "FDIC Insured",
    "trust.support247": "24/7 Support",
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = "id",
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || defaultLanguage;
    }
    return defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    // Update document language attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.id] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
