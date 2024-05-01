export interface InstanceRequestBody {
  instanceName: string;
}

export interface InstanceResponseBody {
  instanceName: string;
  instanceId: number;
}

export interface TestRecordRequestBody {
  testName: string;
}

export interface TestRecordResponseBody {
  testName: string;
  testId: number;
}
