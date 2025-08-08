import * as XLSX from "xlsx";
import { QrBatch } from "@/Types"; // adjust path

export default function downloadExcel(qrBatch: QrBatch) {
  // Prepare data rows
  const headerInfo = [
    ["Batch No", qrBatch.batchNo],
    ["Created At", new Date(qrBatch.createdAt).toLocaleString()],
    ["Number of QR Codes", qrBatch.qrCodes.length],
    [], // blank row
    ["Ref No", "Status"]
  ];

  const qrCodeRows = qrBatch.qrCodes.map(code => [code.value, code.status]);

  // Merge header + data
  const data = [...headerInfo, ...qrCodeRows];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "QR Batch");

  // Download file
  XLSX.writeFile(wb, `QRBatch_${qrBatch.batchNo}.xlsx`);
}
