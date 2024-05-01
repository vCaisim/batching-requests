import fetch from "node-fetch";

interface BatchItem<T> {
  body?: T; // Optional request body
}

interface RequestBatcherOptions {
  apiEndpoint: string;
  batchSize: number;
  batchTimeout: number;
  method?: "POST" | "PUT";
}

export class RequestBatcher<T, U> {
  private requests: Array<{
    request: BatchItem<T>;
    resolve: (value: U | PromiseLike<U>) => void;
    reject: (reason?: any) => void;
  }> = [];

  private batchSize: number;
  private batchTimeout: number;
  private batchTimer: NodeJS.Timeout | null = null;
  private apiEndpoint: string;
  private method: "POST" | "PUT";

  constructor(options: RequestBatcherOptions) {
    this.apiEndpoint = options.apiEndpoint;
    this.batchSize = options.batchSize;
    this.batchTimeout = options.batchTimeout;
    this.method = options.method ?? "POST";
  }

  public addRequest(request: BatchItem<T>): Promise<U> {
    const promise = new Promise<U>((resolve, reject) => {
      this.requests.push({ request, resolve, reject });
      if (!this.batchTimer) {
        // Start the batch timer only if it's not already running
        this.batchTimer = setTimeout(() => {
          this.sendBatchRequest();
        }, this.batchTimeout);
      }
    });

    return promise;
  }

  private async sendBatchRequest(): Promise<void> {
    // Check if there are requests in the array
    if (this.requests.length === 0) {
      // No requests to send, clear the batch timer
      clearTimeout(this.batchTimer!);
      this.batchTimer = null;
      return;
    }

    // Clear existing batch timer if it's active
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Slice the first batchSize requests from the array
    const batch = this.requests.splice(0, this.batchSize);

    try {
      // Send batch request to server and wait for response
      const responseData = await this.sendHttpRequest(
        batch.map(({ request }) => request)
      );

      // Resolve promises with responses for each request in the batch
      batch.forEach(({ resolve }, index) => {
        resolve(responseData[index]);
      });
    } catch (error: any) {
      // Reject promises with error for each request in the batch
      batch.forEach(({ reject }) => {
        reject(error);
      });
    }

    // Reset the batch timer for the next batch
    this.batchTimer = setTimeout(() => {
      this.sendBatchRequest();
    }, this.batchTimeout);
  }

  private async sendHttpRequest(batch: BatchItem<T>[]): Promise<U[]> {
    try {
      const res = await fetch(`http://localhost:3000/${this.apiEndpoint}`, {
        method: this.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batch), // Serialize batch to JSON string
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Batch request successful:", responseData);
      return responseData as U[]; // Assert the response type to U[]
    } catch (error: any) {
      console.error("Error sending batch request:", error.message);
      return [];
    }
  }
}
