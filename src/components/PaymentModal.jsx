// src/components/PaymentModal.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const PROVIDERS = [
  { value: "mtn", label: "MTN Mobile Money" },
  { value: "airtel", label: "Airtel Money" },
  { value: "zamtel", label: "Zamtel Kwacha" },
];

const BASE_URL = import.meta.env.VITE_ENDPOINT_URL;

export default function PaymentModal({ booking, onClose, onSuccess }) {
  const { getValidAccessToken } = useAuth();
  const [provider, setProvider] = useState("mtn");
  const [msisdn, setMsisdn] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function callApi(path, body) {
    const token = await getValidAccessToken();
    if (!token) {
      throw new Error("Your session expired. Please log in again.");
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok && res.status !== 402) {
      throw new Error(data.message || "Request failed.");
    }
    return data;
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await callApi("/api/payments/initiate", {
        booking_id: booking.id,
        provider,
        payer_msisdn: msisdn,
        amount: booking.rate,
      });
      setResult(data.transaction);
      if (data.transaction.status === "completed") {
        toast.success("Payment successful!");
        onSuccess?.(data.transaction);
      } else {
        toast.error(`Payment failed: ${data.transaction.failure_reason}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = async () => {
    setSubmitting(true);
    try {
      const data = await callApi(`/api/payments/${result.id}/retry`, { payer_msisdn: msisdn });
      setResult(data.transaction);
      if (data.transaction.status === "completed") {
        toast.success("Payment successful!");
        onSuccess?.(data.transaction);
      } else {
        toast.error(`Failed again: ${data.transaction.failure_reason}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.status === "completed") {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-hard p-6 w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Payment Successful ✅</h3>
          <ReceiptView txn={result} />
          <button
            onClick={onClose}
            className="mt-4 w-full bg-primary-600 text-white rounded-lg py-2 hover:bg-primary-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-hard p-6 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-1">Pay for your session</h3>
        <p className="text-sm text-gray-500 mb-4">Amount: K{booking.rate} — non-refundable once confirmed.</p>

        <form onSubmit={handlePay} className="space-y-3">
          <label className="block text-sm">
            Provider
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="mt-1 w-full border rounded-lg p-2"
            >
              {PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            Mobile Money Number
            <input
              type="tel"
              placeholder="09XXXXXXXX"
              value={msisdn}
              onChange={(e) => setMsisdn(e.target.value)}
              required
              className="mt-1 w-full border rounded-lg p-2"
            />
          </label>

          {result?.status === "failed" ? (
            <button
              type="button"
              onClick={handleRetry}
              disabled={submitting}
              className="w-full bg-amber-500 text-white rounded-lg py-2 hover:bg-amber-600 disabled:opacity-50"
            >
              {submitting ? "Retrying..." : "Retry Payment"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 text-white rounded-lg py-2 hover:bg-primary-700 disabled:opacity-50"
            >
              {submitting ? "Processing..." : `Pay K${booking.rate}`}
            </button>
          )}
        </form>

        <button onClick={onClose} className="mt-3 w-full text-sm text-gray-500">Cancel</button>
      </div>
    </div>
  );
}

// Builds the plain-text receipt content shared by both print and download.
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

function ReceiptView({ txn }) {
  const handlePrint = () => {
    const win = window.open("", "_blank", "width=420,height=600");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Receipt ${txn.receipt?.receipt_number || ""}</title>
          <style>
            body { font-family: monospace; white-space: pre-wrap; padding: 24px; font-size: 13px; }
          </style>
        </head>
        <body>${buildReceiptText(txn)}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleDownload = () => {
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
    <div>
      <div className="text-sm space-y-1 border rounded-lg p-3 bg-gray-50">
        <p><strong>Receipt No:</strong> {txn.receipt?.receipt_number}</p>
        <p><strong>Reference:</strong> {txn.momo_reference}</p>
        <p><strong>Amount Paid:</strong> K{txn.amount}</p>
        <p><strong>Platform Fee (10%):</strong> K{txn.platform_fee}</p>
        <p><strong>Tutor Payout:</strong> K{txn.tutor_payout}</p>
        <p><strong>Issued:</strong> {txn.receipt?.issued_at ? new Date(txn.receipt.issued_at).toLocaleString() : "N/A"}</p>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handlePrint}
          className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          🖨️ Print
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50"
        >
          ⬇️ Download
        </button>
      </div>
    </div>
  );
}
