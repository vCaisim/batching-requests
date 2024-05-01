import { RequestBatcher } from "./RequestBatcher";
import {
  InstanceRequestBody,
  InstanceResponseBody,
  TestRecordRequestBody,
  TestRecordResponseBody,
} from "./types";

function main() {
  // Define options for the first RequestBatcher (for instances)
  const instanceBatcherOptions = {
    apiEndpoint: "api/instances/batch",
    batchSize: 5,
    batchTimeout: 5000,
  };

  // Define options for the second RequestBatcher (for test records)
  const testRecordBatcherOptions = {
    apiEndpoint: "api/test-records/batch",
    batchSize: 3,
    batchTimeout: 2500,
  };

  // Create the first RequestBatcher (for instances)
  const instanceBatcher = new RequestBatcher<
    InstanceRequestBody,
    InstanceResponseBody
  >(instanceBatcherOptions);

  // Create the second RequestBatcher (for test records)
  const testRecordBatcher = new RequestBatcher<
    TestRecordRequestBody,
    TestRecordResponseBody
  >(testRecordBatcherOptions);

  const results: any[] = [];

  // Add requests to the first RequestBatcher (for instances)
  for (let i = 0; i < 7; i++) {
    results.push(
      instanceBatcher.addRequest({
        body: { instanceName: `Instance ${i + 1}` },
      })
    );
  }

  // Add requests to the second RequestBatcher (for test records)
  for (let i = 0; i < 6; i++) {
    results.push(
      testRecordBatcher.addRequest({ body: { testName: `Test ${i + 1}` } })
    );
  }

  console.log({ results });
  (async () => {
    console.dir({ resolved: await Promise.all(results) }, { depth: 6 });
  })();
}

main();
