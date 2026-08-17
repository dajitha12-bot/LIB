import React, { useState } from "react";
import TransactionTable from "./TransactionTable";
import PaymentForm from "./PaymentForm";

function Transactions({ transactions, onPayFineSubmit }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");

  // Payment modal state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Search and filter logic
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bookName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      paymentFilter === "All" || t.paymentStatus === paymentFilter;

    return matchesSearch && matchesFilter;
  });

  const handlePayFineClick = (txn) => {
    setSelectedTransaction(txn);
    setIsPaymentOpen(true);
  };

  const handleRecordPayment = (paymentData) => {
    onPayFineSubmit(paymentData);
    setIsPaymentOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="transactions-page card" style={{ padding: "1.5rem" }}>
      <h2 className="card-title">💸 Fine & Payment Ledger</h2>
      
      {/* Search and Filters Bar */}
      <div className="controls-bar">
        <div className="search-filter-group">
          <input
            type="text"
            className="input-control"
            placeholder="🔍 Search transactions by Txn ID, Student, or Book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="input-control"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="All">All Transactions</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Transaction Log Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onPayFine={handlePayFineClick}
      />

      {/* Collect Payment Form Modal */}
      <PaymentForm
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSubmit={handleRecordPayment}
        transaction={selectedTransaction}
      />
    </div>
  );
}

export default Transactions;
