// src/components/ReceiptModal.jsx
// Fetches and displays a past receipt by transaction id — used when a
// student wants to view/print/download a receipt again later, not just
// right after paying.
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_ENDPOINT_URL;

function buildReceiptText(txn) {
  const lines = [
    "TUTOR FINDER — PAYMENT RECEIPT",
    "================================",
    `Receipt No:     ${txn.receipt?.receipt_number || "N/A"}`,
    `Reference:      ${txn.momo_reference || "N/A"}`,
    `Date Issued:    ${txn.receipt?.issued_at ? new Date(txn.receipt.issued_at).toLocaleString() : "N/A"}`,
    "",
    `Student:        ${txn.student_email || ""}`,
    `Tutor:          ${txn.tutor_email || ""}`,
    `Subject:        ${txn.subject || "N/A"}`,
    "",
    `Provider:       ${(txn.provider || "").toUpperCase()}`,
    `Payer Number:   ${txn.payer_msisdn || ""}`,
    "",
    `Amount Paid:    K${txn.amount}`,
    `Platform Fee:   K${txn.platform_fee} (10%)`,
    `Tutor Payout:   K${txn.tutor_payout}`,
    "================================",
    "Thank you for using Tutor Finder.",
  ];
  return lines.join("\n");
}

export default function ReceiptModal({ transactionId, onClose }) {
  const { getValidAccessToken } = useAuth();
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getValidAccessToken();
        const res = await fetch(`${BASE_URL}/api/payments/${transactionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTxn(data.transaction);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [transactionId, getValidAccessToken]);

  const handlePrint = () => {
    if (!txn) return;
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Receipt ${txn.receipt?.receipt_number || ""}</title>
          <style>body { font-family: monospace; white-space: pre-wrap; padding: 24px; font-size: 13px; }</style>
        </head>
        <body>${buildReceiptText(txn)}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleDownload = () => {
    if (!txn) return;
    const blob = new Blob([buildReceiptText(txn)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${txn.receipt?.receipt_number || txn.id}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-hard p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Receipt</h3>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : txn ? (
          <>
            <div className="text-sm space-y-1 border rounded-lg p-3 bg-gray-50">
              <p><strong>Receipt No:</strong> {txn.receipt?.receipt_number}</p>
              <p><strong>Reference:</strong> {txn.momo_reference}</p>
              <p><strong>Amount Paid:</strong> K{txn.amount}</p>
              <p><strong>Platform Fee (10%):</strong> K{txn.platform_fee}</p>
              <p><strong>Tutor Payout:</strong> K{txn.tutor_payout}</p>
              <p><strong>Issued:</strong> {txn.receipt?.issued_at ? new Date(txn.receipt.issued_at).toLocaleString() : "N/A"}</p>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={handlePrint} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
                🖨️ Print
              </button>
              <button onClick={handleDownload} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">
                ⬇️ Download
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-red-500">Could not load this receipt.</p>
        )}

        <button onClick={onClose} className="mt-4 w-full bg-primary-600 text-white rounded-lg py-2 hover:bg-primary-700">
          Close
        </button>
      </div>
    </div>
  );
}
