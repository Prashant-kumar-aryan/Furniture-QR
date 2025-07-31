type refNo = string;

type QrBatch = {
  qrCodes: refNo[];
  batchNo: string;
  createdAt: string;
};

export default function handlePrintQrCode(qrBatch: QrBatch) {
  // Implement the logic to print the QR codes in PDF format
  console.log("Printing QR Codes:", qrBatch);
}
