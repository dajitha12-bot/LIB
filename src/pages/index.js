import React, { useState, useEffect } from "react";
import Head from "next/head";

// Components
import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../components/Home";
import Books from "../components/Books";
import MyLibrary from "../components/MyLibrary";
import Transactions from "../components/Transactions";

// Modal forms
import IssueForm from "../components/IssueForm";
import ReturnForm from "../components/ReturnForm";

export default function IndexPage() {
  const [mounted, setMounted] = useState(false);
  const [activePage, setActivePage] = useState("home");

  // State values fetched from APIs
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal dialog triggers
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [issuePreselectedBook, setIssuePreselectedBook] = useState(null);

  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [returnPreselectedBook, setReturnPreselectedBook] = useState(null);

  // Fetch all databases from Next.js API endpoints on mount
  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, txnsRes, actsRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/transactions"),
        fetch("/api/activities")
      ]);

      const [booksData, txnsData, actsData] = await Promise.all([
        booksRes.json(),
        txnsRes.json(),
        actsRes.json()
      ]);

      setBooks(booksData);
      setTransactions(txnsData);
      setActivities(actsData);
    } catch (error) {
      console.error("Error fetching databases from Next.js APIs:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- CONTROLLER HANDLERS FOR API WRITING ---

  // 1. Add Book (POST /api/books)
  const handleAddBook = async (newBook) => {
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to add book.");
      }

      const added = await response.json();
      setBooks((prev) => [...prev, added]);
      alert("🎉 Book added successfully and saved to books.json!");
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  // 2. Edit Book (PUT /api/books)
  const handleEditBook = async (editedBook) => {
    try {
      const response = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedBook)
      });

      if (!response.ok) {
        throw new Error("Failed to save book updates.");
      }

      const updated = await response.json();
      setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      alert("✏️ Book details updated and saved to books.json!");
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  // 3. Delete Book (DELETE /api/books)
  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`/api/books?id=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete book.");
      }

      setBooks((prev) => prev.filter((b) => b.id !== id));
      alert("🗑️ Book record deleted and updated in books.json!");
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  // 4. Issue Book (PUT /api/books & POST /api/activities)
  const handleIssueSubmit = async (issueData) => {
    const book = books.find((b) => b.id === issueData.bookId);
    if (!book) return;

    try {
      // Step A: Update book status via PUT
      const bookUpdate = {
        id: issueData.bookId,
        status: "Issued",
        studentId: issueData.studentId,
        studentName: issueData.studentName,
        issueDate: issueData.issueDate,
        dueDate: issueData.dueDate
      };

      const bookRes = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookUpdate)
      });

      if (!bookRes.ok) throw new Error("Failed to issue book.");
      const updatedBook = await bookRes.json();

      // Step B: Record checkout activity via POST
      const activityData = {
        bookName: book.name,
        studentId: issueData.studentId,
        action: "Issued",
        date: issueData.issueDate
      };

      const actRes = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData)
      });
      const recordedAct = await actRes.json();

      // Sync state locally
      setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
      setActivities((prev) => [recordedAct, ...prev]);

      setIsIssueOpen(false);
      setIssuePreselectedBook(null);
      alert("🎉 Book issued successfully and saved to JSON files!");
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  // 5. Return Book (PUT /api/books, POST /api/activities & POST /api/transactions)
  const handleReturnSubmit = async (returnData) => {
    try {
      // Step A: Make book available again via PUT
      const bookUpdate = {
        id: returnData.bookId,
        status: "Available",
        studentId: "",
        studentName: "",
        issueDate: "",
        dueDate: ""
      };

      const bookRes = await fetch("/api/books", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookUpdate)
      });

      if (!bookRes.ok) throw new Error("Failed to complete check-in.");
      const updatedBook = await bookRes.json();

      // Step B: Record return activity via POST
      const activityData = {
        bookName: returnData.bookName,
        studentId: returnData.studentId,
        action: "Returned",
        date: returnData.returnDate
      };

      const actRes = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData)
      });
      const recordedAct = await actRes.json();

      let createdTxn = null;
      // Step C: Log fine transaction if fine is greater than 0
      if (returnData.fineAmount > 0) {
        // Calculate new F-prefixed transaction ID
        const prefix = "F";
        const fineTxns = transactions.filter((t) => t.transactionId.startsWith(prefix));
        let nextNum = 1;
        if (fineTxns.length > 0) {
          const nums = fineTxns.map((t) => parseInt(t.transactionId.replace(prefix, ""), 10));
          nextNum = Math.max(...nums) + 1;
        }
        const newTxnId = `${prefix}${String(nextNum).padStart(3, "0")}`;

        const newTxn = {
          transactionId: newTxnId,
          studentId: returnData.studentId,
          studentName: returnData.studentName,
          bookId: returnData.bookId,
          bookName: returnData.bookName,
          fineAmount: returnData.fineAmount,
          paymentStatus: "Unpaid",
          paymentMethod: "-",
          paymentDate: "-"
        };

        const txnRes = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTxn)
        });
        createdTxn = await txnRes.json();
      }

      // Sync state locally
      setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
      setActivities((prev) => [recordedAct, ...prev]);
      if (createdTxn) {
        setTransactions((prev) => [createdTxn, ...prev]);
      }

      setIsReturnOpen(false);
      setReturnPreselectedBook(null);
      alert("🎉 Book check-in complete! Databases saved to JSON files.");
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  // 6. Pay Fine (PUT /api/transactions)
  const handlePayFineSubmit = async (paymentData) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) throw new Error("Failed to record fine payment.");
      const updatedTxn = await response.json();

      setTransactions((prev) => prev.map((t) => (t.transactionId === updatedTxn.transactionId ? updatedTxn : t)));
      alert("💳 Fine payment recorded successfully and saved to transactions.json!");
    } catch (error) {
      alert(`⚠️ Error: ${error.message}`);
    }
  };

  // Modals controllers
  const triggerIssueModal = (book = null) => {
    setIssuePreselectedBook(book);
    setIsIssueOpen(true);
  };

  const triggerReturnModal = (book) => {
    setReturnPreselectedBook(book);
    setIsReturnOpen(true);
  };

  const availableBooks = books.filter((b) => b.status === "Available");

  // Prevent server-hydration mismatch by returning null until mounted
  if (!mounted) return null;

  // Render view
  const renderActivePage = () => {
    if (loading) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Loading databases from server JSON files...</p>
        </div>
      );
    }

    switch (activePage) {
      case "home":
        return (
          <Home
            books={books}
            activities={activities}
            setActivePage={setActivePage}
            onAddBookClick={() => {
              setActivePage("books");
            }}
            onIssueBookClick={() => triggerIssueModal(null)}
          />
        );
      case "books":
        return (
          <Books
            books={books}
            setBooks={setBooks}
            onIssueClick={(book) => triggerIssueModal(book)}
            onAddBook={handleAddBook}
            onEditBook={handleEditBook}
            onDeleteBook={handleDeleteBook}
          />
        );
      case "library":
        return <MyLibrary books={books} onReturnClick={triggerReturnModal} />;
      case "transactions":
        return (
          <Transactions
            transactions={transactions}
            onPayFineSubmit={handlePayFineSubmit}
          />
        );
      default:
        return (
          <Home
            books={books}
            activities={activities}
            setActivePage={setActivePage}
            onAddBookClick={() => setActivePage("books")}
            onIssueBookClick={() => triggerIssueModal(null)}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <Head>
        <title>SmartLib Entry - Library Receptionist System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">{renderActivePage()}</main>

      <Footer />

      {/* GLOBAL MODALS */}
      <IssueForm
        isOpen={isIssueOpen}
        onClose={() => {
          setIsIssueOpen(false);
          setIssuePreselectedBook(null);
        }}
        onSubmit={handleIssueSubmit}
        preSelectedBook={issuePreselectedBook}
        availableBooks={availableBooks}
      />

      <ReturnForm
        isOpen={isReturnOpen}
        onClose={() => {
          setIsReturnOpen(false);
          setReturnPreselectedBook(null);
        }}
        onSubmit={handleReturnSubmit}
        bookToReturn={returnPreselectedBook}
      />
    </div>
  );
}
