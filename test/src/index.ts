import { run } from "jest";

const start = async (): Promise<void> => {
  try {
    await run([
      "notification-test",
      "activity-test",
      "user-test",
      "camera-test",
      "dashboard-analytics-test",
      "route-test",
      "site-test",
      "task-test",
      "sop-test",
      "alert-type-test",
      "--detectOpenHandles",
      "--coverage"
    ], ".");
  } catch (e) {
    console.log(e);
  }
};

start();
