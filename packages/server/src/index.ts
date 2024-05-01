import express, { Request, Response } from "express";
import { processInstance } from "./instanceHander";
import { processTestRecord } from "./testRecordHandler";

// Initialize Express app
const app = express();
app.use(express.json());

// Define function to introduce delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Batch route handlers
app.post("/api/instances/batch", async (req: Request, res: Response) => {
  try {
    const batchPayload = req.body; // Assume batch payload is sent in the request body

    // Process each payload with a delay of 100 milliseconds
    const instanceResponses = await Promise.all(
      batchPayload.map(async (item: any) => {
        await delay(100); // Introduce a delay of 100 milliseconds
        return processInstance(item);
      })
    );

    res.json(instanceResponses); // Return responses for batch items
  } catch (error) {
    console.error("Error processing batch for instances:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/test-records/batch", async (req: Request, res: Response) => {
  try {
    const batchPayload = req.body; // Assume batch payload is sent in the request body

    // Process each payload with a delay of 100 milliseconds
    const testRecordResponses = await Promise.all(
      batchPayload.map(async (item: any) => {
        await delay(100); // Introduce a delay of 100 milliseconds
        return processTestRecord(item);
      })
    );

    res.json(testRecordResponses); // Return responses for batch items
  } catch (error) {
    console.error("Error processing batch for test records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
