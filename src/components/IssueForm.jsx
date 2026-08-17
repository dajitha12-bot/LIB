import React, { useState, useEffect } from "react";

function IssueForm({ isOpen, onClose, onSubmit, preSelectedBook, availableBooks }) {
  const [formData, setFormData] = useState({
    bookId: "",
    studentId: "",
    studentName: "",
    issueDate: "",
    dueDate: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    // Set default dates (Today and Today + 7 days)
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split("T")[0];

    if (preSelectedBook) {
      setFormData({
        bookId: preSelectedBook.id,
        studentId: "",
        studentName: "",
        issueDate: todayStr,
        dueDate: nextWeekStr
      });
    } else {
      setFormData({
        bookId: "",
        studentId: "",
        studentName: "",
        issueDate: todayStr,
        dueDate: nextWeekStr
      });
    }
    setError("");
  }, [preSelectedBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.bookId ||
      !formData.studentId.trim() ||
      !formData.studentName.trim() ||
      !formData.issueDate ||
      !formData.dueDate
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Check dates validation
    if (new Date(formData.issueDate) > new Date(formData.dueDate)) {
      setError("Due Date cannot be before Issue Date.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>📖 Issue Book</h3>
          <button onClick={onClose} className="modal-close">
            &times;
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">⚠️ {error}</div>}

            <div className="form-group">
              <label htmlFor="bookId">Book Name / Book ID *</label>
              {preSelectedBook ? (
                <input
                  type="text"
                  className="input-control"
                  value={`${preSelectedBook.name} (${preSelectedBook.id})`}
                  disabled
                />
              ) : (
                <select
                  id="bookId"
                  name="bookId"
                  className="input-control"
                  value={formData.bookId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Book</option>
                  {availableBooks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.id})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="studentId">Student ID *</label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                className="input-control"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g. ST101"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="studentName">Student Name *</label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                className="input-control"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="issueDate">Issue Date *</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                className="input-control"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="input-control"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IssueForm;
