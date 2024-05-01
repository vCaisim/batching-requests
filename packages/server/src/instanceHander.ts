// Import the required types
import { delay } from "./lib";
import { InstanceRequestBody, InstanceResponseBody } from "./types";

// Example implementation for processInstance function
export async function processInstance(
  instance: InstanceRequestBody
): Promise<InstanceResponseBody> {
  // Generate a unique instance ID
  const instanceId = Math.floor(Math.random() * 1000); // Example random instance ID
  // Simulate processing time
  await delay(500); // Processing time of 500 milliseconds
  // Example processing logic
  return { ...instance, instanceId }; // Include request body and generated instance ID in response
}
