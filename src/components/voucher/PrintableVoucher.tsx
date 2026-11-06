import React, { useState } from 'react';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  Building2,
  ShieldCheck,
  FileText,
  BadgePercent,
  Edit3,
  Paperclip,
  X,
  FileUp,
  Files
} from 'lucide-react';
import { InVoucher, CreditVoucher, DebitVoucher } from '../../types/voucher';
import { formatIndianCurrency, numberToIndianWords } from '../../utils/numberToWordsIndian';
import { generateVoucherPdf } from '../../utils/pdfGenerator';

interface PrintableVoucherProps {
  voucher: InVoucher;
  onBack: () => void;
  onEdit?: () => void;
}

export const PrintableVoucher: React.FC<PrintableVoucherProps> = ({
  voucher: initialVoucher,
  onBack,
  onEdit,
}) => {
  const [voucher, setVoucher] = useState<InVoucher>(initialVoucher);
  const isOut = voucher.voucherType === 'OUT(Debit)';

  // Editable Header Details State
  const [companyName, setCompanyName] = useState('RAVIRAJA INDUSTRIES PRIVATE LIMITED');
  const [companySubtitle, setCompanySubtitle] = useState('Manufacturers & Suppliers of Heavy Engineering & Industrial Equipment');
  const [companyAddress, setCompanyAddress] = useState('Plot No. 44 & 45, Phase III, IDA Jeedimetla, Hyderabad - 500055, Telangana, India');
  const [cinNumber, setCinNumber] = useState('U28112TG2015PTC099412');
  const [gstinNumber, setGstinNumber] = useState('36AABCR1234F1Z8');
  const [panNumber, setPanNumber] = useState('AABCR1234F');
  
  // Left and Right Logo Labels
  const [leftLogoText, setLeftLogoText] = useState('RIL');
  const [rightBadgeTop, setRightBadgeTop] = useState('FINANCE DEPT');
  const [rightBadgeCenter, setRightBadgeCenter] = useState(isOut ? 'DEBIT VOUCHER' : 'CREDIT VOUCHER');
  const [rightBadgeBottom, setRightBadgeBottom] = useState('RAVIRAJA CRM');

  // Editable Terms and Conditions
  const [termsText, setTermsText] = useState(
    '1. Subject to Hyderabad jurisdiction.\n2. Payment acknowledged subject to realization of cheque / RTGS.\n3. This voucher is valid only when bearing authorized sign-off and official company seal.'
  );

  // Editable Footer
  const [footerDisclaimer, setFooterDisclaimer] = useState(
    `Generated under Raviraja CRM Voucher Desk • System Authenticated Voucher ID: ${voucher.id}`
  );

  // Print Mode Options Modal
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'pdf'>('print');
  const [printWithAttachments, setPrintWithAttachments] = useState<boolean>(true);
  const [printAttachmentOnly, setPrintAttachmentOnly] = useState<boolean>(false);

  const handleFieldChange = (field: string, value: any) => {
    setVoucher((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'amount') {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          updated.amountInWords = numberToIndianWords(num);
        }
      }
      return updated as InVoucher;
    });
  };

  const openPrintOptions = (action: 'print' | 'pdf') => {
    // If voucher has attachments, ask how user wants to print
    if (voucher.attachments && voucher.attachments.length > 0) {
      setPendingAction(action);
      setShowPrintModal(true);
    } else {
      // Direct print / pdf if no attachments
      if (action === 'pdf') {
        generateVoucherPdf(voucher, false);
      } else {
        setPrintWithAttachments(false);
        setPrintAttachmentOnly(false);
        setTimeout(() => window.print(), 100);
      }
    }
  };

  const executeAction = (includeDocs: boolean, docsOnly: boolean = false) => {
    setShowPrintModal(false);
    if (pendingAction === 'pdf') {
      generateVoucherPdf(voucher, includeDocs);
    } else {
      setPrintWithAttachments(includeDocs);
      setPrintAttachmentOnly(docsOnly);
      setTimeout(() => {
        window.print();
      }, 150);
    }
  };

  const inputClasses = "w-full p-0 border-none bg-transparent focus:ring-0 focus:outline-none print:placeholder-transparent";
  const labelClasses = "font-bold text-slate-600 uppercase text-[10px] tracking-tight";

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Register</span>
          </button>
          <div>
            <span className="text-[10px] text-blue-700 font-black block tracking-wider uppercase">
              100% Fully Editable Print View
            </span>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="font-mono text-blue-700">{voucher.voucherNo}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                voucher.approvalStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}>
                {voucher.approvalStatus}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 overflow-x-auto">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Full Form Editor</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => openPrintOptions('pdf')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={() => openPrintOptions('print')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print (A4)</span>
          </button>
        </div>
      </div>

      {/* PRINT PROMPT MODAL: Asks whether to print with upload or separate */}
      {showPrintModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Print & Filing Options</h3>
                  <p className="text-[11px] text-slate-500">Supporting documents attached: {voucher.attachments?.length || 0}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                How would you like to print this voucher and its uploaded attachments?
              </p>

              {/* Option 1: Voucher + Attachment Together */}
              <button
                type="button"
                onClick={() => executeAction(true, false)}
                className="w-full p-3.5 rounded-xl border-2 border-blue-600 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Files className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-black text-blue-900 block group-hover:underline">
                    Voucher + Attached Document/Photo Together (Recommended)
                  </span>
                  <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                    Appends supporting invoices & photos right after the voucher. Easy for physical filing!
                  </span>
                </div>
              </button>

              {/* Option 2: Voucher Only */}
              <button
                type="button"
                onClick={() => executeAction(false, false)}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-left transition-all flex items-start gap-3 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block group-hover:underline">
                    Print Voucher Only
                  </span>
                  <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                    Prints single-page official voucher without appended attachment sheets.
                  </span>
                </div>
              </button>

              {/* Option 3: Attached Documents Separately */}
              {pendingAction === 'print' && (
                <button
                  type="button"
                  onClick={() => executeAction(true, true)}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50 text-left transition-all flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-purple-900 block group-hover:underline">
                      Print Attached Documents Separately
                    </span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Prints only the uploaded invoices and photos on separate filing sheets.
                    </span>
                  </div>
                </button>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A4 PRINT CONTAINER */}
      <div className="flex justify-center overflow-x-auto pb-6">
        <div className="printable-voucher-container w-full max-w-[210mm] bg-white shadow-xl print:shadow-none print:w-full print:max-w-none print:m-0 rounded-2xl print:rounded-none border border-slate-300 print:border-none p-5 sm:p-8 print:p-6 text-slate-900 min-w-[320px]">
          
          {/* PAGE 1: OFFICIAL VOUCHER (Hidden only if printAttachmentOnly is true) */}
          <div className={printAttachmentOnly ? 'print:hidden' : ''}>
            
            {/* DUAL CORPORATE LOGOS & EDITABLE HEADER */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex justify-between items-start gap-3">
                
                {/* LEFT LOGO (Editable text / mark) */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-2xl tracking-tighter shadow-sm shrink-0 print:border print:border-black">
                    <input
                      type="text"
                      value={leftLogoText}
                      onChange={(e) => setLeftLogoText(e.target.value.toUpperCase())}
                      className="w-12 text-center bg-transparent border-none text-white font-black text-xl p-0 focus:ring-0 focus:outline-none"
                      title="Editable Left Logo Crest"
                    />
                  </div>

                  {/* Company Titles (Fully Editable) */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase border-none p-0 focus:ring-0 focus:outline-none bg-transparent"
                      title="Editable Company Name"
                    />
                    <input
                      type="text"
                      value={companySubtitle}
                      onChange={(e) => setCompanySubtitle(e.target.value)}
                      className="w-full text-[11px] text-slate-600 font-medium border-none p-0 focus:ring-0 focus:outline-none bg-transparent"
                      title="Editable Subtitle"
                    />
                    <input
                      type="text"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      className="w-full text-[10px] text-slate-500 mt-0.5 border-none p-0 focus:ring-0 focus:outline-none bg-transparent"
                      title="Editable Registered Address"
                    />
                    <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-semibold text-slate-700 mt-1">
                      <span className="flex items-center gap-1">
                        CIN:
                        <input
                          type="text"
                          value={cinNumber}
                          onChange={(e) => setCinNumber(e.target.value)}
                          className="w-36 font-mono font-bold border-none p-0 focus:ring-0 focus:outline-none bg-transparent"
                        />
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        GSTIN:
                        <input
                          type="text"
                          value={gstinNumber}
                          onChange={(e) => setGstinNumber(e.target.value)}
                          className="w-32 font-mono font-bold border-none p-0 focus:ring-0 focus:outline-none bg-transparent"
                        />
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        PAN:
                        <input
                          type="text"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value)}
                          className="w-24 font-mono font-bold border-none p-0 focus:ring-0 focus:outline-none bg-transparent"
                        />
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT LOGO / STAMP (Fully Editable) */}
                <div className="text-right shrink-0">
                  <div className={`inline-block border-2 rounded-xl p-2.5 text-center min-w-[110px] print:bg-transparent ${
                    isOut ? 'border-rose-600 bg-rose-50/50' : 'border-emerald-600 bg-emerald-50/50'
                  }`}>
                    <input
                      type="text"
                      value={rightBadgeTop}
                      onChange={(e) => setRightBadgeTop(e.target.value)}
                      className={`w-full text-center text-[10px] font-black uppercase tracking-widest border-none p-0 focus:ring-0 bg-transparent ${
                        isOut ? 'text-rose-800' : 'text-emerald-800'
                      }`}
                    />
                    <input
                      type="text"
                      value={rightBadgeCenter}
                      onChange={(e) => setRightBadgeCenter(e.target.value)}
                      className={`w-full text-center text-xs font-black border-none p-0 focus:ring-0 bg-transparent ${
                        isOut ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    />
                    <input
                      type="text"
                      value={rightBadgeBottom}
                      onChange={(e) => setRightBadgeBottom(e.target.value)}
                      className="w-full text-center text-[9px] font-medium text-slate-600 border-none p-0 focus:ring-0 bg-transparent"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Title Banner */}
            <div className="bg-slate-100 print:bg-slate-200 border-y border-slate-300 py-2 px-4 mb-4 flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 tracking-wider uppercase">
                {isOut ? 'OUT VOUCHER (DEBIT / PAYMENT)' : 'IN VOUCHER (CREDIT / RECEIPT)'}
              </h2>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>TYPE: <span className={`font-mono ${isOut ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {voucher.voucherType}
                </span></span>
                <span>|</span>
                <span>ORIGINAL COPY</span>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 border border-slate-300 rounded-lg overflow-hidden text-xs mb-4">
              <div className="p-3 border-r border-slate-300 space-y-2 bg-slate-50/40 print:bg-transparent">
                <div className="flex justify-between items-center gap-2">
                  <span className={labelClasses}>Voucher Number:</span>
                  <input 
                    className={`${inputClasses} font-mono font-black text-slate-900 text-sm text-right`}
                    value={voucher.voucherNo}
                    onChange={(e) => handleFieldChange('voucherNo', e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className={labelClasses}>Voucher Date:</span>
                  <input 
                    type="date"
                    className={`${inputClasses} font-medium text-slate-900 text-right`}
                    value={voucher.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className={labelClasses}>Accountant Name:</span>
                  <input 
                    className={`${inputClasses} font-bold text-slate-900 text-right`}
                    value={voucher.accountantName || ''}
                    placeholder="Staff Accountant"
                    onChange={(e) => handleFieldChange('accountantName', e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <span className={labelClasses}>{isOut ? 'Expenses Bill:' : 'Invoice No / Ref:'}</span>
                  <input 
                    className={`${inputClasses} font-mono font-medium text-slate-900 text-right`}
                    value={isOut ? ((voucher as DebitVoucher).originalPurchaseBill || '') : (voucher.invoiceNumber || (voucher as CreditVoucher).referenceDetails || '')}
                    placeholder="N/A"
                    onChange={(e) => handleFieldChange(isOut ? 'originalPurchaseBill' : 'invoiceNumber', e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className={labelClasses}>{isOut ? 'Expenses Bill Date:' : 'Invoice Date:'}</span>
                  <input 
                    type="date"
                    className={`${inputClasses} font-medium text-slate-900 text-right`}
                    value={isOut ? ((voucher as DebitVoucher).purchaseBillDate || '') : (voucher.invoiceDate || voucher.referenceDate || '')}
                    onChange={(e) => handleFieldChange(isOut ? 'purchaseBillDate' : 'invoiceDate', e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className={labelClasses}>{isOut ? 'Payment Mode:' : 'Receipt Mode:'}</span>
                  <select 
                    className={`${inputClasses} font-bold text-blue-800 text-right appearance-none cursor-pointer`}
                    value={isOut ? (voucher as DebitVoucher).paymentMode : (voucher as CreditVoucher).receiptMode}
                    onChange={(e) => handleFieldChange(isOut ? 'paymentMode' : 'receiptMode', e.target.value)}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detailed Content Table */}
            <table className="w-full border-collapse border border-slate-300 text-xs mb-4">
              <tbody>
                {isOut ? (
                  <>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                        Supplier / Payee Name :-
                      </td>
                      <td className="p-2.5">
                        <input 
                          className={`${inputClasses} font-bold text-slate-900 text-sm`}
                          value={(voucher as DebitVoucher).supplierName}
                          onChange={(e) => handleFieldChange('supplierName', e.target.value)}
                        />
                      </td>
                    </tr>
                    {(voucher as DebitVoucher).purchaseOrderNumber && (
                      <tr className="border-b border-slate-300">
                        <td className="p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                          Purchase Order Number
                        </td>
                        <td className="p-2.5">
                          <input 
                            className={`${inputClasses} font-mono font-bold text-blue-800`}
                            value={(voucher as DebitVoucher).purchaseOrderNumber || ''}
                            onChange={(e) => handleFieldChange('purchaseOrderNumber', e.target.value)}
                          />
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-slate-300">
                      <td className="p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                        Supplier GSTIN
                      </td>
                      <td className="p-2.5">
                        <input 
                          className={`${inputClasses} font-bold text-slate-900 font-mono`}
                          value={(voucher as DebitVoucher).supplierGstin || ''}
                          placeholder="-"
                          onChange={(e) => handleFieldChange('supplierGstin', e.target.value)}
                        />
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr className="border-b border-slate-300">
                      <td className="w-1/3 p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                        Customer / Party Name :-
                      </td>
                      <td className="p-2.5">
                        <input 
                          className={`${inputClasses} font-bold text-emerald-950 text-sm`}
                          value={(voucher as CreditVoucher).customerName}
                          onChange={(e) => handleFieldChange('customerName', e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                        Customer GSTIN
                      </td>
                      <td className="p-2.5">
                        <input 
                          className={`${inputClasses} font-bold text-slate-900 font-mono`}
                          value={(voucher as CreditVoucher).customerGstin || ''}
                          placeholder="-"
                          onChange={(e) => handleFieldChange('customerGstin', e.target.value)}
                        />
                      </td>
                    </tr>
                  </>
                )}

                <tr className="border-b border-slate-300">
                  <td className="p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                    Purpose / Description
                  </td>
                  <td className="p-2.5">
                    <textarea 
                      rows={2}
                      className={`${inputClasses} text-slate-800 leading-relaxed resize-none`}
                      value={voucher.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                    />
                  </td>
                </tr>

                {voucher.noteReason && (
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 bg-slate-50 font-bold text-slate-700 border-r border-slate-300">
                      Note / Reason
                    </td>
                    <td className="p-2.5">
                      <input 
                        className={`${inputClasses} text-slate-700 italic`}
                        value={voucher.noteReason || ''}
                        onChange={(e) => handleFieldChange('noteReason', e.target.value)}
                      />
                    </td>
                  </tr>
                )}
                {voucher.items && voucher.items.length > 0 && (
                  <tr>
                    <td colSpan={2} className="p-0">
                      <div className="bg-slate-50/50 p-2.5 border-t border-slate-300">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                          Itemized Particulars ({voucher.items.length} items):
                        </span>
                        <table className="w-full text-xs text-left border border-slate-200 bg-white">
                          <thead className="bg-slate-100 text-[9px] uppercase font-bold text-slate-600 border-b border-slate-200">
                            <tr>
                              <th className="py-1 px-2">Item Description</th>
                              <th className="py-1 px-2 text-center">Qty</th>
                              <th className="py-1 px-2 text-right">Rate (₹)</th>
                              <th className="py-1 px-2 text-right">Amount (₹)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {voucher.items.map((it, idx) => (
                              <tr key={idx}>
                                <td className="py-1 px-2 font-medium text-slate-800">{it.name}</td>
                                <td className="py-1 px-2 text-center font-mono">{it.qty || 1}</td>
                                <td className="py-1 px-2 text-right font-mono">{it.rate ? formatIndianCurrency(it.rate) : '-'}</td>
                                <td className="py-1 px-2 text-right font-bold font-mono text-slate-900">{formatIndianCurrency(it.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Amount Box */}
            <div className="border-2 border-slate-900 rounded-xl p-3.5 mb-4 bg-slate-50/70 print:bg-transparent">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">
                    Amount {isOut ? 'Paid' : 'Received'} (in figures):
                  </span>
                  <div className="flex items-center gap-1 text-2xl font-black text-slate-900 font-mono tracking-tight">
                    <span>₹</span>
                    <input 
                      type="number"
                      className="w-44 border-none bg-transparent p-0 focus:ring-0 font-mono"
                      value={voucher.amount}
                      onChange={(e) => handleFieldChange('amount', e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-slate-900 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg">
                    INR {Number(voucher.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase text-slate-600 block">
                  Amount in Words (Indian Rupees • Editable):
                </span>
                <textarea 
                  rows={1}
                  className={`${inputClasses} text-xs sm:text-sm font-bold text-slate-900 italic mt-0.5 resize-none`}
                  value={voucher.amountInWords}
                  onChange={(e) => handleFieldChange('amountInWords', e.target.value)}
                />
              </div>
            </div>

            {/* EDITABLE TERMS AND CONDITIONS */}
            <div className="border border-slate-300 rounded-xl p-3 mb-4 bg-slate-50/40 print:bg-transparent text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  Terms & Conditions (Editable)
                </span>
              </div>
              <textarea
                rows={2}
                value={termsText}
                onChange={(e) => setTermsText(e.target.value)}
                className="w-full text-[10px] text-slate-600 border-none bg-transparent p-0 focus:ring-0 focus:outline-none resize-none leading-relaxed"
                title="Editable terms and conditions"
              />
            </div>

            {/* Signatures Section (3 columns) */}
            <div className="border border-slate-300 rounded-xl overflow-hidden grid grid-cols-3 text-center text-xs mb-4">
              {/* Prepared By */}
              <div className="p-3 border-r border-slate-300 flex flex-col justify-between h-32">
                <span className="font-bold uppercase text-[9px] text-slate-500 tracking-wider">
                  PREPARED BY
                </span>
                <div className="py-1">
                  <input 
                    className={`${inputClasses} font-semibold text-slate-900 text-xs text-center`}
                    value={voucher.createdBy || ''}
                    placeholder="Name"
                    onChange={(e) => handleFieldChange('createdBy', e.target.value)}
                  />
                  <div className="text-[9px] text-slate-400">Finance & Accounts</div>
                </div>
                <div className="border-t border-slate-200 pt-1 text-[9px] text-slate-500">
                  Date: {voucher.date}
                </div>
              </div>

              {/* Approved By */}
              <div className="p-3 border-r border-slate-300 flex flex-col justify-between h-32 bg-slate-50/30 print:bg-transparent">
                <span className="font-bold uppercase text-[9px] text-slate-500 tracking-wider">
                  APPROVED BY
                </span>
                <div className="py-1">
                  <input 
                    className={`${inputClasses} font-semibold text-slate-900 text-xs text-center`}
                    value={voucher.approvedBy || ''}
                    placeholder="Authorized Manager"
                    onChange={(e) => handleFieldChange('approvedBy', e.target.value)}
                  />
                  <div className="text-[9px] text-emerald-700 font-bold">
                    ✓ Verified & Authorized
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-1 text-[9px] text-slate-500">
                  Official Seal & Stamp
                </div>
              </div>

              {/* Cashier / Receiver */}
              <div className="p-3 flex flex-col justify-between h-32">
                <span className="font-bold uppercase text-[9px] text-slate-500 tracking-wider">
                  {isOut ? 'CASHIER / PAYEE' : 'RECEIVED BY'}
                </span>
                <div className="py-1">
                  <input 
                    className={`${inputClasses} font-semibold text-slate-900 text-xs text-center`}
                    value={isOut ? ((voucher as DebitVoucher).cashierName || '') : ((voucher as CreditVoucher).receivedBy || '')}
                    placeholder="Name"
                    onChange={(e) => handleFieldChange(isOut ? 'cashierName' : 'receivedBy', e.target.value)}
                  />
                </div>
                <div className="border-t border-slate-200 pt-1 text-[9px] text-slate-500">
                  Acknowledgement Signature
                </div>
              </div>
            </div>

            {/* EDITABLE FOOTER */}
            <div className="border-t border-slate-200 pt-2 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400">
              <input
                type="text"
                value={footerDisclaimer}
                onChange={(e) => setFooterDisclaimer(e.target.value)}
                className="w-full sm:w-3/4 border-none bg-transparent p-0 text-[10px] text-slate-400 focus:ring-0"
                title="Editable Footer Disclaimer"
              />
              <span className="font-mono mt-1 sm:mt-0 shrink-0">
                Page 1 • Raviraja Industries Pvt Ltd
              </span>
            </div>

          </div>

          {/* PAGE 2+: UPLOADED DOCUMENTS & PHOTOS (Appended directly for filing if printWithAttachments is true) */}
          {printWithAttachments && voucher.attachments && voucher.attachments.length > 0 && (
            <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-400 print:break-before-page">
              <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    SUPPORTING DOCUMENT / INVOICE FILING SHEET
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Attached to Voucher No: <strong className="font-mono text-slate-800">{voucher.voucherNo}</strong> • Date: {voucher.date}
                  </p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-300">
                  {voucher.attachments.length} Document(s)
                </span>
              </div>

              <div className="space-y-6">
                {voucher.attachments.map((att, idx) => (
                  <div key={att.id} className="border border-slate-300 rounded-xl p-4 bg-slate-50/30 print:bg-transparent">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">Doc #{idx + 1}: {att.name}</span>
                        <span className="text-[10px] text-slate-500">
                          Type: {att.type} • Uploaded: {new Date(att.uploadedAt).toLocaleString()} • Size: {(att.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                        ERP VERIFIED ATTACHMENT
                      </span>
                    </div>

                    {/* Image preview */}
                    {att.mimeType.startsWith('image/') ? (
                      <div className="flex justify-center p-2 bg-white rounded-lg border border-slate-200">
                        <img
                          src={att.dataUrl}
                          alt={att.name}
                          className="max-h-[500px] w-auto max-w-full object-contain rounded"
                        />
                      </div>
                    ) : (
                      <div className="p-6 bg-white rounded-lg border border-slate-200 text-center space-y-2">
                        <FileText className="w-12 h-12 mx-auto text-rose-500 stroke-1" />
                        <p className="text-xs font-bold text-slate-800">{att.name}</p>
                        <p className="text-[10px] text-slate-500">PDF electronic document securely recorded with this voucher.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-400 text-right">
                Filing Attachment Page • Raviraja Industries Pvt Ltd
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
