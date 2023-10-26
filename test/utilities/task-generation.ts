import { v4 as uuidv4 } from "uuid";
import {
  format,
  subDays
} from "date-fns";
const insertQueries: string[] = [];

const now = new Date();
const formattedDate: string = format(subDays(now, 1), "yyyy-MM-dd HH:mm:ss.SSS");
const status = "Completed";

for (let i = 0; i < 10; i++) {
  // Generate random UUIDs for route_task and route_report
  const routeTaskId = uuidv4();
  const routeId = "558508df-4fe0-48ea-9792-97e7fd0dabcb";

  // Generate INSERT query for route_task table
  const routeTaskQuery = `INSERT INTO route_task (id, "name", "occurrenceDate", "startTime", "endTime", status, "startComment", "endComment", "lastCheckpointId", "alertedCameraIds", "routeId") VALUES ('${routeTaskId}'::uuid, 'Afternoon jun-13', '${formattedDate}', 3600, 7200, '${status}', NULL, NULL, NULL, '{}'::json, '${routeId}'::uuid);`;

  // Generate INSERT query for route_report table
  const routeReportQuery = `INSERT INTO task_report (id, "createdAt", "reportDataRows") VALUES ('${routeTaskId}'::uuid, '${formattedDate}', '{"1":[{"camera":{"id":"7d7ccd38-cfbf-21b9-1d28-571c03a82f4a","name":"FM372 - 11 Jalan Bunga Rampai","snapshotTimeInEpoch":"342"},"timeCompleted":"2023-07-10T07:17:12.736Z","completedUserId":"b68920ff-bd44-4bde-8d70-fe093aa27497","completedUserName":"admin","faultDetected":true,"alert":{"type":"Fire","description":"fw","actionsTaken":"fwf"}}]}'::json);`;

  insertQueries.push(routeTaskQuery);
  insertQueries.push(routeReportQuery);
}

// Print the generated INSERT queries
for (const query of insertQueries) {
  console.log(query);
}
