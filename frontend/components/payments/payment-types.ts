export type PaymentStatus = "Pending" | "Processing" | "Paid" | "Refunded";

export type PaymentRecord = {
  id: string;
  bookingId: string | number;
  invoiceNumber: string;
  customerName: string;
  serviceName: string;
  technicianName: string;
  bookingDate: string;
  bookingTime: string;
  bookingStatus: string;
  paymentStatus: PaymentStatus | string;
  amount: number;
  tax: number;
  platformFee: number;
  total: number;
  etaMinutes: number;
  paymentDate?: string;
};

export type PaymentStage = 0 | 1 | 2 | 3 | 4;
