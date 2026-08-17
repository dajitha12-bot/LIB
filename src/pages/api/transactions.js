import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "transactions.json");

// Helper to read data
function readData() {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading transactions.json file:", error);
    return [];
  }
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to transactions.json file:", error);
    return false;
  }
}

export default function handler(req, res) {
  const { method } = req;
  const transactions = readData();

  switch (method) {
    case "GET":
      return res.status(200).json(transactions);

    case "POST":
      const newTxn = req.body;
      if (!newTxn || !newTxn.transactionId) {
        return res.status(400).json({ message: "Invalid transaction data." });
      }

      transactions.unshift(newTxn); // Add new transaction at the beginning
      if (writeData(transactions)) {
        return res.status(201).json(newTxn);
      } else {
        return res.status(500).json({ message: "Failed to write transaction record on server." });
      }

    case "PUT":
      const paymentUpdate = req.body;
      if (!paymentUpdate || !paymentUpdate.transactionId) {
        return res.status(400).json({ message: "Transaction ID is required for updating payment." });
      }

      const txnIndex = transactions.findIndex((t) => t.transactionId === paymentUpdate.transactionId);
      if (txnIndex === -1) {
        return res.status(404).json({ message: "Transaction record not found." });
      }

      transactions[txnIndex] = {
        ...transactions[txnIndex],
        paymentStatus: "Paid",
        paymentMethod: paymentUpdate.paymentMethod,
        paymentDate: paymentUpdate.paymentDate
      };

      if (writeData(transactions)) {
        return res.status(200).json(transactions[txnIndex]);
      } else {
        return res.status(500).json({ message: "Failed to record payment updates." });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
