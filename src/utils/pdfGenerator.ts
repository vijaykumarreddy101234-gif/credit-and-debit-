import { jsPDF } from 'jspdf';
import { CreditVoucher, DebitVoucher, InVoucher } from '../types/voucher';
import { formatIndianCurrency } from './numberToWordsIndian';

export function generateVoucherPdf(voucher: InVoucher, includeAttachments: boolean = false): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);

  // Background frame
  doc.setDrawColor(200, 205, 215);
  doc.setLineWidth(0.4);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);

  // Dual Corporate Header with Logos Left and Right
  // Left Logo Box
  doc.setFillColor(15, 30, 65); // Deep Corporate Navy
  doc.rect(margin, margin, 18, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RIL', margin + 4, margin + 14);

  // Right Seal / Stamp Box
  const isOut = voucher.voucherType === 'OUT(Debit)';
  const rightBoxX = pageWidth - margin - 28;
  doc.setFillColor(isOut ? 254 : 240, isOut ? 242 : 253, isOut ? 242 : 244);
  doc.setDrawColor(isOut ? 225 : 16, isOut ? 29 : 185, isOut ? 72 : 129);
  doc.roundedRect(rightBoxX, margin, 28, 24, 1.5, 1.5, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isOut ? 190 : 4, isOut ? 18 : 120, isOut ? 60 : 87);
  doc.text('ERP VERIFIED', rightBoxX + 4.5, margin + 7);
  doc.setFontSize(7.5);
  doc.text(isOut ? 'DEBIT' : 'CREDIT', rightBoxX + 7, margin + 13);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Raviraja CRM', rightBoxX + 5, margin + 19);

  // Center Corporate Text
  doc.setFillColor(15, 30, 65);
  doc.rect(margin + 20, margin, contentWidth - 50, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RAVIRAJA INDUSTRIES PRIVATE LIMITED', margin + 24, margin + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(215, 225, 245);
  doc.text('Manufacturers & Suppliers of Heavy Engineering & Industrial Equipment', margin + 24, margin + 12);
  doc.text('Plot No. 44 & 45, Phase III, IDA Jeedimetla, Hyderabad - 500055, Telangana, India', margin + 24, margin + 16.5);
  doc.text('CIN: U28112TG2015PTC099412 • GSTIN: 36AABCR1234F1Z8 • PAN: AABCR1234F', margin + 24, margin + 21);

  let curY = margin + 28;

  const vTypeLabel = isOut ? 'OUT(Debit)' : 'IN(Credit)';

  // Title Ribbon
  doc.setFillColor(isOut ? 254 : 238, isOut ? 242 : 242, isOut ? 242 : 255);
  doc.setDrawColor(isOut ? 225 : 79, isOut ? 29 : 70, isOut ? 72 : 229);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, curY, contentWidth, 10, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(isOut ? 159 : 49, isOut ? 18 : 46, isOut ? 57 : 129);
  doc.text(isOut ? 'OUT VOUCHER (DEBIT / PAYMENT VOUCHER)' : 'IN VOUCHER (CREDIT / RECEIPT VOUCHER)', margin + 6, curY + 6.8);

  // Status Badge
  const statusX = pageWidth - margin - 35;
  const isApproved = voucher.approvalStatus === 'Approved';
  doc.setFillColor(isApproved ? 220 : 254, isApproved ? 252 : 243, isApproved ? 231 : 199);
  doc.setDrawColor(isApproved ? 22 : 217, isApproved ? 163 : 119, isApproved ? 74 : 6);
  doc.roundedRect(statusX, curY + 1.8, 30, 6.5, 1, 1, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(isApproved ? 21 : 180, isApproved ? 128 : 83, isApproved ? 61 : 9);
  doc.text(voucher.approvalStatus.toUpperCase(), statusX + 4, curY + 6);

  curY += 13;

  // Top Metadata Grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, curY, contentWidth, 24, 'FD');

  // Vertical split
  const midX = margin + (contentWidth / 2);
  doc.line(midX, curY, midX, curY + 24);

  doc.setFontSize(8);
  // Column 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Voucher Number:', margin + 4, curY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(voucher.voucherNo || (isOut ? 'OUT-XXXX' : 'IN-XXXX'), margin + 35, curY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Accountant Name:', margin + 4, curY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(voucher.accountantName || 'Staff Accountant', margin + 35, curY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Voucher Date:', margin + 4, curY + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(voucher.date || '', margin + 35, curY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Voucher Type:', margin + 4, curY + 21.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isOut ? 225 : 16, isOut ? 29 : 185, isOut ? 72 : 129);
  doc.text(vTypeLabel, margin + 35, curY + 21.5);

  // Column 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isOut ? 'Expenses Bill:' : 'Invoice No:', midX + 4, curY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(isOut ? ((voucher as DebitVoucher).originalPurchaseBill || '-') : (voucher.invoiceNumber || '-'), midX + 35, curY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isOut ? 'Expenses Date:' : 'Invoice Date:', midX + 4, curY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(isOut ? ((voucher as DebitVoucher).purchaseBillDate || '-') : (voucher.invoiceDate || '-'), midX + 35, curY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text(isOut ? 'Payment Mode:' : 'Receipt Mode:', midX + 4, curY + 16.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text(isOut ? (voucher as DebitVoucher).paymentMode : (voucher as CreditVoucher).receiptMode, midX + 35, curY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Party GSTIN:', midX + 4, curY + 21.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(isOut ? ((voucher as DebitVoucher).supplierGstin || '-') : ((voucher as CreditVoucher).customerGstin || '-'), midX + 35, curY + 21.5);

  curY += 27;

  // Main Details Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, curY, contentWidth, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, curY + 7, margin + contentWidth, curY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('PARTICULARS & TRANSACTION SPECIFICATION', margin + 4, curY + 5);

  curY += 7;

  const drawRow = (label: string, value: string, rowHeight = 9.5, isHighlight = false) => {
    doc.setFillColor(isHighlight ? 248 : 255, isHighlight ? 250 : 255, isHighlight ? 252 : 255);
    doc.rect(margin, curY, contentWidth, rowHeight, 'FD');
    doc.line(margin + 45, curY, margin + 45, curY + rowHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 4, curY + 6);

    doc.setFont('helvetica', isHighlight ? 'bold' : 'normal');
    doc.setTextColor(15, 23, 42);
    const splitVal = doc.splitTextToSize(value || '-', contentWidth - 52);
    doc.text(splitVal, margin + 49, curY + 6);

    curY += rowHeight;
  };

  if (isOut) {
    const dv = voucher as DebitVoucher;
    drawRow('Supplier Name :-', dv.supplierName, 9.5, true);
    if (dv.purchaseOrderNumber) {
      drawRow('Purchase Order No', dv.purchaseOrderNumber, 9);
    }
    drawRow('Supplier / Expense Type', dv.supplierDetails || 'Supplier', 9);
    drawRow('Payment Purpose', voucher.description || 'Corporate disbursement', 10);
    if (voucher.noteReason) {
      drawRow('OUT Note Reason', voucher.noteReason, 9);
    }
  } else {
    const cv = voucher as CreditVoucher;
    drawRow('Customer / Party Name :-', cv.customerName, 9.5, true);
    drawRow('Party Type', cv.receiptType || 'Sales', 9);
    drawRow('Receipt Purpose', voucher.description || 'Payment collection', 10);
    if (voucher.noteReason) {
      drawRow('IN Note / Reason', voucher.noteReason, 9);
    }
  }

  if (voucher.items && voucher.items.length > 0) {
    voucher.items.forEach((item, idx) => {
      drawRow(`Item #${idx + 1}: ${item.name}`, `Qty: ${item.qty || 1}  •  Rate: ${item.rate ? formatIndianCurrency(item.rate) : '-'}  •  Amount: ${formatIndianCurrency(item.amount)}`, 8.5);
    });
  }

  curY += 3;

  // Amount in Numbers & Words Box
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, curY, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(6, 95, 70);
  doc.text(isOut ? 'TOTAL AMOUNT PAID (₹):' : 'TOTAL AMOUNT RECEIVED (₹):', margin + 5, curY + 6.5);

  doc.setFontSize(13);
  doc.setTextColor(4, 120, 87);
  doc.text(formatIndianCurrency(voucher.amount), margin + 60, curY + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(6, 95, 70);
  doc.text('Amount in Words:', margin + 5, curY + 15);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const wordsLines = doc.splitTextToSize(voucher.amountInWords || 'Zero Rupees Only', contentWidth - 45);
  doc.text(wordsLines, margin + 35, curY + 15);

  curY += 25;

  // Terms and Conditions Section (Editable in printable view)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, curY, contentWidth, 12, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('TERMS & CONDITIONS:', margin + 4, curY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Subject to Hyderabad jurisdiction.  2. Payment acknowledged subject to realization of cheque / RTGS.', margin + 4, curY + 8);
  doc.text('3. This voucher is an authentic ERP instrument valid with authorised managerial signature and stamp.', margin + 4, curY + 11);

  curY += 15;

  // Signatures Section (3 columns)
  const sigBoxWidth = contentWidth / 3;
  const sigBoxHeight = 28;

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);

  // Column 1: Prepared By
  doc.rect(margin, curY, sigBoxWidth, sigBoxHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('PREPARED BY', margin + 4, curY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(voucher.createdBy || 'Accounts Staff', margin + 4, curY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Date: ${voucher.date}`, margin + 4, curY + 24);

  // Column 2: Approved By
  doc.rect(margin + sigBoxWidth, curY, sigBoxWidth, sigBoxHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('APPROVED BY', margin + sigBoxWidth + 4, curY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(voucher.approvedBy || (voucher.approvalStatus === 'Approved' ? 'Authorised Manager' : 'Pending Verification'), margin + sigBoxWidth + 4, curY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Signatory & Seal', margin + sigBoxWidth + 4, curY + 24);

  // Column 3: Received / Cashier
  doc.rect(margin + (sigBoxWidth * 2), curY, sigBoxWidth, sigBoxHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(isOut ? "CASHIER / PAYEE" : "RECEIVED BY", margin + (sigBoxWidth * 2) + 4, curY + 5.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  const signName = isOut ? (voucher as DebitVoucher).cashierName : (voucher as CreditVoucher).receivedBy;
  doc.text(signName || '-', margin + (sigBoxWidth * 2) + 4, curY + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Acknowledgement Signature', margin + (sigBoxWidth * 2) + 4, curY + 24);

  // Footer notes
  const footerY = pageHeight - margin - 3;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Raviraja CRM Accounts Desk • Authenticated Voucher ID: ${voucher.id} • Page 1 of ${includeAttachments && voucher.attachments?.length ? 1 + voucher.attachments.length : 1}`, margin, footerY);

  // ATTACHMENTS APPENDED DIRECTLY FOR FILING
  if (includeAttachments && voucher.attachments && voucher.attachments.length > 0) {
    voucher.attachments.forEach((att, idx) => {
      doc.addPage();
      
      // Page border
      doc.setDrawColor(200, 205, 215);
      doc.setLineWidth(0.4);
      doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin * 2) + 8);

      // Header
      doc.setFillColor(15, 30, 65);
      doc.rect(margin, margin, contentWidth, 14, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`ATTACHED SUPPORTING FILING DOCUMENT (${idx + 1} of ${voucher.attachments.length})`, margin + 6, margin + 9);

      // Metadata
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Voucher Number: ${voucher.voucherNo} | Document Name: ${att.name}`, margin, margin + 20);
      doc.text(`Uploaded: ${att.uploadedAt ? new Date(att.uploadedAt).toLocaleString() : 'N/A'} | Size: ${(att.size / 1024).toFixed(1)} KB`, margin, margin + 25);

      // Render image if image dataUrl
      if (att.mimeType && att.mimeType.startsWith('image/') && att.dataUrl) {
        try {
          doc.addImage(att.dataUrl, 'JPEG', margin, margin + 30, contentWidth, Math.min(contentWidth * 0.9, pageHeight - margin - 45), undefined, 'FAST');
        } catch {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9);
          doc.text('[Image attached in digital ERP archive]', margin, margin + 40);
        }
      } else {
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, margin + 30, contentWidth, 50, 2, 2, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(`PDF / Electronic File: ${att.name}`, margin + 10, margin + 50);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Attached electronic document verified and stored in Raviraja CRM database.', margin + 10, margin + 60);
      }

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Voucher Ref: ${voucher.voucherNo} • Supporting Document Page ${idx + 2} of ${1 + voucher.attachments.length}`, margin, footerY);
    });
  }

  // Save PDF
  doc.save(`${voucher.voucherNo || 'Voucher'}_Raviraja_Industries.pdf`);
}
