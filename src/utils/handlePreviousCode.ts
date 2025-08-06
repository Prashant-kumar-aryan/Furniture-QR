import { QrBatch1 } from "@/app/qrcodes/page";
import jsPDF from "jspdf";
import qrcode from "qrcode";

// Function to print QR codes with their images in a PDF
export default async function handlePrintQrCode(qrBatch: QrBatch1) {
  console.log("Recived Qr Batch",qrBatch);
  // return;
  const doc = new jsPDF();
  const margin = 10;
  const qrSize = 40;
  const gap = 10;

  // Add header text
  doc.setFontSize(12);
  doc.text(`Created At: ${qrBatch.createdAt}`, margin, 10);
  doc.text(`Batch No: ${qrBatch.batchNo}`, margin + 90, 10);
  doc.text(`No of QR Codes: ${qrBatch.refNo.length}`, margin + 150, 10);
  doc.setLineWidth(0.1);

  let x = margin;
  let y = 20;

  for (let i = 0; i < qrBatch.refNo.length; i++) {
    const code = qrBatch.refNo[i];
    const dataUrl = await qrcode.toDataURL(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}?refId=${code.value}`);

    doc.addImage(dataUrl, 'PNG', x, y, qrSize, qrSize);
    doc.text(`QR ${i + 1}`, x, y + qrSize + 7);

    // Move to next position
    x += qrSize + gap;
    if (x + qrSize > doc.internal.pageSize.getWidth()) {
      doc.line(margin, y - 5, 200, y - 5);
      x = margin;
      y += qrSize + 15;
    }

    // Add new page if needed
    if (y + qrSize > doc.internal.pageSize.getHeight() && i < qrBatch.refNo.length - 1) {
      doc.addPage();
      x = margin;
      y = 20;
    }
  }

  const pdfBlob = doc.output("blob");
  const blobUrl = URL.createObjectURL(pdfBlob);

  const newWindow = window.open("", "_blank");
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>QR PDF Preview</title>
          <style>
            body { margin: 0; display: flex; flex-direction: column; height: 100vh; }
            iframe { flex: 1; border: none; }
          </style>
        </head>
        <body>
          <iframe id="pdfFrame" src="${blobUrl}"></iframe>
        </body>
      </html>
    `);
    newWindow.document.close();
  }
}
