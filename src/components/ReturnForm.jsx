import React, { useState, useEffect } from "react";

function ReturnForm({ isOpen, onClose, onSubmit, bookToReturn }) {
  const [returnDate, setReturnDate] = useState("");
  const [lateDays, setLateDays] = useState(0);
  const [fine, setFine] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setReturnDate(today);
  }, [bookToReturn, isOpen]);

  useEffect(() => {
    if (!bookToReturn || !returnDate) {
      setLateDays(0);
      setFine(0);
      return;
    }

    const dDate = new Date(bookToReturn.dueDate);
    const rDate = new Date(returnDate);

    // Reset hours to compare dates cleanly
    dDate.setHours(0,0,0,0);
    rDate.setHours(0,0,0,0);

    const diffTime = rDate.getTime() - dDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      setLateDays(diffDays);
      setFine(diffDays * 10); // ₹10 per late day
    } else {
      setLateDays(0);
      setFine(0);
    }
  }, [returnDate, bookToReturn]);

  if (!isOpen || !bookToReturn) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      bookId: bookToReturn.id,
      bookName: bookToReturn.name,
      studentId: bookToReturn.studentId,
      studentName: bookToReturn.studentName,
      issueDate: bookToReturn.issueDate,
      dueDate: bookToReturn.dueDate,
      returnDate: returnDate,
      fineAmount: fine,
      lateDays: lateDays
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>↩️ Return Book</h3>
          <button onClick={onClose} className="modal-close">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Book ID:</strong> {bookToReturn.id}
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Book Name:</strong> {bookToReturn.name}
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Student:</strong> {bookToReturn.studentName} ({bookToReturn.studentId})
              </div>
              <div style={{ marginBottom: "0.5rem" }}>
                <strong>Issue Date:</strong> {bookToReturn.issueDate}
              </div>
              <div>
                <strong>Due Date:</strong> {bookToReturn.dueDate}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="returnDate">Return Date *</label>
              <input
                type="date"
                id="returnDate"
                className="input-control"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>

            <div style={{ padding: "1rem", backgroundColor: fine > 0 ? "#fef2f2" : "#ecfdf5", borderRadius: "var(--radius-md)", border: "1px solid", borderColor: fine > 0 ? "#fee2e2" : "#d1fae5", fontSize: "0.95rem", fontWeight: 600 }}>
              {fine > 0 ? (
                <div style={{ color: "var(--status-issued)" }}>
                  ⚠️ Overdue by {lateDays} day{lateDays > 1 ? "s" : ""}.<br />
                  Fine Amount: ₹{fine} (₹10/day)
                </div>
              ) : (
                <div style={{ color: "var(--status-available)" }}>
                  🟢 Returned on time. No fine.
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReturnForm;
