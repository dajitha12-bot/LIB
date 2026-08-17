import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "books.json");

// Helper function to read books from the JSON file
function readData() {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading books.json file:", error);
    return [];
  }
}

// Helper function to write books to the JSON file
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to books.json file:", error);
    return false;
  }
}

export default function handler(req, res) {
  const { method } = req;
  const books = readData();

  switch (method) {
    case "GET":
      // Return list of books
      return res.status(200).json(books);

    case "POST":
      // Add a new book record
      const newBook = req.body;
      if (!newBook || !newBook.id) {
        return res.status(400).json({ message: "Invalid book record data." });
      }

      // Check for duplicate ID
      const exists = books.some((b) => b.id.toLowerCase() === newBook.id.toLowerCase().trim());
      if (exists) {
        return res.status(400).json({ message: `Book ID "${newBook.id}" already exists!` });
      }

      books.push(newBook);
      if (writeData(books)) {
        return res.status(201).json(newBook);
      } else {
        return res.status(500).json({ message: "Failed to write data on server." });
      }

    case "PUT":
      // Edit/Update details or issue/return status
      const updatedBook = req.body;
      if (!updatedBook || !updatedBook.id) {
        return res.status(400).json({ message: "Invalid update data." });
      }

      const bookIndex = books.findIndex((b) => b.id === updatedBook.id);
      if (bookIndex === -1) {
        return res.status(404).json({ message: "Book record not found." });
      }

      books[bookIndex] = { ...books[bookIndex], ...updatedBook };
      if (writeData(books)) {
        return res.status(200).json(books[bookIndex]);
      } else {
        return res.status(500).json({ message: "Failed to save updates." });
      }

    case "DELETE":
      // Delete a book record by ID
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "Book ID query parameter is required." });
      }

      const index = books.findIndex((b) => b.id === id);
      if (index === -1) {
        return res.status(404).json({ message: "Book record not found." });
      }

      if (books[index].status === "Issued") {
        return res.status(400).json({ message: "Cannot delete a currently checked out book." });
      }

      books.splice(index, 1);
      if (writeData(books)) {
        return res.status(200).json({ message: "Book deleted successfully." });
      } else {
        return res.status(500).json({ message: "Failed to delete record." });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
