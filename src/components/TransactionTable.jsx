import React from "react";

function TransactionTable({ transactions, onPayFine }) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">💸</div>
        <p>No transactions recorded matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Txn ID</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Book ID</th>
            <th>Book Name</th>
            <th>Fine</th>
            <th>Status</th>
            <th>Method</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transactionId}>
              <td data-label="Txn ID" style={{ fontWeight: 600 }}>{t.transactionId}</td>
              <td data-label="Student ID">{t.studentId}</td>
              <td data-label="Student Name" style={{ fontWeight: 600 }}>{t.studentName}</td>
              <td data-label="Book ID">{t.bookId}</td>
              <td data-label="Book Name">{t.bookName}</td>
              <td data-label="Fine" style={{ fontWeight: 600 }}>₹{t.fineAmount}</td>
              <td data-label="Status">
                {t.paymentStatus === "Paid" ? (
                  <span className="badge badge-success">🟢 Paid</span>
                ) : (
                  <span className="badge badge-danger">🔴 Unpaid</span>
                )}
              </td>
              <td data-label="Method">{t.paymentMethod}</td>
              <td data-label="Date">{t.paymentDate}</td>
              <td data-label="Action">
                {t.paymentStatus === "Unpaid" && t.fineAmount > 0 ? (
                  <button
                    onClick={() => onPayFine(t)}
                    className="btn btn-primary btn-action"
                    title="Collect Fine"
                  >
                    💳 Pay Fine
                  </button>
                ) : (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
