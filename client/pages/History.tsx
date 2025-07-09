import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Extended mock transaction data
const allTransactions = [
  {
    id: "TXN-2024-008",
    amount: "500",
    currency: "USD",
    recipient: "Ibu Siti Aminah",
    bank: "Bank Mandiri",
    accountNumber: "****7890",
    status: "completed",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    fee: 4.99,
    exchangeRate: 15780,
    receivedAmount: 7890000,
  },
  {
    id: "TXN-2024-007",
    amount: "300",
    currency: "USD",
    recipient: "Bapak Ahmad Hidayat",
    bank: "Bank BCA",
    accountNumber: "****5432",
    status: "processing",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    fee: 4.99,
    exchangeRate: 15775,
    receivedAmount: 4732500,
  },
  {
    id: "TXN-2024-006",
    amount: "750",
    currency: "USD",
    recipient: "Sari Dewi Lestari",
    bank: "Bank BRI",
    accountNumber: "****1234",
    status: "completed",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    fee: 4.99,
    exchangeRate: 15790,
    receivedAmount: 11842500,
  },
  {
    id: "TXN-2024-005",
    amount: "200",
    currency: "USD",
    recipient: "Budi Santoso",
    bank: "Bank BNI",
    accountNumber: "****9876",
    status: "completed",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    fee: 4.99,
    exchangeRate: 15785,
    receivedAmount: 3157000,
  },
  {
    id: "TXN-2024-004",
    amount: "400",
    currency: "USD",
    recipient: "Fitri Rahmawati",
    bank: "Bank Danamon",
    accountNumber: "****5555",
    status: "failed",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    fee: 4.99,
    exchangeRate: 15782,
    receivedAmount: 0,
    failureReason: "Nomor rekening tidak valid",
  },
  {
    id: "TXN-2024-003",
    amount: "600",
    currency: "USD",
    recipient: "Rina Kusuma",
    bank: "Bank CIMB Niaga",
    accountNumber: "****2468",
    status: "completed",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    fee: 4.99,
    exchangeRate: 15788,
    receivedAmount: 9472800,
  },
];

const statusConfig = {
  completed: {
    label: "Selesai",
    color: "text-success",
    bgColor: "bg-success/10",
    dotColor: "bg-success",
    icon: CheckCircle,
  },
  processing: {
    label: "Proses",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    dotColor: "bg-yellow-500",
    icon: Clock,
  },
  failed: {
    label: "Gagal",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    dotColor: "bg-destructive",
    icon: AlertCircle,
  },
};

export default function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null,
  );

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

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((transaction) => {
      const matchesSearch =
        transaction.recipient
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.bank.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const handleTransactionClick = (transactionId: string) => {
    setSelectedTransaction(
      selectedTransaction === transactionId ? null : transactionId,
    );
  };

  const handleDownloadReceipt = (transaction: any) => {
    const receiptData = `
BUKTI TRANSFER
================

ID Transaksi: ${transaction.id}
Tanggal: ${transaction.date.toLocaleDateString("id-ID")}
Waktu: ${transaction.date.toLocaleTimeString("id-ID")}

PENGIRIM
--------
Jumlah Kirim: ${formatUSD(parseFloat(transaction.amount))}
Biaya Transfer: ${formatUSD(transaction.fee)}
Total Bayar: ${formatUSD(parseFloat(transaction.amount) + transaction.fee)}

PENERIMA
--------
Nama: ${transaction.recipient}
Bank: ${transaction.bank}
Rekening: ${transaction.accountNumber}
Jumlah Diterima: ${formatCurrency(transaction.receivedAmount)}

NILAI TUKAR
-----------
1 USD = ${formatCurrency(transaction.exchangeRate)}

STATUS: ${statusConfig[transaction.status as keyof typeof statusConfig].label.toUpperCase()}
${transaction.failureReason ? `\nAlasan Gagal: ${transaction.failureReason}` : ""}

================
KirimUang - Transfer Aman & Terpercaya
    `;

    // Create downloadable text file
    const blob = new Blob([receiptData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bukti-transfer-${transaction.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="Riwayat Transaksi" showBack={true}>
      <div className="container px-4 py-6 max-w-md mx-auto">
        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama penerima atau ID transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="whitespace-nowrap"
              leftIcon={<Filter className="h-3 w-3" />}
            >
              Semua
            </Button>
            <Button
              variant={statusFilter === "completed" ? "success" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("completed")}
              className="whitespace-nowrap"
              leftIcon={<CheckCircle className="h-3 w-3" />}
            >
              Selesai
            </Button>
            <Button
              variant={statusFilter === "processing" ? "outline" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("processing")}
              className="whitespace-nowrap"
              leftIcon={<Clock className="h-3 w-3" />}
            >
              Proses
            </Button>
            <Button
              variant={statusFilter === "failed" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("failed")}
              className="whitespace-nowrap"
              leftIcon={<AlertCircle className="h-3 w-3" />}
            >
              Gagal
            </Button>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => {
              const status =
                statusConfig[transaction.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              const isExpanded = selectedTransaction === transaction.id;

              return (
                <Card key={transaction.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Main transaction row */}
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-smooth"
                      onClick={() => handleTransactionClick(transaction.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            status.bgColor,
                          )}
                        >
                          <StatusIcon className={cn("h-5 w-5", status.color)} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {transaction.recipient}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.bank} •{" "}
                            {transaction.date.toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatUSD(parseFloat(transaction.amount))}
                        </p>
                        <div className="flex items-center gap-1 justify-end">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              status.dotColor,
                            )}
                          />
                          <p className={cn("text-xs", status.color)}>
                            {status.label}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t bg-muted/20">
                        <div className="p-4 space-y-4">
                          {/* Transaction Details */}
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                ID Transaksi
                              </span>
                              <span className="font-mono text-xs">
                                {transaction.id}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Rekening
                              </span>
                              <span>{transaction.accountNumber}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Biaya Transfer
                              </span>
                              <span>{formatUSD(transaction.fee)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Nilai Tukar
                              </span>
                              <span>
                                1 USD ={" "}
                                {formatCurrency(transaction.exchangeRate)}
                              </span>
                            </div>
                            {transaction.status === "completed" && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Jumlah Diterima
                                </span>
                                <span className="font-semibold text-success">
                                  {formatCurrency(transaction.receivedAmount)}
                                </span>
                              </div>
                            )}
                            {transaction.status === "failed" &&
                              transaction.failureReason && (
                                <div className="space-y-1">
                                  <span className="text-muted-foreground text-sm">
                                    Alasan Gagal:
                                  </span>
                                  <p className="text-sm text-destructive">
                                    {transaction.failureReason}
                                  </p>
                                </div>
                              )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReceipt(transaction)}
                              className="flex-1"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Unduh Bukti
                            </Button>
                            {(transaction.status === "failed" ||
                              transaction.status === "processing") && (
                              <Button size="sm" className="flex-1">
                                <RefreshCw className="h-4 w-4 mr-1" />
                                {transaction.status === "failed"
                                  ? "Kirim Ulang"
                                  : "Lacak"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-2">
                {searchQuery || statusFilter !== "all"
                  ? "Tidak ada transaksi yang sesuai"
                  : "Belum ada riwayat transaksi"}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                >
                  Hapus filter
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredTransactions.length > 0 && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {filteredTransactions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success">
                    {
                      filteredTransactions.filter(
                        (t) => t.status === "completed",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Selesai</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      filteredTransactions.filter(
                        (t) => t.status === "processing",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Proses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
