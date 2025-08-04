export type QrCodeStatus = "notRequested" | "loading" | "processed" | "error";

export type refNo = {
  value: string;
  status: "REVOKED" | "ACTIVE" | "USED";
};

// refNo

export type QrBatch = {
  qrCodes: refNo[];
  batchNo: string;
  createdAt: string;
  status: "REVOKED" | "ACTIVE";
};

export type TransactionStatus = "PENDING" | "COMPLETED" | "REJECTED" | "FAILED";

export type Transaction = {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  upiId: string;
  refId: string;
  status: TransactionStatus;
  amount?: number;
  transactionId?: string;
  paymentMethod?: string;
  createdAt?: { $date: | Date | string | number } | Date | string | number;
  paymentDate?: { $date: | Date | string | number }| Date | string | number;
  updatedAt?: { $date: | Date | string | number }| Date | string | number;
};
