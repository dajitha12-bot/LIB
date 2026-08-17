import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "activities.json");

// Helper to read data
function readData() {
  try {
    const jsonData = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading activities.json file:", error);
    return [];
  }
}

// Helper to write data
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to activities.json file:", error);
    return false;
  }
}

export default function handler(req, res) {
  const { method } = req;
  const activities = readData();

  switch (method) {
    case "GET":
      return res.status(200).json(activities);

    case "POST":
      const newActivity = req.body;
      if (!newActivity || !newActivity.bookName) {
        return res.status(400).json({ message: "Invalid activity data." });
      }

      activities.unshift(newActivity); // Add to the top of the array
      
      // Limit to max 20 recent records to prevent database bloating
      if (activities.length > 20) {
        activities.pop();
      }

      if (writeData(activities)) {
        return res.status(201).json(newActivity);
      } else {
        return res.status(500).json({ message: "Failed to write activity record on server." });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
