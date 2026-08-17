import React, { useState, useEffect } from "react";

function PaymentForm({ isOpen, onClose, onSubmit, transaction }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPaymentDate(today);
    setPaymentMethod("UPI");
    setError("");
  }, [transaction, isOpen]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!paymentMethod || !paymentDate) {
      setError("Please fill in all fields.");
      return;
    }

    onSubmit({
      transactionId: transaction.transactionId,
      paymentMethod,
      paymentDate
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>💳 Record Fine Payment</h3>
          <button onClick={onClose} className="modal-close">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">⚠️ {error}</div>}

            <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Txn ID:</strong> {transaction.transactionId}
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Student:</strong> {transaction.studentName} ({transaction.studentId})
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Book Name:</strong> {transaction.bookName}
              </div>
              <div style={{ fontWeight: 700, color: "var(--status-issued)" }}>
                Fine Amount: ₹{transaction.fineAmount}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method *</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="input-control"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date *</label>
              <input
                type="date"
                id="paymentDate"
                className="input-control"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentForm;
