export const DashboardAnalyticsResponse = {
  "id" : "Jul-2023",
  "siteId" : "0",
  "taskCountAnalytics" : {
    "Pending" : 10,
    "OnGoing" : 0,
    "NotStarted" : 0,
    "Paused" : 20,
    "Completed" : 100,
    "Incomplete" : 35,
    "Missed" : 20
  },
  "alertCountAnalytics" : {
    "Shoplifting" : 20,
    "Robbery" : 15,
    "Lightning" : 20,
    "Fire" : 10,
    "Littering" : 10
  },
  "weeklyAlertCountAnalytics" : [
    5,
    4,
    12,
    7
  ]
};

export const TaskListResponse = {
  count : 8,
  data : [
    {
      "id" : "a5d99f1a-2a47-4652-ab48-3c4ed341db7a",
      "name" : "Morning Entrance Carpark A",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 28800,
      "endTime" : 113400,
      "status" : "Incomplete",
      "startComment" : null,
      "endComment" : "Route was deleted!",
      "routeId" : "2453b981-5109-408b-b8ad-d884ab3a9b27",
      "route" : {
        "id" : "2453b981-5109-408b-b8ad-d884ab3a9b27",
        "name" : "Entrance Carpark A",
        "siteId" : "6",
        "allowStartTime" : 900,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "6",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-08T03:17:13.493Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "53b5aeaa-688b-482b-ab73-5065aeba908c",
            "name" : "admin"
          },
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "22682c6c-eb6f-41d0-a429-e170147161e3",
      "name" : "Morning 23/8",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 41400,
      "endTime" : 59400,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "12345678",
      "routeId" : "160713d9-920f-464b-8472-effd457ae752",
      "route" : {
        "id" : "160713d9-920f-464b-8472-effd457ae752",
        "name" : "23/8",
        "siteId" : "6",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "6",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-23T03:59:40.519Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "reportCreatedAt" : "2023-08-23T05:25:06.367Z",
      "lastCheckpointId" : "326ada8d-f24c-491e-a7f3-385086cc7e94"
    },
    {
      "id" : "c960a291-3e4a-4b7f-8eb3-95a79207acbc",
      "name" : "Morning Main Exit ",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 41400,
      "endTime" : 126000,
      "status" : "Incomplete",
      "startComment" : null,
      "endComment" : "Route was deleted!",
      "routeId" : "aebf3e99-1267-4875-bea4-4794e64c65bd",
      "route" : {
        "id" : "aebf3e99-1267-4875-bea4-4794e64c65bd",
        "name" : "Main Exit ",
        "siteId" : "7",
        "allowStartTime" : 900,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "7",
          "name" : "Building B"
        },
        "createdAt" : "2023-08-08T03:23:24.018Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "78bc38bc-48f7-4046-8949-f3c4fc50dba9",
      "name" : "Afternoon Logistics ",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 50400,
      "endTime" : 54000,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "Forgot about Patrol ",
      "routeId" : "d1b2e17e-d974-4dd6-89d3-a157114df22c",
      "route" : {
        "id" : "d1b2e17e-d974-4dd6-89d3-a157114df22c",
        "name" : "Logistics ",
        "siteId" : "7",
        "allowStartTime" : 900,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "7",
          "name" : "Building B"
        },
        "createdAt" : "2023-08-08T06:21:13.202Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "53b5aeaa-688b-482b-ab73-5065aeba908c",
            "name" : "admin"
          },
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "634a0a18-41a3-4fef-b49f-6336c050f0a1",
      "name" : "Afternoon Test B",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 66600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "Problems at Site ",
      "routeId" : "30558f07-ae7a-47b8-8403-536bd53003d9",
      "route" : {
        "id" : "30558f07-ae7a-47b8-8403-536bd53003d9",
        "name" : "Test B",
        "siteId" : "7",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "7",
          "name" : "Building B"
        },
        "createdAt" : "2023-08-08T07:39:59.827Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "53b5aeaa-688b-482b-ab73-5065aeba908c",
            "name" : "admin"
          },
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "2e78aa95-0e0e-4489-9ccc-69f591cb2a0f",
      "name" : "Afternoon Test 17/8",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 57600,
      "endTime" : 66600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "Late / Urgent Leave ",
      "routeId" : "98f878a6-6c26-47f4-b0fd-f4c51a8230dc",
      "route" : {
        "id" : "98f878a6-6c26-47f4-b0fd-f4c51a8230dc",
        "name" : "Test 17/8",
        "siteId" : "6",
        "allowStartTime" : 900,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "6",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-17T07:24:31.470Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "d91c8aa6-91d9-43e3-8c7b-045f49e50093",
      "name" : "Night Main Lobby",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 84600,
      "endTime" : 88200,
      "status" : "Incomplete",
      "startComment" : null,
      "endComment" : "Route was deleted!",
      "routeId" : "512a0a42-1064-40e8-882d-6d6b0943499f",
      "route" : {
        "id" : "512a0a42-1064-40e8-882d-6d6b0943499f",
        "name" : "Main Lobby",
        "siteId" : "8",
        "allowStartTime" : 900,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "8",
          "name" : "Building C"
        },
        "createdAt" : "2023-08-08T03:28:11.672Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          },
          {
            "id" : "53b5aeaa-688b-482b-ab73-5065aeba908c",
            "name" : "admin"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "c0133771-5749-4174-9c9f-230c5c4cef69",
      "name" : "Night Main Lobby",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 84600,
      "endTime" : 88200,
      "status" : "Incomplete",
      "startComment" : null,
      "endComment" : "Route was deleted!",
      "routeId" : "512a0a42-1064-40e8-882d-6d6b0943499f",
      "route" : {
        "id" : "512a0a42-1064-40e8-882d-6d6b0943499f",
        "name" : "Main Lobby",
        "siteId" : "8",
        "allowStartTime" : 900,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "8",
          "name" : "Building C"
        },
        "createdAt" : "2023-08-08T03:28:11.672Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          },
          {
            "id" : "53b5aeaa-688b-482b-ab73-5065aeba908c",
            "name" : "admin"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "dbe6f6ee-f2c2-471b-9c31-1758d893def1",
      "name" : "Night my-tasks-asigned",
      "occurrenceDate" : "2023-08-23T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 79200,
      "status" : "Pending",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "51728888-869a-4037-9ebb-69df71e22cb1",
      "route" : {
        "id" : "51728888-869a-4037-9ebb-69df71e22cb1",
        "name" : "my-tasks-asigned",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-24T02:48:22.521Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "e79ec48e-e148-478d-be99-4e5ee1719a73",
      "name" : "Night lamp",
      "occurrenceDate" : "2023-08-23T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "7805c9bf-133d-4eb4-9478-ed3ba331974c",
      "route" : {
        "id" : "7805c9bf-133d-4eb4-9478-ed3ba331974c",
        "name" : "lamp",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T07:57:01.724Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "c2abe4ef-0855-41c9-8a3f-e61d61fc55f4",
      "name" : "Night my-tasks-asigned",
      "occurrenceDate" : "2023-08-23T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 41400,
      "status" : "Incomplete",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "51728888-869a-4037-9ebb-69df71e22cb1",
      "route" : {
        "id" : "51728888-869a-4037-9ebb-69df71e22cb1",
        "name" : "my-tasks-asigned",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-24T02:48:22.521Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-08-24T03:38:44.260Z",
      "lastCheckpointId" : "9d8e06d4-fbef-455f-9398-c43f9dc14ecb"
    },
    {
      "id" : "95372992-830d-4753-935b-6528ae75574a",
      "name" : "Night abc-def",
      "occurrenceDate" : "2023-08-24T16:00:00.000Z",
      "startTime" : 5400,
      "endTime" : 7200,
      "status" : "Pending",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "3ba4f0ff-0212-4d83-b2c7-65c8d492ef6f",
      "route" : {
        "id" : "3ba4f0ff-0212-4d83-b2c7-65c8d492ef6f",
        "name" : "abc-def",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-24T16:17:25.442Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    }
  ]
};

export const TaskListResponseFor10Aug2023 = {
  count : 13,
  data : [
    {
      "id" : "637214be-feb0-488a-ac0a-10d7468f5ae2",
      "name" : "Night candy",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "29bd15cb-eab2-4456-baef-772733666526",
      "route" : {
        "id" : "29bd15cb-eab2-4456-baef-772733666526",
        "name" : "candy",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T07:53:08.526Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "f4f36f70-eba2-4474-aa8c-301934f015ea",
      "name" : "Night schedule-test",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
      "route" : {
        "id" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
        "name" : "schedule-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T04:45:04.572Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "0aac0d97-47dc-47e8-ba62-53220e626b8e",
      "name" : "Night schedule-test",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
      "route" : {
        "id" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
        "name" : "schedule-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T04:45:04.572Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "68fdb258-d702-4e78-adf6-203539e8e4c8",
      "name" : "Night schedule-test",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
      "route" : {
        "id" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
        "name" : "schedule-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T04:45:04.572Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "941baa15-6e37-4b89-9b43-c5c8b4c6206c",
      "name" : "Night sche-time-update-test",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "ed3df68c-d12b-441c-b8ea-a140847384a8",
      "route" : {
        "id" : "ed3df68c-d12b-441c-b8ea-a140847384a8",
        "name" : "sche-time-update-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T04:00:53.027Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "55afec18-c546-4043-b62a-8fecd524d4ca",
      "name" : "Night glasses",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "f9e07982-560d-4aa0-944b-4650a76a49f2",
      "route" : {
        "id" : "f9e07982-560d-4aa0-944b-4650a76a49f2",
        "name" : "glasses",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T07:54:48.745Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "457cccae-da83-426c-ba8c-c22a118d33e5",
      "name" : "Night schedule-test",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
      "route" : {
        "id" : "47a40f3e-1d35-4629-9cfc-3f982839064c",
        "name" : "schedule-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T04:45:04.572Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "384dce0a-a18c-48ee-b720-d2f48adf13c9",
      "name" : "Night lamp",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "7805c9bf-133d-4eb4-9478-ed3ba331974c",
      "route" : {
        "id" : "7805c9bf-133d-4eb4-9478-ed3ba331974c",
        "name" : "lamp",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T07:57:01.724Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "19675966-49e4-425b-a593-5df4a2838617",
      "name" : "Morning 5x5-img-1",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 34200,
      "endTime" : 81000,
      "status" : "Incomplete",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "685aa7e7-730b-4549-b6ea-e6c7bfc2ee94",
      "route" : {
        "id" : "685aa7e7-730b-4549-b6ea-e6c7bfc2ee94",
        "name" : "5x5-img-1",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T01:50:00.589Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-08-10T01:50:10.323Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "8c34220d-599c-4d0e-a038-a46257021ef7",
      "name" : "Morning 5x5-img-1",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 34200,
      "endTime" : 82800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "685aa7e7-730b-4549-b6ea-e6c7bfc2ee94",
      "route" : {
        "id" : "685aa7e7-730b-4549-b6ea-e6c7bfc2ee94",
        "name" : "5x5-img-1",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T01:50:00.589Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "3f4d2f94-131a-4922-bef1-cd962b69701f",
      "name" : "Morning 3x3-img-1",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 36000,
      "endTime" : 79200,
      "status" : "Incomplete",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "58c32189-ddd2-41f3-9974-72285f92933a",
      "route" : {
        "id" : "58c32189-ddd2-41f3-9974-72285f92933a",
        "name" : "3x3-img-1",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T02:28:43.016Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-08-10T02:28:51.745Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "a981fef0-e1e5-41e0-98ae-d1487cbf86ae",
      "name" : "Morning 3x3-img-1",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 36000,
      "endTime" : 82800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "58c32189-ddd2-41f3-9974-72285f92933a",
      "route" : {
        "id" : "58c32189-ddd2-41f3-9974-72285f92933a",
        "name" : "3x3-img-1",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T02:28:43.016Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "5a96dc21-a4c3-403c-ad0e-9201297485fa",
      "name" : "Afternoon sche-time-update-test",
      "occurrenceDate" : "2023-08-09T16:00:00.000Z",
      "startTime" : 46800,
      "endTime" : 84600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "ed3df68c-d12b-441c-b8ea-a140847384a8",
      "route" : {
        "id" : "ed3df68c-d12b-441c-b8ea-a140847384a8",
        "name" : "sche-time-update-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-10T04:00:53.027Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    }
  ]
};

export const TaskListResponseForJul2023 = {
  count : 13,
  data : [
    {
      "id" : "0b110e67-1c2c-4be6-a7ae-bce945e0686c",
      "name" : "Night camera-grid-test",
      "occurrenceDate" : "2023-07-03T16:00:00.000Z",
      "startTime" : 79200,
      "endTime" : 84600,
      "status" : "Incomplete",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "b50034c4-40f5-4115-8ef1-84684b0b074a",
      "route" : {
        "id" : "b50034c4-40f5-4115-8ef1-84684b0b074a",
        "name" : "camera-grid-test",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-04T14:02:33.627Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-07-04T14:03:18.856Z",
      "lastCheckpointId" : "f9500983-dc18-4386-8997-818b1dda758f"
    },
    {
      "id" : "3679ede5-83c2-4610-853f-5e4c57f774ef",
      "name" : "Afternoon video-feed-1",
      "occurrenceDate" : "2023-07-01T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "8cf5d8a6-8a5c-4e5d-8b9a-d1d376fb182e",
      "route" : {
        "id" : "8cf5d8a6-8a5c-4e5d-8b9a-d1d376fb182e",
        "name" : "video-feed-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-24T16:19:58.615Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "e925409f-5809-4b48-b0ab-73bedf124886",
      "name" : "Afternoon addd",
      "occurrenceDate" : "2023-07-01T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "8642c73b-3307-4342-a213-6c54dd8f6442",
      "route" : {
        "id" : "8642c73b-3307-4342-a213-6c54dd8f6442",
        "name" : "addd",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-02T12:23:33.292Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "07c26ff6-30cc-415a-ac4a-aecfb6b8605a",
      "name" : "Afternoon addd",
      "occurrenceDate" : "2023-07-01T16:00:00.000Z",
      "startTime" : 7200,
      "endTime" : 32400,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "8642c73b-3307-4342-a213-6c54dd8f6442",
      "route" : {
        "id" : "8642c73b-3307-4342-a213-6c54dd8f6442",
        "name" : "addd",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-02T12:23:33.292Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "53553eb4-19c1-47f6-b5c0-4bd07d7ca5e1",
      "name" : "Afternoon video-feed-2",
      "occurrenceDate" : "2023-07-01T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 84600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "c55e1217-7555-4c8f-86a1-9194b9cb2433",
      "route" : {
        "id" : "c55e1217-7555-4c8f-86a1-9194b9cb2433",
        "name" : "video-feed-2",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-25T09:24:43.535Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "7c0eeed0-e69a-44c4-af61-3e05458113a8",
      "name" : "Afternoon live-images-1",
      "occurrenceDate" : "2023-07-01T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 84600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "1ce3fad9-4b9d-410f-a5f5-55703d59c275",
      "route" : {
        "id" : "1ce3fad9-4b9d-410f-a5f5-55703d59c275",
        "name" : "live-images-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-25T09:25:41.606Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "1b1f63a2-6f59-4bbd-8629-cf9f430b7758",
      "name" : "Afternoon image-video",
      "occurrenceDate" : "2023-06-30T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 64800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "e9e251ab-7f97-4b5b-9e0b-bb88cc4afe15",
      "route" : {
        "id" : "e9e251ab-7f97-4b5b-9e0b-bb88cc4afe15",
        "name" : "image-video",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T18:24:09.666Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "1a93945b-c033-4fc6-b69d-3f4cbed57886",
      "name" : "Afternoon pending-task-1",
      "occurrenceDate" : "2023-06-30T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 21600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "7246d4c9-4cd3-42bb-af02-5c6545116ac6",
      "route" : {
        "id" : "7246d4c9-4cd3-42bb-af02-5c6545116ac6",
        "name" : "pending-task-1",
        "siteId" : "1",
        "allowStartTime" : 10800,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T04:43:02.310Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "11a0b605-671d-4c7a-bf98-f8adb2dedd07",
      "name" : "Afternoon live-feed-test-1",
      "occurrenceDate" : "2023-06-30T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 21600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "4b491e52-f67b-4bf1-b649-96d7d1dce69b",
      "route" : {
        "id" : "4b491e52-f67b-4bf1-b649-96d7d1dce69b",
        "name" : "live-feed-test-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T16:15:29.141Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "40bf0799-4a4d-4c2b-842d-93e3d607be7e",
      "name" : "Night video-feed-1",
      "occurrenceDate" : "2023-07-29T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "8cf5d8a6-8a5c-4e5d-8b9a-d1d376fb182e",
      "route" : {
        "id" : "8cf5d8a6-8a5c-4e5d-8b9a-d1d376fb182e",
        "name" : "video-feed-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-24T16:19:58.615Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "6191edb5-2366-4d30-be1e-b64195a5e5f6",
      "name" : "Night addd",
      "occurrenceDate" : "2023-07-29T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "8642c73b-3307-4342-a213-6c54dd8f6442",
      "route" : {
        "id" : "8642c73b-3307-4342-a213-6c54dd8f6442",
        "name" : "addd",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-02T12:23:33.292Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "39e29117-1982-4eb0-b4ef-c52b9436b111",
      "name" : "Night addd",
      "occurrenceDate" : "2023-07-29T16:00:00.000Z",
      "startTime" : 7200,
      "endTime" : 32400,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "8642c73b-3307-4342-a213-6c54dd8f6442",
      "route" : {
        "id" : "8642c73b-3307-4342-a213-6c54dd8f6442",
        "name" : "addd",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-02T12:23:33.292Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "22682c6c-eb6f-41d0-a429-e170147161e3",
      "name" : "Morning 23/8",
      "occurrenceDate" : "2023-08-22T16:00:00.000Z",
      "startTime" : 41400,
      "endTime" : 59400,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "12345678",
      "routeId" : "160713d9-920f-464b-8472-effd457ae752",
      "route" : {
        "id" : "160713d9-920f-464b-8472-effd457ae752",
        "name" : "23/8",
        "siteId" : "6",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "6",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-23T03:59:40.519Z",
        "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "assignedUsers" : [
          {
            "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
            "name" : "Anisha Anil"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "reportCreatedAt" : "2023-08-23T05:25:06.367Z",
      "lastCheckpointId" : "326ada8d-f24c-491e-a7f3-385086cc7e94"
    }
  ]
};

export const TaskListResponseForJul2023Filter = {
  count : 3,
  data : [
    {
      "id" : "46f68204-7b26-4990-9f2b-853524277f50",
      "name" : "Night abc",
      "occurrenceDate" : "2023-07-25T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 84600,
      "status" : "Incomplete",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "0a84fc0f-0e43-4289-870f-16528728e2fe",
      "route" : {
        "id" : "0a84fc0f-0e43-4289-870f-16528728e2fe",
        "name" : "abc",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-28T03:51:10.170Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          },
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-07-26T05:07:07.219Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "0fd5ed0e-38f2-483e-b9bb-6c192f8f980b",
      "name" : "Afternoon bb",
      "occurrenceDate" : "2023-07-13T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 81000,
      "status" : "Incomplete",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "91326d54-4f99-4013-9428-7e4324c6833c",
      "route" : {
        "id" : "91326d54-4f99-4013-9428-7e4324c6833c",
        "name" : "bb",
        "siteId" : "2",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "2",
          "name" : "Building BB"
        },
        "createdAt" : "2023-07-14T06:37:49.938Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : true
      },
      "reportCreatedAt" : "2023-07-14T07:15:29.845Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "27c84b3a-14a2-4d5e-96d9-5f52a334c359",
      "name" : "Afternoon abc-today-hbo",
      "occurrenceDate" : "2023-07-05T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "eee",
      "routeId" : "04d47a2e-8f08-45b5-a125-c84d6e143e6f",
      "route" : {
        "id" : "04d47a2e-8f08-45b5-a125-c84d6e143e6f",
        "name" : "abc-today-hbo",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-06T09:19:53.044Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-07-06T09:19:59.331Z",
      "lastCheckpointId" : "18a8bee4-092a-4b56-8a47-81e962e9a4b3"
    }
  ]
};

export const TaskListResponseForJun2023 = {
  count : 41,
  data : [
    {
      "id" : "c1e45a2f-df91-417b-b2c9-509205691a2d",
      "name" : "Afternoon AA-school-1",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "Previous Route delay l;kdfd",
      "routeId" : "c529304a-254e-4ff9-bc9b-7b0372f4e3a2",
      "route" : {
        "id" : "c529304a-254e-4ff9-bc9b-7b0372f4e3a2",
        "name" : "AA-school-1",
        "siteId" : "1",
        "allowStartTime" : 1800,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:40:21.974Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "037b097b-0b13-49e5-904b-71ece5e3bf85",
      "name" : "Afternoon pending-task-1",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 21600,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "7246d4c9-4cd3-42bb-af02-5c6545116ac6",
      "route" : {
        "id" : "7246d4c9-4cd3-42bb-af02-5c6545116ac6",
        "name" : "pending-task-1",
        "siteId" : "1",
        "allowStartTime" : 10800,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T04:43:02.310Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-29T17:50:57.773Z",
      "lastCheckpointId" : "9655295e-66d8-429e-a459-15ebdcc2cae4"
    },
    {
      "id" : "6325345f-189d-46e2-8f56-97a34daf57ab",
      "name" : "Afternoon AA-school",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 50400,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
      "route" : {
        "id" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
        "name" : "AA-school",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:16:14.917Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-29T18:55:57.416Z",
      "lastCheckpointId" : "8c682084-3e84-47df-8bb5-503fb49e57e8"
    },
    {
      "id" : "04f0282c-3006-4490-a413-0919f9ab402b",
      "name" : "Afternoon abcdddd",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "470d6fcc-6c3e-4187-be05-459449210bb4",
      "route" : {
        "id" : "470d6fcc-6c3e-4187-be05-459449210bb4",
        "name" : "abcdddd",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-29T18:56:42.879Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 30,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-29T18:56:51.941Z",
      "lastCheckpointId" : "fafe7911-1a73-4617-9295-b084382c2061"
    },
    {
      "id" : "19336d39-dae1-49e3-9dfb-4172f0692edb",
      "name" : "Afternoon aa-new",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 10800,
      "endTime" : 68400,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "08d4635c-8cc8-4d0a-abe9-0f3d9eafa5a3",
      "route" : {
        "id" : "08d4635c-8cc8-4d0a-abe9-0f3d9eafa5a3",
        "name" : "aa-new",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-30T03:52:11.736Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 2700,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "e9e15bcc-f012-4116-8ce3-f11b76b61b77",
      "name" : "Morning newpatrol1",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 25200,
      "endTime" : 64800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "1649ed09-38a2-4dec-b9b2-a0257c967ce8",
      "route" : {
        "id" : "1649ed09-38a2-4dec-b9b2-a0257c967ce8",
        "name" : "newpatrol1",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-30T01:06:01.227Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
            "name" : "Officer__Official"
          }
        ],
        "reminderTime" : 2700,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-30T01:06:08.581Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "a283c51a-7043-4537-a730-9ca5ef93414b",
      "name" : "Morning p-singal-video",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 25200,
      "endTime" : 64800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "981fbc09-a144-43f4-994d-b2e390820454",
      "route" : {
        "id" : "981fbc09-a144-43f4-994d-b2e390820454",
        "name" : "p-singal-video",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-30T01:12:46.442Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 2700,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-30T01:12:56.704Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "bc0ac5c5-cbe2-44f7-8607-4ae4886d5b63",
      "name" : "Morning AA-school",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 32400,
      "endTime" : 36000,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
      "route" : {
        "id" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
        "name" : "AA-school",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:16:14.917Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "67310b4e-4beb-4df8-b877-723920e34813",
      "name" : "Morning AA-school",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 32400,
      "endTime" : 33600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
      "route" : {
        "id" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
        "name" : "AA-school",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:16:14.917Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "8d79e6da-3a28-4469-80ff-ec6ebe5d1d6e",
      "name" : "Morning morning-patrol",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 36000,
      "endTime" : 39600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
      "route" : {
        "id" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
        "name" : "morning-patrol",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:53:43.788Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "a8483278-ce66-4342-a298-978b0eac491c",
      "name" : "Afternoon morning-patrol",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 43200,
      "endTime" : 46800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
      "route" : {
        "id" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
        "name" : "morning-patrol",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:53:43.788Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "4ad748dd-0aee-4e81-aa11-95a8da279784",
      "name" : "Afternoon daily-rp-1",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 43200,
      "endTime" : 64800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
      "route" : {
        "id" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
        "name" : "daily-rp-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:28:12.562Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "32d754e1-6e44-484a-8476-7fcb0b3854ba",
      "name" : "Afternoon apple-orange",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 60600,
      "endTime" : 64800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "4484b5fd-7d28-4203-b415-081a4bc07f32",
      "route" : {
        "id" : "4484b5fd-7d28-4203-b415-081a4bc07f32",
        "name" : "apple-orange",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-30T07:52:53.203Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "f9e8ad35-616b-48e2-a293-f2d4b89e67fc",
      "name" : "Night appleeee",
      "occurrenceDate" : "2023-06-29T16:00:00.000Z",
      "startTime" : 75600,
      "endTime" : 79200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "64a55177-ab3d-43d8-ba88-90231db0c189",
      "route" : {
        "id" : "64a55177-ab3d-43d8-ba88-90231db0c189",
        "name" : "appleeee",
        "siteId" : "1",
        "allowStartTime" : 10800,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-30T07:40:42.103Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "4b44aac5-9112-44d1-a833-f6db2960cc97",
      "name" : "Afternoon today rougte",
      "occurrenceDate" : "2023-06-28T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "Previous Route delay : and this is details.",
      "routeId" : "0d948a3e-ebed-43b5-996d-abc6c34ecf84",
      "route" : {
        "id" : "0d948a3e-ebed-43b5-996d-abc6c34ecf84",
        "name" : "today rougte",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-29T07:36:21.728Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 30,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "05dcd2b6-dc18-4dbd-ad9c-1a0529ace0be",
      "name" : "Afternoon today rougte",
      "occurrenceDate" : "2023-06-28T16:00:00.000Z",
      "startTime" : 7200,
      "endTime" : 10800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "0d948a3e-ebed-43b5-996d-abc6c34ecf84",
      "route" : {
        "id" : "0d948a3e-ebed-43b5-996d-abc6c34ecf84",
        "name" : "today rougte",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-29T07:36:21.728Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 30,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "39ea8fa3-2fe9-420a-b20e-771bff66545d",
      "name" : "Afternoon today rougte",
      "occurrenceDate" : "2023-06-28T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 56400,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : "Problems at Site Late / Urgent Leave wow",
      "routeId" : "0d948a3e-ebed-43b5-996d-abc6c34ecf84",
      "route" : {
        "id" : "0d948a3e-ebed-43b5-996d-abc6c34ecf84",
        "name" : "today rougte",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-29T07:36:21.728Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 30,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-29T07:36:33.110Z",
      "lastCheckpointId" : "cb817763-e0f6-44eb-ab3c-6c107e5f61e9"
    },
    {
      "id" : "bba96361-6264-4226-a237-15a06027ace1",
      "name" : "Afternoon today img",
      "occurrenceDate" : "2023-06-27T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 46800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "51594f1f-236b-4d67-abfb-47f554cc23dd",
      "route" : {
        "id" : "51594f1f-236b-4d67-abfb-47f554cc23dd",
        "name" : "today img+",
        "siteId" : "1",
        "allowStartTime" : 900,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-28T09:16:12.718Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 30,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "489319f5-4a8e-4c3a-b45b-86609840cede",
      "name" : "Afternoon abc",
      "occurrenceDate" : "2023-06-27T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 84600,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "0a84fc0f-0e43-4289-870f-16528728e2fe",
      "route" : {
        "id" : "0a84fc0f-0e43-4289-870f-16528728e2fe",
        "name" : "abc",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-28T03:51:10.170Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          },
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-28T06:04:13.643Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "0e60ae44-2e73-4257-b829-b583325a48ce",
      "name" : "Afternoon abble",
      "occurrenceDate" : "2023-06-27T16:00:00.000Z",
      "startTime" : 50400,
      "endTime" : 82800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "fe1a281a-5ee4-4c87-9f87-52492c2ff15d",
      "route" : {
        "id" : "fe1a281a-5ee4-4c87-9f87-52492c2ff15d",
        "name" : "abble",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-28T06:19:04.366Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-28T06:19:13.499Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "9fa823e3-1094-40e3-a8fb-7aa9f2cc862d",
      "name" : "Evening a",
      "occurrenceDate" : "2023-06-27T16:00:00.000Z",
      "startTime" : 72000,
      "endTime" : 72900,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "2c61af14-a2ee-49a5-b16d-b2e32007a97e",
      "route" : {
        "id" : "2c61af14-a2ee-49a5-b16d-b2e32007a97e",
        "name" : "a",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-28T12:10:19.396Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 30,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-28T12:10:26.571Z",
      "lastCheckpointId" : "e48a922d-bd29-422b-bab4-7405613e983f"
    },
    {
      "id" : "ff6c8708-95a9-4345-82b4-076f675dd54c",
      "name" : "Evening today pagt",
      "occurrenceDate" : "2023-06-26T16:00:00.000Z",
      "startTime" : 66600,
      "endTime" : 84600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "16d4c4b4-81b9-497f-8af6-6cedb844caf0",
      "route" : {
        "id" : "16d4c4b4-81b9-497f-8af6-6cedb844caf0",
        "name" : "today pagt",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-27T10:01:56.510Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "bba4210e-b383-4478-b135-c9feab6c48db",
      "name" : "Afternoon video-test-1",
      "occurrenceDate" : "2023-06-25T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : "abc",
      "routeId" : "f9cef5c0-75e3-41bd-9b9e-cdb9456837d9",
      "route" : {
        "id" : "f9cef5c0-75e3-41bd-9b9e-cdb9456837d9",
        "name" : "video-test-1",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-26T05:50:13.348Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-26T05:50:45.112Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "db5f7c6d-614c-4ccd-b1b2-22065d9702e7",
      "name" : "Afternoon video-feed-1",
      "occurrenceDate" : "2023-06-24T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : "internet down...",
      "routeId" : "8cf5d8a6-8a5c-4e5d-8b9a-d1d376fb182e",
      "route" : {
        "id" : "8cf5d8a6-8a5c-4e5d-8b9a-d1d376fb182e",
        "name" : "video-feed-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-24T16:19:58.615Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-24T16:20:04.003Z",
      "lastCheckpointId" : "206443f1-df28-40b0-8c4b-52be7e132f0f"
    },
    {
      "id" : "e1b4a2da-1473-4627-b324-f0c5659720dd",
      "name" : "Afternoon live-images-1",
      "occurrenceDate" : "2023-06-24T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 84600,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "1ce3fad9-4b9d-410f-a5f5-55703d59c275",
      "route" : {
        "id" : "1ce3fad9-4b9d-410f-a5f5-55703d59c275",
        "name" : "live-images-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-25T09:25:41.606Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-25T09:26:25.336Z",
      "lastCheckpointId" : "5c607d1f-0ed8-4ca4-908a-36cac0d80a3e"
    },
    {
      "id" : "95cf5e2c-2ac6-4151-8f3a-d7fb2d21df33",
      "name" : "Afternoon video-feed-2",
      "occurrenceDate" : "2023-06-24T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 84600,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "c55e1217-7555-4c8f-86a1-9194b9cb2433",
      "route" : {
        "id" : "c55e1217-7555-4c8f-86a1-9194b9cb2433",
        "name" : "video-feed-2",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-25T09:24:43.535Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-25T09:44:16.983Z",
      "lastCheckpointId" : "f7951bca-3ead-4b53-b326-5528f102a097"
    },
    {
      "id" : "54a46012-aeea-4d40-8f9d-f2bc1b9b8799",
      "name" : "Afternoon live-feed-test-1",
      "occurrenceDate" : "2023-06-23T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 21600,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "4b491e52-f67b-4bf1-b649-96d7d1dce69b",
      "route" : {
        "id" : "4b491e52-f67b-4bf1-b649-96d7d1dce69b",
        "name" : "live-feed-test-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T16:15:29.141Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-23T16:24:10.357Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "197fa9db-1dad-4968-af4e-3ed21f81344b",
      "name" : "Afternoon image-video",
      "occurrenceDate" : "2023-06-23T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 64800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "e9e251ab-7f97-4b5b-9e0b-bb88cc4afe15",
      "route" : {
        "id" : "e9e251ab-7f97-4b5b-9e0b-bb88cc4afe15",
        "name" : "image-video",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T18:24:09.666Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-23T18:24:18.705Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "9b1ae898-9405-4d55-ad4a-2f155923a3f5",
      "name" : "Afternoon AA-school",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 50400,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "end success 1",
      "routeId" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
      "route" : {
        "id" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
        "name" : "AA-school",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:16:14.917Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-23T01:22:28.670Z",
      "lastCheckpointId" : "f1fdb265-ed23-40eb-89cd-bb7b6e158d6f"
    },
    {
      "id" : "6b7637b2-b24d-4f79-a2d1-6c38cdb4dcc7",
      "name" : "Afternoon AA-school-1",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "late",
      "routeId" : "c529304a-254e-4ff9-bc9b-7b0372f4e3a2",
      "route" : {
        "id" : "c529304a-254e-4ff9-bc9b-7b0372f4e3a2",
        "name" : "AA-school-1",
        "siteId" : "1",
        "allowStartTime" : 1800,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:40:21.974Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "c4ad15f8-a702-4b23-a495-d8f50d7b48e2",
      "name" : "Morning AA-school",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 32400,
      "endTime" : 33600,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : "interned down",
      "routeId" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
      "route" : {
        "id" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
        "name" : "AA-school",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:16:14.917Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-23T01:18:15.480Z",
      "lastCheckpointId" : "5f5a2f3c-555e-41e2-a503-9cc663f598b9"
    },
    {
      "id" : "2326d549-5958-4f9c-813b-024d0c47e63f",
      "name" : "Morning AA-school",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 32400,
      "endTime" : 36000,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "end success",
      "routeId" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
      "route" : {
        "id" : "4d9e2c5a-d6d7-49cc-962e-45d66737c759",
        "name" : "AA-school",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:16:14.917Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-23T01:20:53.435Z",
      "lastCheckpointId" : "f1fdb265-ed23-40eb-89cd-bb7b6e158d6f"
    },
    {
      "id" : "a673103b-5020-4015-b631-71e87cdad638",
      "name" : "Morning morning-patrol",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 36000,
      "endTime" : 39600,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
      "route" : {
        "id" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
        "name" : "morning-patrol",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:53:43.788Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "e44bfe8b-8f5e-4527-bdd8-203e10a2ec2a",
      "name" : "Afternoon morning-patrol",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 43200,
      "endTime" : 46800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
      "route" : {
        "id" : "66862bb7-edfd-4ae0-a3b1-483dfeea044f",
        "name" : "morning-patrol",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T01:53:43.788Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "92ac19ba-c371-4ecb-9f28-b1493774480b",
      "name" : "Afternoon pending-task-1",
      "occurrenceDate" : "2023-06-22T16:00:00.000Z",
      "startTime" : 43200,
      "endTime" : 64800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "7246d4c9-4cd3-42bb-af02-5c6545116ac6",
      "route" : {
        "id" : "7246d4c9-4cd3-42bb-af02-5c6545116ac6",
        "name" : "pending-task-1",
        "siteId" : "1",
        "allowStartTime" : 10800,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-23T04:43:02.310Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-23T04:43:07.986Z",
      "lastCheckpointId" : "9655295e-66d8-429e-a459-15ebdcc2cae4"
    },
    {
      "id" : "b88e8058-8981-48c2-963b-c2086b18e017",
      "name" : "Afternoon daily-rp-2",
      "occurrenceDate" : "2023-06-21T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "late",
      "routeId" : "3921d527-2f95-4247-b8bb-0ca0e401054d",
      "route" : {
        "id" : "3921d527-2f95-4247-b8bb-0ca0e401054d",
        "name" : "daily-rp-2",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:37:35.121Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "b3701de4-a37f-4524-9d25-7e529d1bce99",
      "name" : "Afternoon daily-rp-1",
      "occurrenceDate" : "2023-06-21T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : "late",
      "routeId" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
      "route" : {
        "id" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
        "name" : "daily-rp-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:28:12.562Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "0b13b3df-6159-4298-968f-1e2122a275f1",
      "name" : "Afternoon daily-rp-1",
      "occurrenceDate" : "2023-06-21T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 57600,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "end",
      "routeId" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
      "route" : {
        "id" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
        "name" : "daily-rp-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:28:12.562Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-22T07:28:52.148Z",
      "lastCheckpointId" : "e1adaecb-d957-48ec-b045-d25deddb562f"
    },
    {
      "id" : "480f48ae-beed-4c92-8a19-3341f33f9182",
      "name" : "Afternoon daily-rp-2",
      "occurrenceDate" : "2023-06-21T16:00:00.000Z",
      "startTime" : 54000,
      "endTime" : 57600,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "end patrol",
      "routeId" : "3921d527-2f95-4247-b8bb-0ca0e401054d",
      "route" : {
        "id" : "3921d527-2f95-4247-b8bb-0ca0e401054d",
        "name" : "daily-rp-2",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:37:35.121Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-22T07:38:12.432Z",
      "lastCheckpointId" : "7c7f02eb-28f6-480d-bba2-1d61fbcf4f03"
    },
    {
      "id" : "fa66f3dc-42a7-457e-84dd-645bbc96c5b8",
      "name" : "Afternoon daily-rp-2",
      "occurrenceDate" : "2023-06-21T16:00:00.000Z",
      "startTime" : 55200,
      "endTime" : 56400,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : "bad internet",
      "routeId" : "3921d527-2f95-4247-b8bb-0ca0e401054d",
      "route" : {
        "id" : "3921d527-2f95-4247-b8bb-0ca0e401054d",
        "name" : "daily-rp-2",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:37:35.121Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-22T07:37:51.726Z",
      "lastCheckpointId" : "28f2464f-ebcc-4bd9-bbd2-15d808c39843"
    },
    {
      "id" : "87cb24b5-5d25-4465-8f4c-34216689bd49",
      "name" : "Afternoon daily-rp-1",
      "occurrenceDate" : "2023-06-21T16:00:00.000Z",
      "startTime" : 55500,
      "endTime" : 55800,
      "status" : "InCompleted",
      "startComment" : "",
      "endComment" : "imcompleted",
      "routeId" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
      "route" : {
        "id" : "f3896ffa-61e3-4f15-bbf0-4e9dcdb3ddce",
        "name" : "daily-rp-1",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-22T07:28:12.562Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-06-22T07:28:23.618Z",
      "lastCheckpointId" : "e1adaecb-d957-48ec-b045-d25deddb562f"
    }
  ]
};

export const TodayAssignedPatrols29Aug2023 = {
  count : 3,
  data : [
    {
      "id" : "297493b8-1cb5-4984-91c9-1ecd6bddedb8",
      "name" : "Midnight sun-corner",
      "occurrenceDate" : "2023-08-29T16:00:00.000Z",
      "startTime" : 0,
      "endTime" : 73800,
      "status" : "Paused",
      "startComment" : "",
      "endComment" : null,
      "routeId" : "abd7b414-f70a-4fd4-b49b-bbb131cd6765",
      "route" : {
        "id" : "abd7b414-f70a-4fd4-b49b-bbb131cd6765",
        "name" : "sun-corner",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-29T16:55:13.630Z",
        "createdUserId" : "f5208927-68d3-4614-8b94-2bcac12b60c4",
        "assignedUsers" : [
          {
            "id" : "f5208927-68d3-4614-8b94-2bcac12b60c4",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-08-29T17:00:21.096Z",
      "lastCheckpointId" : null
    },
    {
      "id" : "83c5949f-e4a3-4b31-99c5-6adbc7141a43",
      "name" : "Night moon-corner",
      "occurrenceDate" : "2023-08-29T16:00:00.000Z",
      "startTime" : 1800,
      "endTime" : 82800,
      "status" : "NotStarted",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "6c858858-9995-4a23-b9e4-664be9099c64",
      "route" : {
        "id" : "6c858858-9995-4a23-b9e4-664be9099c64",
        "name" : "moon-corner",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-29T16:53:05.542Z",
        "createdUserId" : "f5208927-68d3-4614-8b94-2bcac12b60c4",
        "assignedUsers" : [
          {
            "id" : "f5208927-68d3-4614-8b94-2bcac12b60c4",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "b252c385-1598-4195-ab9c-82e711adce5a",
      "name" : "Night mars-corner",
      "occurrenceDate" : "2023-08-29T16:00:00.000Z",
      "startTime" : 77400,
      "endTime" : 84600,
      "status" : "NotStarted",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "f155e461-1e9d-4aea-9326-6a6cdeb24ede",
      "route" : {
        "id" : "f155e461-1e9d-4aea-9326-6a6cdeb24ede",
        "name" : "mars-corner",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-29T16:54:22.016Z",
        "createdUserId" : "f5208927-68d3-4614-8b94-2bcac12b60c4",
        "assignedUsers" : [
          {
            "id" : "f5208927-68d3-4614-8b94-2bcac12b60c4",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    }
  ]
};

export const SiteResponse = {
  count : 16,
  data : [
    {
      "id" : "13",
      "name" : "abc",
      "description" : "sfsdf",
      "noCameras" : 501
    },
    {
      "id" : "16",
      "name" : "20 sites",
      "description" : "abc",
      "noCameras" : 14
    },
    {
      "id" : "15",
      "name" : "18-sites",
      "description" : "ddf",
      "noCameras" : 8
    },
    {
      "id" : "14",
      "name" : "19-cams",
      "description" : "dd",
      "noCameras" : 0
    },
    {
      "id" : "12",
      "name" : "new-site-hpn",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "11",
      "name" : "new-site-9999",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "10",
      "name" : "new-site-998",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "9",
      "name" : "site-new",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "8",
      "name" : "site-new",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "7",
      "name" : "new-site",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "6",
      "name" : "Building FF",
      "description" : null,
      "noCameras" : 0
    },
    {
      "id" : "4",
      "name" : "Building DD",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "3",
      "name" : "Building CC",
      "description" : null,
      "noCameras" : 0
    },
    {
      "id" : "1",
      "name" : "Building A",
      "description" : "aa",
      "noCameras" : 1
    },
    {
      "id" : "5",
      "name" : "Building EE",
      "description" : null,
      "noCameras" : 0
    },
    {
      "id" : "2",
      "name" : "Building BB",
      "description" : "a",
      "noCameras" : 0
    }
  ]
};

export const PatrolsListResponse = {
  count : 80,
  data : [
    {
      "id" : "05221b99-d0d0-4973-b793-d7345177bf6f",
      "name" : "hpn-pt1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:10:39.436Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "bac639ff-8d6b-4051-b8ca-1e60500d3b80",
      "name" : "hpn-pt3-resume",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:09:57.252Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "116f4625-1fb6-483c-9a11-a6f1901eec24",
      "name" : "hpn-pt3-start",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:09:03.122Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "f9575d4c-da5d-4cf4-83c6-a07603f40beb",
      "name" : "point1-test1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:00:29.684Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "04f138cf-06ed-47ff-9805-9441d5716491",
      "name" : "point3-test3",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T09:57:45.455Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "9612076f-34e0-4fde-9559-528186cc572e",
      "name" : "points3-test2",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T09:50:13.524Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "497538ba-57d8-41f7-ab85-f04f879de043",
      "name" : "points3-test1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T08:07:24.979Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "fadde6fa-9116-4d07-bdfa-0c205c2fa855",
      "name" : "3points",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T07:21:03.982Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
          "avatar" : null,
          "name" : "mr.hpn"
        },
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "4d54be38-6234-493b-95ff-1d4c5564dd2b",
      "name" : "new-patrol-00",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-06T04:22:23.296Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        },
        {
          "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
          "avatar" : null,
          "name" : "mr.hpn"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "e3bafd93-0d4d-412f-9487-ada0937d22ab",
      "name" : "issue-57",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-04T07:30:02.788Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
          "avatar" : "/uploads/image-1689905253570.jpg",
          "name" : "mr.hpnnnn"
        },
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        },
        {
          "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
          "avatar" : "/uploads/image-1689906063833.jpg",
          "name" : "Client__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    }
  ],
  limit : 10,
  offset : 0
};
export const PatrolsListResponse20 = {
  count : 80,
  data : [
    {
      "id" : "05221b99-d0d0-4973-b793-d7345177bf6f",
      "name" : "hpn-pt1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:10:39.436Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "bac639ff-8d6b-4051-b8ca-1e60500d3b80",
      "name" : "hpn-pt3-resume",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:09:57.252Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "116f4625-1fb6-483c-9a11-a6f1901eec24",
      "name" : "hpn-pt3-start",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:09:03.122Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "f9575d4c-da5d-4cf4-83c6-a07603f40beb",
      "name" : "point1-test1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:00:29.684Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "04f138cf-06ed-47ff-9805-9441d5716491",
      "name" : "point3-test3",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T09:57:45.455Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "9612076f-34e0-4fde-9559-528186cc572e",
      "name" : "points3-test2",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T09:50:13.524Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "497538ba-57d8-41f7-ab85-f04f879de043",
      "name" : "points3-test1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T08:07:24.979Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "fadde6fa-9116-4d07-bdfa-0c205c2fa855",
      "name" : "3points",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T07:21:03.982Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
          "avatar" : null,
          "name" : "mr.hpn"
        },
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "4d54be38-6234-493b-95ff-1d4c5564dd2b",
      "name" : "new-patrol-00",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-06T04:22:23.296Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        },
        {
          "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
          "avatar" : null,
          "name" : "mr.hpn"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "e3bafd93-0d4d-412f-9487-ada0937d22ab",
      "name" : "issue-57",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-04T07:30:02.788Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
          "avatar" : "/uploads/image-1689905253570.jpg",
          "name" : "mr.hpnnnn"
        },
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        },
        {
          "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
          "avatar" : "/uploads/image-1689906063833.jpg",
          "name" : "Client__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "05221b99-d0d0-4973-b793-d7345177bf6f",
      "name" : "hpn-pt1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:10:39.436Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "bac639ff-8d6b-4051-b8ca-1e60500d3b80",
      "name" : "hpn-pt3-resume",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:09:57.252Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "116f4625-1fb6-483c-9a11-a6f1901eec24",
      "name" : "hpn-pt3-start",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:09:03.122Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "f9575d4c-da5d-4cf4-83c6-a07603f40beb",
      "name" : "point1-test1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T10:00:29.684Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "04f138cf-06ed-47ff-9805-9441d5716491",
      "name" : "point3-test3",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T09:57:45.455Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "9612076f-34e0-4fde-9559-528186cc572e",
      "name" : "points3-test2",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T09:50:13.524Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "497538ba-57d8-41f7-ab85-f04f879de043",
      "name" : "points3-test1",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T08:07:24.979Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "fadde6fa-9116-4d07-bdfa-0c205c2fa855",
      "name" : "3points",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-07T07:21:03.982Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
          "avatar" : null,
          "name" : "mr.hpn"
        },
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "4d54be38-6234-493b-95ff-1d4c5564dd2b",
      "name" : "new-patrol-00",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-06T04:22:23.296Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        },
        {
          "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
          "avatar" : null,
          "name" : "mr.hpn"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    },
    {
      "id" : "e3bafd93-0d4d-412f-9487-ada0937d22ab",
      "name" : "issue-57",
      "siteId" : "13",
      "allowStartTime" : 0,
      "patrolMode" : "LiveImage",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-04T07:30:02.788Z",
      "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "createdUserName" : "Admin__Official",
      "createdUserAvatar" : "/uploads/image-1694071187153.jpg",
      "assignedUsers" : [
        {
          "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
          "avatar" : "/uploads/image-1689905253570.jpg",
          "name" : "mr.hpnnnn"
        },
        {
          "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
          "avatar" : "/uploads/image-1694071187153.jpg",
          "name" : "Admin__Official"
        },
        {
          "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
          "avatar" : null,
          "name" : "admin"
        },
        {
          "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
          "avatar" : "/uploads/image-1689906063833.jpg",
          "name" : "Client__Official"
        }
      ],
      "reminderTime" : 1800,
      "deleted" : false
    }
  ],
  limit : 20,
  offset : 0
};

export const PatrolReportResponse = {
  count : 12,
  data : [
    {
      "id" : "00171fe0-57ad-42a9-85e2-fbf170d213c6",
      "name" : "Night abc-tdy",
      "occurrenceDate" : "2023-09-06T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 81000,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "af515f69-ad08-4778-86eb-b4e2d9a7f0e3",
      "route" : {
        "id" : "af515f69-ad08-4778-86eb-b4e2d9a7f0e3",
        "name" : "abc-tdy",
        "siteId" : "1",
        "allowStartTime" : 3600,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-10T04:37:39.834Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "avatar" : "/uploads/image-1689905253570.jpg",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "0184e3d7-9281-426c-9f1a-af2fcc08d331",
      "name" : "Night abcdef",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "b2b11454-9231-436f-bbfb-69c8915908fa",
      "route" : {
        "id" : "b2b11454-9231-436f-bbfb-69c8915908fa",
        "name" : "abcdef",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-08T09:28:40.282Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "avatar" : "/uploads/image-1689905253570.jpg",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "be0c7e1a-89e1-496c-b509-b35c034c71c4",
      "name" : "Night newnew11",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "0b882f79-bbee-49eb-a46a-b27146d4918a",
      "route" : {
        "id" : "0b882f79-bbee-49eb-a46a-b27146d4918a",
        "name" : "newnew11",
        "siteId" : "13",
        "allowStartTime" : 900,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-09-11T08:00:02.126Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
            "avatar" : null,
            "name" : "mr.hpn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "3b253765-ddb1-49d0-93b3-c26c7e29a46e",
      "name" : "Night qcan-delete",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "e2a30109-30af-44c8-a733-40fe6e667f4f",
      "route" : {
        "id" : "e2a30109-30af-44c8-a733-40fe6e667f4f",
        "name" : "qcan-delete",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-09-11T06:59:14.146Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "avatar" : "/uploads/image-1694071187153.jpg",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "545282c8-bf9c-4ff6-b0a3-94506997c288",
      "name" : "Night nnnnsfs",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "25d65c72-a4b3-49fb-9f92-cdc7285cb4a4",
      "route" : {
        "id" : "25d65c72-a4b3-49fb-9f92-cdc7285cb4a4",
        "name" : "nnnnsfs",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-08-08T09:48:11.041Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "avatar" : "/uploads/image-1689905253570.jpg",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "8c53d989-0844-4123-a858-afe6e993c52a",
      "name" : "Night video-test-1",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 82800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "f9cef5c0-75e3-41bd-9b9e-cdb9456837d9",
      "route" : {
        "id" : "f9cef5c0-75e3-41bd-9b9e-cdb9456837d9",
        "name" : "video-test-1",
        "siteId" : "1",
        "allowStartTime" : 7200,
        "patrolMode" : "LiveVideoFeed",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-06-26T05:50:13.348Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "avatar" : "/uploads/image-1689905253570.jpg",
            "name" : "mr.hpnnnn"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "8d16bc3f-95db-47fc-81f2-2752b4e8499b",
      "name" : "Night test-data",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 7200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "93d57f77-aaf3-4f57-9f30-b5d6123369f9",
      "route" : {
        "id" : "93d57f77-aaf3-4f57-9f30-b5d6123369f9",
        "name" : "test-data",
        "siteId" : "1",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "1",
          "name" : "Building A"
        },
        "createdAt" : "2023-07-23T16:20:50.318Z",
        "createdUserId" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
        "assignedUsers" : [
          {
            "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
            "avatar" : "/uploads/image-1689906063833.jpg",
            "name" : "Client__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "bc38673a-4ab0-4f69-8ce5-ce8389596077",
      "name" : "Night issue-57",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 5400,
      "endTime" : 79200,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "e3bafd93-0d4d-412f-9487-ada0937d22ab",
      "route" : {
        "id" : "e3bafd93-0d4d-412f-9487-ada0937d22ab",
        "name" : "issue-57",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-09-04T07:30:02.788Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "avatar" : "/uploads/image-1694071187153.jpg",
            "name" : "Admin__Official"
          },
          {
            "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
            "avatar" : "/uploads/image-1689905253570.jpg",
            "name" : "mr.hpnnnn"
          },
          {
            "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
            "avatar" : "/uploads/image-1689906063833.jpg",
            "name" : "Client__Official"
          },
          {
            "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
            "avatar" : null,
            "name" : "admin"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "874243a2-89fd-4410-aff6-b14095e7ca14",
      "name" : "Morning cmpl",
      "occurrenceDate" : "2023-09-10T16:00:00.000Z",
      "startTime" : 36000,
      "endTime" : 37800,
      "status" : "Missed",
      "startComment" : null,
      "endComment" : null,
      "routeId" : "5fa0efaa-c0bd-4763-92ef-75d1f4b6bc90",
      "route" : {
        "id" : "5fa0efaa-c0bd-4763-92ef-75d1f4b6bc90",
        "name" : "cmpl",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-08-21T02:19:21.523Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "avatar" : "/uploads/image-1694071187153.jpg",
            "name" : "Admin__Official"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "lastCheckpointId" : null
    },
    {
      "id" : "40f9b459-dd6e-41fa-b8ba-a8615822edde",
      "name" : "Night 3points",
      "occurrenceDate" : "2023-09-06T16:00:00.000Z",
      "startTime" : 3600,
      "endTime" : 81000,
      "status" : "Completed",
      "startComment" : "",
      "endComment" : "end with success",
      "routeId" : "fadde6fa-9116-4d07-bdfa-0c205c2fa855",
      "route" : {
        "id" : "fadde6fa-9116-4d07-bdfa-0c205c2fa855",
        "name" : "3points",
        "siteId" : "13",
        "allowStartTime" : 0,
        "patrolMode" : "LiveImage",
        "site" : {
          "id" : "13",
          "name" : "abc"
        },
        "createdAt" : "2023-09-07T07:21:03.982Z",
        "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "assignedUsers" : [
          {
            "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
            "avatar" : "/uploads/image-1694071187153.jpg",
            "name" : "Admin__Official"
          },
          {
            "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
            "avatar" : null,
            "name" : "mr.hpn"
          },
          {
            "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
            "avatar" : null,
            "name" : "admin"
          }
        ],
        "reminderTime" : 1800,
        "deleted" : false
      },
      "reportCreatedAt" : "2023-09-07T07:21:27.914Z",
      "lastCheckpointId" : "a59c9ebf-e4c1-41a1-b827-caa1cc8a4fbb"
    }
  ],
  limit : 10,
  offset : 0
};
export const MissedPatrolReportResponse = {
  "id" : "2e0fe0c5-2c75-4d39-b7d4-efbd0aa46da1",
  "name" : "Midnight 2__rp",
  "occurrenceDate" : "2023-09-18T16:00:00.000Z",
  "startTime" : 0,
  "endTime" : 3600,
  "status" : "Missed",
  "startComment" : null,
  "endComment" : null,
  "routeId" : "b17b1271-b14f-40e4-8bc8-531a27ade29d",
  "route" : {
    "id" : "b17b1271-b14f-40e4-8bc8-531a27ade29d",
    "name" : "2__rp",
    "siteId" : "13",
    "allowStartTime" : 0,
    "patrolMode" : "LiveImage",
    "site" : {
      "id" : "13",
      "name" : "abc"
    },
    "createdAt" : "2023-09-15T08:35:20.040Z",
    "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
    "routeCheckpoints" : [
      {
        "id" : "22d2385a-7518-4a70-972e-3e1fdb4c2f15",
        "setOrder" : 1,
        "layoutRow" : 1,
        "layoutCol" : 1,
        "cameras" : [
          {
            "id" : "f6aa89c1-0296-36d9-f9df-a4c9709db49e",
            "name" : "DI12 - Poole Rd PS L6",
            "address" : null,
            "tags" : null,
            "lat" : null,
            "lng" : null,
            "status" : "Recording",
            "bearing" : null
          }
        ]
      }
    ],
    "assignedUsers" : [
      {
        "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
        "avatar" : null,
        "name" : "admin"
      }
    ],
    "reminderTime" : 1800,
    "deleted" : false
  },
  "lastCheckpointId" : null
};
export const IncompletePatrolReportResponse = {
  "id" : "df2b1b9b-a199-4616-9f81-a4c2d5b39b19",
  "name" : "Midnight issue__61-G4",
  "occurrenceDate" : "2023-09-17T16:00:00.000Z",
  "startTime" : 0,
  "endTime" : 82800,
  "status" : "Incomplete",
  "startComment" : "",
  "endComment" : null,
  "routeId" : "5ed798c1-af5f-4cfd-ae5e-9a9d0761a93c",
  "route" : {
    "id" : "5ed798c1-af5f-4cfd-ae5e-9a9d0761a93c",
    "name" : "issue__61-G4",
    "siteId" : "13",
    "allowStartTime" : 0,
    "patrolMode" : "LiveImage",
    "site" : {
      "id" : "13",
      "name" : "abc"
    },
    "createdAt" : "2023-09-17T16:20:29.549Z",
    "createdUserId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
    "routeCheckpoints" : [
      {
        "id" : "afab890d-b315-455a-9b15-87b08f5657de",
        "setOrder" : 1,
        "layoutRow" : 2,
        "layoutCol" : 2,
        "cameras" : [
          {
            "id" : "c8601862-7e45-7944-53bc-397e9feb9db9",
            "name" : "DI13 - Opera Estate PS L1",
            "address" : null,
            "tags" : null,
            "lat" : null,
            "lng" : null,
            "status" : "Recording",
            "bearing" : null
          },
          {
            "id" : "34f1c3c1-9193-ecf8-80b5-e5a41645063b",
            "name" : "DI14 - Opera Estate PS L2",
            "address" : null,
            "tags" : null,
            "lat" : null,
            "lng" : null,
            "status" : "Recording",
            "bearing" : null
          },
          {
            "id" : "9d261f3b-d695-5a33-ffa1-cb33151bebf8",
            "name" : "DI11- Poole Rd PS L4",
            "address" : null,
            "tags" : null,
            "lat" : null,
            "lng" : null,
            "status" : "Recording",
            "bearing" : null
          },
          {
            "id" : "f6aa89c1-0296-36d9-f9df-a4c9709db49e",
            "name" : "DI12 - Poole Rd PS L6",
            "address" : null,
            "tags" : null,
            "lat" : null,
            "lng" : null,
            "status" : "Recording",
            "bearing" : null
          }
        ]
      }
    ],
    "assignedUsers" : [
      {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official"
      }
    ],
    "reminderTime" : 1800,
    "deleted" : false
  },
  "reportCreatedAt" : "2023-09-17T16:20:37.260Z",
  "lastCheckpointId" : null,
  "reportDataRows" : {}
};
export const CompletePatrolReportResponse = {
  "id" : "f1e4267b-a7ce-4ca9-9b89-545ba992f656",
  "name" : "Morning Testing 28/8",
  "occurrenceDate" : "2023-08-27T16:00:00.000Z",
  "startTime" : 39600,
  "endTime" : 79200,
  "status" : "Completed",
  "startComment" : "",
  "endComment" : "jhekjkjdhjfdfhrrbhfhj",
  "routeId" : "d56545ea-ff0d-410c-b55c-04a2388695e1",
  "route" : {
    "id" : "d56545ea-ff0d-410c-b55c-04a2388695e1",
    "name" : "Testing 28/8 (deleted)",
    "siteId" : "11",
    "allowStartTime" : 1800,
    "patrolMode" : "LiveImage",
    "site" : {
      "id" : "11",
      "name" : "Site A (deleted) (deleted)"
    },
    "createdAt" : "2023-08-28T04:05:58.492Z",
    "createdUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
    "routeCheckpoints" : [],
    "assignedUsers" : [
      {
        "id" : "9b2dbdb1-0999-48a9-b54d-21e921a09e1d",
        "avatar" : null,
        "name" : "Huy Dang"
      },
      {
        "id" : "53b5aeaa-688b-482b-ab73-5065aeba908c",
        "avatar" : "/uploads/image-1693992738019.jpg",
        "name" : "admin"
      },
      {
        "id" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "avatar" : null,
        "name" : "Anisha Anil"
      }
    ],
    "reminderTime" : 900,
    "deleted" : true
  },
  "reportCreatedAt" : "2023-08-28T04:06:20.397Z",
  "lastCheckpointId" : "d4e91e16-7f41-45b8-bde6-436d783df50e",
  "reportDataRows" : {
    "1" : [
      {
        "camera" : {
          "id" : "3471fd82-21fd-a906-56d5-8e9554103d3c",
          "name" : "GroundFloor Back Area 1",
          "snapshotTimeInEpoch" : 1693195655490
        },
        "timeCompleted" : "2023-08-28T04:07:45.481Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false,
        "comment" : "Note 12343"
      },
      {
        "camera" : {
          "id" : "3471fd82-21fd-a906-56d5-8e9554103d3c",
          "name" : "GroundFloor Back Area 1",
          "snapshotTimeInEpoch" : 1693195682631
        },
        "timeCompleted" : "2023-08-28T04:08:20.868Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : true,
        "alert" : {
          "type" : "Intrusion Detected",
          "description" : "Intrusion Detected bhjdghdghgdhgdjhd",
          "actionsTaken" : [
            "Do something",
            "hhdvddgd"
          ]
        }
      },
      {
        "camera" : {
          "id" : "1d387ccc-53ac-bc86-91c7-9999c63774e6",
          "name" : "GroundFloor Perimeter10",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "21bdc375-9d03-dbb9-b639-eac1bc4e51c3",
          "name" : "GroundFloor Perimeter1",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "19c414f6-ea4c-5b93-cb9c-cd3587bf01b3",
          "name" : "GroundFloor Perimeter2",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "00056a6f-ed6b-add1-62ce-8995fd2955a5",
          "name" : "GroundFloor Perimeter12",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "1097dd82-8a27-7088-fb1d-f8277fbae0fb",
          "name" : "GroundFloor Perimeter11",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "2d64ec86-f13b-1ced-f38b-db3139c794bf",
          "name" : "GroundFloor Front Gate",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "3270d20f-e256-52cf-d7f1-091f6993475a",
          "name" : "GroundFloor Loading Bay",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "861497aa-4f15-ae4f-90bd-af2360849fea",
          "name" : "GroundFloor Back Area-2",
          "snapshotTimeInEpoch" : 1693195714758
        },
        "timeCompleted" : "2023-08-28T04:08:35.652Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      }
    ],
    "2" : [
      {
        "camera" : {
          "id" : "274fbfe8-0e93-e87c-bc1a-32cd425bbd0d",
          "name" : "GroundFloor Perimeter5",
          "snapshotTimeInEpoch" : 1693195755783
        },
        "timeCompleted" : "2023-08-28T04:09:39.102Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : true,
        "alert" : {
          "type" : "Littering",
          "description" : "Littering",
          "actionsTaken" : [
            "Arrest them"
          ]
        }
      },
      {
        "camera" : {
          "id" : "1d387ccc-53ac-bc86-91c7-9999c63774e6",
          "name" : "GroundFloor Perimeter10",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "21bdc375-9d03-dbb9-b639-eac1bc4e51c3",
          "name" : "GroundFloor Perimeter1",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "c5afbd55-47d5-2563-be97-b664f92017ad",
          "name" : "GroundFloor Perimeter3",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "19c414f6-ea4c-5b93-cb9c-cd3587bf01b3",
          "name" : "GroundFloor Perimeter2",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "00056a6f-ed6b-add1-62ce-8995fd2955a5",
          "name" : "GroundFloor Perimeter12",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "1097dd82-8a27-7088-fb1d-f8277fbae0fb",
          "name" : "GroundFloor Perimeter11",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "6ac41060-e7b7-abf5-9b2b-ebbabbe7ccff",
          "name" : "GroundFloor Perimeter4",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "e05e79be-0e74-ae7f-375a-52c680058a34",
          "name" : "GroundFloor Perimeter7",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "39fc2dc7-7776-0f0a-b6d0-41fbc6d07197",
          "name" : "GroundFloor Perimeter6",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "2d64ec86-f13b-1ced-f38b-db3139c794bf",
          "name" : "GroundFloor Front Gate",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "3270d20f-e256-52cf-d7f1-091f6993475a",
          "name" : "GroundFloor Loading Bay",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "3471fd82-21fd-a906-56d5-8e9554103d3c",
          "name" : "GroundFloor Back Area 1",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      },
      {
        "camera" : {
          "id" : "861497aa-4f15-ae4f-90bd-af2360849fea",
          "name" : "GroundFloor Back Area-2",
          "snapshotTimeInEpoch" : 1693195783508
        },
        "timeCompleted" : "2023-08-28T04:09:44.444Z",
        "completedUserId" : "f614f0f9-f824-4009-8558-33c0a0a6187c",
        "completedUserName" : "Anisha Anil",
        "faultDetected" : false
      }
    ]
  }
};

export const DailyReportResponse = {
  count : 49,
  data : [
    {
      "id" : "0b9f9034-8fb4-4581-85a0-748a2f02c2f7",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-18T15:59:00.469Z"
    },
    {
      "id" : "c9494350-f777-4af6-bf61-3e10129ac13f",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-17T15:59:00.561Z"
    },
    {
      "id" : "be8e3b3a-a327-47ca-9f68-f95c05a9c73a",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-16T15:59:00.883Z"
    },
    {
      "id" : "db5da636-12d8-46bf-bb05-8c2374ff2bd4",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-15T15:59:00.102Z"
    },
    {
      "id" : "d0857ae0-86be-4d57-8cde-baf4ec27f810",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-13T15:59:00.239Z"
    },
    {
      "id" : "00dcd91d-3a04-48dd-a1ac-a7987d2f9319",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-12T15:59:00.099Z"
    },
    {
      "id" : "74c006e2-1ce8-4983-990a-067a8ab9703b",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-11T15:59:00.138Z"
    },
    {
      "id" : "bdb342a2-72e0-4c57-aef6-ab7cb61e02bf",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-11T15:59:00.138Z"
    },
    {
      "id" : "99b0fddb-0b92-49ec-ba1e-cab42d40c341",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-03T15:59:00.401Z"
    },
    {
      "id" : "a60dbbf7-69ad-4427-9bc2-d7bd08b3ad05",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-01T15:59:00.528Z"
    }
  ]
};
export const DailyReportResponse20 = {
  count : 49,
  data : [
    {
      "id" : "0b9f9034-8fb4-4581-85a0-748a2f02c2f7",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-18T15:59:00.469Z"
    },
    {
      "id" : "c9494350-f777-4af6-bf61-3e10129ac13f",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-17T15:59:00.561Z"
    },
    {
      "id" : "be8e3b3a-a327-47ca-9f68-f95c05a9c73a",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-16T15:59:00.883Z"
    },
    {
      "id" : "db5da636-12d8-46bf-bb05-8c2374ff2bd4",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-15T15:59:00.102Z"
    },
    {
      "id" : "d0857ae0-86be-4d57-8cde-baf4ec27f810",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-13T15:59:00.239Z"
    },
    {
      "id" : "00dcd91d-3a04-48dd-a1ac-a7987d2f9319",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-12T15:59:00.099Z"
    },
    {
      "id" : "74c006e2-1ce8-4983-990a-067a8ab9703b",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-11T15:59:00.138Z"
    },
    {
      "id" : "bdb342a2-72e0-4c57-aef6-ab7cb61e02bf",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-11T15:59:00.138Z"
    },
    {
      "id" : "99b0fddb-0b92-49ec-ba1e-cab42d40c341",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-03T15:59:00.401Z"
    },
    {
      "id" : "a60dbbf7-69ad-4427-9bc2-d7bd08b3ad05",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-01T15:59:00.528Z"
    },
    {
      "id" : "0b9f9034-8fb4-4581-85a0-748a2f02c2f7",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-18T15:59:00.469Z"
    },
    {
      "id" : "c9494350-f777-4af6-bf61-3e10129ac13f",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-17T15:59:00.561Z"
    },
    {
      "id" : "be8e3b3a-a327-47ca-9f68-f95c05a9c73a",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-16T15:59:00.883Z"
    },
    {
      "id" : "db5da636-12d8-46bf-bb05-8c2374ff2bd4",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-15T15:59:00.102Z"
    },
    {
      "id" : "d0857ae0-86be-4d57-8cde-baf4ec27f810",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-13T15:59:00.239Z"
    },
    {
      "id" : "00dcd91d-3a04-48dd-a1ac-a7987d2f9319",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-12T15:59:00.099Z"
    },
    {
      "id" : "74c006e2-1ce8-4983-990a-067a8ab9703b",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-09-11T15:59:00.138Z"
    },
    {
      "id" : "bdb342a2-72e0-4c57-aef6-ab7cb61e02bf",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-11T15:59:00.138Z"
    },
    {
      "id" : "99b0fddb-0b92-49ec-ba1e-cab42d40c341",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-03T15:59:00.401Z"
    },
    {
      "id" : "a60dbbf7-69ad-4427-9bc2-d7bd08b3ad05",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-09-01T15:59:00.528Z"
    }
  ]
};
export const DailyReportDetailsResponse = {
  "id" : "bdb342a2-72e0-4c57-aef6-ab7cb61e02bf",
  "site" : {
    "id" : "1",
    "name" : "Building A"
  },
  "createdAt" : "2023-09-11T15:59:00.138Z",
  "taskReportData" : [
    {
      "id" : "0184e3d7-9281-426c-9f1a-af2fcc08d331",
      "name" : "Night abcdef",
      "status" : "Missed",
      "endComment" : null,
      "reportDataRows" : {}
    },
    {
      "id" : "545282c8-bf9c-4ff6-b0a3-94506997c288",
      "name" : "Night nnnnsfs",
      "status" : "Missed",
      "endComment" : null,
      "reportDataRows" : {}
    },
    {
      "id" : "8c53d989-0844-4123-a858-afe6e993c52a",
      "name" : "Night video-test-1",
      "status" : "Missed",
      "endComment" : null,
      "reportDataRows" : {}
    },
    {
      "id" : "8d16bc3f-95db-47fc-81f2-2752b4e8499b",
      "name" : "Night test-data",
      "status" : "Missed",
      "endComment" : null,
      "reportDataRows" : {}
    },
    {
      "id" : "00171fe0-57ad-42a9-85e2-fbf170d213c6",
      "name" : "Night abc-tdy",
      "status" : "Missed",
      "endComment" : null,
      "reportDataRows" : {}
    }
  ]
};

export const MonthlyReportResponse = {
  count : 5,
  data : [
    {
      "id" : "9a7e73d6-a522-46c9-b199-18ff6eb4f6f2",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-08-31T15:59:59.999Z"
    },
    {
      "id" : "88aaff17-f766-48c3-b471-05aa69a7e59a",
      "site" : {
        "id" : "13",
        "name" : "abc"
      },
      "createdAt" : "2023-08-31T15:59:59.999Z"
    },
    {
      "id" : "eadfe684-666c-418f-9b4c-1dda5c604387",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-07-12T10:03:43.820Z"
    },
    {
      "id" : "962b60c1-1a07-4431-8d1f-71ad7628ffc8",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-06-30T15:59:59.999Z"
    },
    {
      "id" : "0709ae44-d9df-4b0d-baee-7addee83720c",
      "site" : {
        "id" : "1",
        "name" : "Building A"
      },
      "createdAt" : "2023-05-30T10:08:59.520Z"
    }
  ]
};
export const MonthlyReportDetailsResponse = {
  "id" : "88aaff17-f766-48c3-b471-05aa69a7e59a",
  "site" : {
    "id" : "13",
    "name" : "abc"
  },
  "createdAt" : "2023-08-31T15:59:59.999Z",
  "taskCounts" : {
    "Pending" : 0,
    "OnGoing" : 0,
    "NotStarted" : 0,
    "Paused" : 0,
    "Completed" : 2,
    "Incomplete" : 8,
    "Missed" : 7
  },
  "taskStatusRecords" : {
    "Morning dome-friday" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "Morning cmpl" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0
    ],
    "Night new-hbc-3x3" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "Night new-hbc" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "Night action-taken-like-list" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "Night my-tasks-asigned" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      0,
      0,
      0,
      0,
      0,
      0,
      2
    ],
    "Night abc-def" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "Night office-corner" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      0,
      0
    ],
    "Night parking-gate" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0
    ],
    "Afternoon cantee-corner" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0,
      0
    ],
    "Night moon-corner" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      0
    ],
    "Night mars-corner" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      2,
      0
    ],
    "Midnight sun-corner" : [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      3,
      3
    ]
  }
};

// ----- START - SETTINGS ----- //
// Users
export const UsersListResponse = {
  count : 11,
  data : [
    {
      "id" : "7fc40fc4-f901-4a96-b56b-ce0af94c2f9d",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "newuser5",
      "email" : "new-user5@gmail.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : ""
    },
    {
      "id" : "dbfb7852-e2b9-46b1-b58e-62dd6ef09387",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "newuser4",
      "email" : "new-user4@gmail.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : ""
    },
    {
      "id" : "5d0487a4-a543-41ed-86d1-3958362c4ceb",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "newuser3",
      "email" : "new-user3@gmail.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : ""
    },
    {
      "id" : "a05765c4-576a-445e-85e8-ff3938124a21",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "newuser2",
      "email" : "new-user2@gmail.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : ""
    },
    {
      "id" : "7b49cc92-4e1e-490c-823d-530c78a5dca9",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "newuser1",
      "email" : "new-user1@gmail.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : ""
    },
    {
      "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "huydang",
      "email" : "admin@vps.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : "2023-07-28T02:10:50.956Z",
      "latestChangePassword" : "2023-07-28T02:10:36.798Z"
    },
    {
      "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
      "nxWitnessId" : "",
      "avatar" : "",
      "name" : "admin",
      "email" : "admin@vps.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : "2023-09-14T05:44:53.622Z"
    },
    {
      "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "nxWitnessId" : "",
      "avatar" : "/uploads/image-1694071187153.jpg",
      "name" : "Admin__Official",
      "email" : "admin@vps.com",
      "callingCode" : "-",
      "phoneNumber" : "-",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "active",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : "2023-10-01T07:14:10.190Z",
      "latestChangePassword" : "2023-07-28T01:27:51.819Z"
    },
    {
      "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
      "nxWitnessId" : "",
      "avatar" : "/uploads/image-1689906063833.jpg",
      "name" : "Client__Official",
      "email" : "client@gmail.com",
      "callingCode" : "",
      "phoneNumber" : "",
      "roleId" : "3579be74-c7d9-4a95-a962-2bd11f99add1",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Client",
      "latestLogin" : "2023-09-10T11:09:52.827Z"
    },
    {
      "id" : "2b130f73-5703-4f09-bf49-4aec61ea8fa2",
      "nxWitnessId" : "",
      "avatar" : "/uploads/image-1689905253570.jpg",
      "name" : "huydang",
      "email" : "admin@vps.com",
      "callingCode" : "+95",
      "phoneNumber" : "999999123",
      "roleId" : "bd154aef-025c-4c3e-86a1-65e6ed2fdfe8",
      "status" : "inactive",
      "isVerified" : true,
      "blockingReason" : "",
      "role" : "Admin",
      "latestLogin" : "2023-07-25T07:33:32.021Z"
    }
  ],
  limit : 10,
  offset : 0
};
export const RecentLogins = {
  count : 1108,
  data : [
    {
      "id" : "2551117c-b776-4f75-ab6b-c8624975ddf5",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-09T02:32:11.216Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "d7336269-856f-4f66-9f11-be6bab5563db",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-08T14:11:50.316Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "616f2a7a-f4f2-468b-aea1-a315d3ed00ca",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:47.918Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "95d55f0b-3b64-429d-9bf3-0feda4da2b5f",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:45.626Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "52227b1d-b6a2-4b31-aa1b-8392f7190408",
      "type" : "UserLogin",
      "userId" : "71af680c-da32-4175-a475-8738b2f32f4e",
      "description" : "Officer__Official logged in",
      "createdAt" : "2023-10-06T08:25:42.040Z",
      "user" : {
        "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
        "avatar" : "/uploads/image-1689580000483.jpg",
        "name" : "Officer__Official",
        "email" : "officer@gmail.com",
        "status" : "inactive",
        "role" : "Officer",
        "latestLogin" : "2023-10-06T08:25:42.006Z"
      }
    },
    {
      "id" : "a8115491-4dd6-4b84-bd13-0db49a36a8c9",
      "type" : "UserLogin",
      "userId" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
      "description" : "Client__Official logged in",
      "createdAt" : "2023-10-06T08:25:37.748Z",
      "user" : {
        "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
        "avatar" : "/uploads/image-1689906063833.jpg",
        "name" : "Client__Official",
        "email" : "client@gmail.com",
        "status" : "inactive",
        "role" : "Client",
        "latestLogin" : "2023-10-06T08:25:37.724Z"
      }
    },
    {
      "id" : "53d0b75f-4b89-4671-853f-7907a248b886",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:34.175Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "7bee96ff-2b7c-426f-af56-38e18af29396",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:30.660Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "8bb6a440-618d-4c8e-8d47-9a9e7e626024",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:27.286Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "08746fe6-0ffa-4f29-9ca7-519243ebf934",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:23.742Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "ba466507-927a-4501-ad38-061fa8423971",
      "type" : "UserLogin",
      "userId" : "71af680c-da32-4175-a475-8738b2f32f4e",
      "description" : "Officer__Official logged in",
      "createdAt" : "2023-10-06T08:25:20.384Z",
      "user" : {
        "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
        "avatar" : "/uploads/image-1689580000483.jpg",
        "name" : "Officer__Official",
        "email" : "officer@gmail.com",
        "status" : "inactive",
        "role" : "Officer",
        "latestLogin" : "2023-10-06T08:25:42.006Z"
      }
    },
    {
      "id" : "53d56463-57d4-4797-aa03-90dbf570e7ed",
      "type" : "UserLogin",
      "userId" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
      "description" : "Client__Official logged in",
      "createdAt" : "2023-10-06T08:25:16.959Z",
      "user" : {
        "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
        "avatar" : "/uploads/image-1689906063833.jpg",
        "name" : "Client__Official",
        "email" : "client@gmail.com",
        "status" : "inactive",
        "role" : "Client",
        "latestLogin" : "2023-10-06T08:25:37.724Z"
      }
    },
    {
      "id" : "494e35f8-557c-4213-ba9c-b429006fc4d5",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:25:13.273Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "5b0eed12-953b-4805-8127-eebc205bfcdf",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T08:17:28.570Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "d9f054c1-e54d-40f5-8d1c-65733873efa3",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-06T06:54:40.297Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "bbb5a760-df2d-40ed-bd87-79983eb9828a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-05T10:04:07.085Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "388fe93b-31dd-4be9-88a6-b2545bb681e6",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-04T07:16:46.735Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "354dbeec-97e3-4f6c-92fc-a8f962b18800",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T09:07:18.584Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "fbfbbc9b-085d-4152-8f2a-773477d22e6a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T08:58:58.443Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "02629688-4755-4693-9d83-1dea3aec3ca7",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T08:55:50.728Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "1600095f-12f2-495c-866c-41ac4d615ba9",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T08:51:35.986Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "5adee1f2-06f7-4180-b421-d0eeab9a8d56",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T08:06:06.881Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "749ac0d6-240a-4958-9738-355c2a59d1ab",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T07:18:16.860Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "9e0ebe19-c3b0-4219-bb28-42be4eb68777",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-03T06:49:50.732Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "0150b2f5-1714-4ef8-bd1a-c1e2dccf5e5e",
      "type" : "UserLogin",
      "userId" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
      "description" : "admin logged in",
      "createdAt" : "2023-10-03T03:09:38.948Z",
      "user" : {
        "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
        "avatar" : null,
        "name" : "admin",
        "email" : "admin@vps.com",
        "status" : "inactive",
        "role" : "Admin",
        "latestLogin" : "2023-10-03T03:09:38.893Z"
      }
    },
    {
      "id" : "04d786de-3678-4ed3-9f98-84f3ba304232",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T14:59:39.093Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "cf8d2486-de5b-43aa-a4a9-43dc20f47d43",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T14:56:47.795Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "00d772d0-62ca-4851-b28c-e24a4432870e",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T14:40:23.444Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "e6228fed-22ea-46e4-bac7-156538c36454",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T13:49:16.236Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "a65e9752-d39c-44af-b41e-4db5d3ecfc1e",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T07:22:45.143Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "0c1126e8-562b-42a3-958f-16d4a49f2160",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T07:14:55.718Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "70ea74d2-f159-4668-9a47-5232aa60650b",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-02T07:13:41.801Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "82b0934b-2a44-4717-9c00-1904b57126cb",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T18:10:40.456Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "dfe32985-a729-4e73-ae0d-e509f99fd878",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T16:02:06.450Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "e89de21a-e3e2-4d78-ab2f-12c1c2f6ef42",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T15:58:34.213Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "7e00723b-9b15-490a-8c1b-4b44f81682bb",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T15:56:33.615Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "b0a14afd-8061-46b2-aa56-4d17fe489426",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T15:51:06.556Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "b5aa2c39-7fde-475d-86a6-1d5eb43d7dc1",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T14:41:37.614Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "c4c9c37f-e144-468e-a65c-881abf0e8ccb",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T14:39:31.944Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "bbadb805-f4c7-4042-bc3a-b0957234fc21",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T12:01:53.942Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "155d2051-064f-4320-b05d-cd8932ff7533",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T12:00:34.882Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "f4f11961-0205-4cf3-9850-f437bd336be1",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T11:58:12.503Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "91e68688-8aa3-4f0b-a46a-bd6249e658c1",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T10:50:09.058Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "4164ed0d-43eb-43d4-884e-819d5388d09a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T10:06:42.873Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "698d7db5-6cec-422c-9ff0-3e35078b7b8d",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T08:45:04.541Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "6de40c4d-6e1e-4137-b6d3-8019cacd8f28",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T08:41:30.914Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "cd336b54-9c96-4cc6-9971-3b0d8f96970f",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T07:45:02.161Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "4611a567-f51e-4af2-8c5b-b6ed0092c687",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-10-01T07:14:10.254Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "40074e51-98a2-482f-b18a-0a5d474abca3",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-30T06:11:07.013Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "a68a5136-0e93-4c30-8137-47bc7c782aa1",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T17:47:40.501Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "9b16c48e-b8e1-486c-85b0-5bd4694be675",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T17:40:13.263Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "fb5fc3ec-bf1f-430b-bf88-4b514781228b",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T17:34:00.796Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "86aa1181-e69a-47fe-9b37-97c4ffc97ea2",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T17:06:49.413Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "84a9cb90-23b6-40e0-a6b0-8bdc646934e4",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T15:36:35.183Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "a51b54c4-caba-4f10-8daa-8a006ce76e47",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T08:00:16.214Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "b9cbe280-5685-4482-a60b-d43f65a2721d",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T07:29:27.479Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "9c2b4a69-c909-4817-aacd-6ebb46701621",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T06:44:51.600Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "328b5cac-1749-4af3-9a10-44f84d1c6432",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T04:54:44.948Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "1f40389a-d445-4636-be31-137779d6ee33",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-28T04:35:37.691Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "c834dfca-b658-4995-9a48-451cfcc47fdb",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-27T18:39:10.707Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "5ce51a32-f41c-48b4-bc02-b8d105af584a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-27T15:49:32.800Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "60d853fe-bec3-4f68-ba71-6dfec0e8e52a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-27T15:34:49.134Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "8aea4d9e-bac5-4645-a35e-4a5e25b868c1",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-27T07:27:00.432Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "df2111c3-ec18-47d5-94df-d303d34fc06a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-27T04:44:40.981Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "d0b8919f-08fc-487c-a110-304365630cf4",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T14:46:30.600Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "2cce0b81-f431-4f67-a464-d78f06356b2a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T14:43:41.082Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "2508abe0-b47e-4fa6-886b-88e1e0ae0294",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T14:35:08.981Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "6e74fccc-dc52-41d3-9d4f-2301ee0097b6",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T14:00:40.714Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "d09da723-2cbd-4e2d-9ec5-e17498014175",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T09:18:31.294Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "9f52f39f-9073-4a17-b019-c2e095d2e906",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T07:58:57.842Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "36e949c5-3d28-4b8a-91f0-b1c792442130",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-26T07:16:08.712Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "5a57e178-9589-415b-935b-66c2dae2e96d",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-17T13:58:10.179Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "0d6b5891-073d-40cb-aa36-5aa51de3d34a",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-15T02:44:29.617Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "7e76090d-ec4f-4d25-b753-698fd104b741",
      "type" : "UserLogin",
      "userId" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
      "description" : "admin logged in",
      "createdAt" : "2023-09-14T05:44:53.697Z",
      "user" : {
        "id" : "a0afd92f-b1b8-4c01-b9d4-dcacb811575b",
        "avatar" : null,
        "name" : "admin",
        "email" : "admin@vps.com",
        "status" : "inactive",
        "role" : "Admin",
        "latestLogin" : "2023-10-03T03:09:38.893Z"
      }
    },
    {
      "id" : "205d187b-a76d-4285-a603-e4627850be96",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-14T02:45:07.340Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "30b4d123-f495-4c6f-889e-613458d0b2f6",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-12T15:46:13.182Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "0a5bcd39-4fc3-4c15-8914-598aba22c230",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-12T02:26:18.525Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "15f9d250-deed-4b95-969f-3a2a2d64b0e6",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-12T02:17:10.173Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "cc62ac51-755c-4d95-8dd4-f0d2e3f541e2",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T19:38:12.415Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "36e95aae-905a-486f-91de-bcfbf39f9bd9",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T18:26:08.436Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "bc167c30-2f98-4133-b6af-81b9a4352444",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T16:22:19.154Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "f852d1a3-2b05-49dd-893d-831d26a1b29d",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T16:03:49.660Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "b59dfd5e-432b-4d17-8f53-5aa133112c84",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T11:12:00.626Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "1b1dfdf9-fa0a-4cd0-a632-1676b4b7bdfe",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T04:52:48.916Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "44c68eae-d3b6-4a7b-a5ed-a656c2f2f26c",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T04:52:39.016Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "7f1ba638-7296-41e7-b6ec-ad2a1d95473d",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-11T04:20:41.074Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "54adda12-5ce4-497d-b619-6a636c0035c5",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T17:05:11.956Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "8ab707f8-a5e2-4648-8af1-5130c8f95eda",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T12:13:39.473Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "72120f2b-6253-4ca0-82b9-8efe4960bb65",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T11:34:36.947Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "a265d9a3-4a3a-4c97-a007-b465daadec2d",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T11:11:10.073Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "f3203b3e-230a-46e4-84b5-ca49b630b8df",
      "type" : "UserLogin",
      "userId" : "71af680c-da32-4175-a475-8738b2f32f4e",
      "description" : "Officer__Official logged in",
      "createdAt" : "2023-09-10T11:09:56.590Z",
      "user" : {
        "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
        "avatar" : "/uploads/image-1689580000483.jpg",
        "name" : "Officer__Official",
        "email" : "officer@gmail.com",
        "status" : "inactive",
        "role" : "Officer",
        "latestLogin" : "2023-10-06T08:25:42.006Z"
      }
    },
    {
      "id" : "36180c58-4c5d-4ab7-a951-faec627b8c65",
      "type" : "UserLogin",
      "userId" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
      "description" : "Client__Official logged in",
      "createdAt" : "2023-09-10T11:09:52.848Z",
      "user" : {
        "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
        "avatar" : "/uploads/image-1689906063833.jpg",
        "name" : "Client__Official",
        "email" : "client@gmail.com",
        "status" : "inactive",
        "role" : "Client",
        "latestLogin" : "2023-10-06T08:25:37.724Z"
      }
    },
    {
      "id" : "296d39bc-2859-4f81-bf8f-ef67c5ed40ec",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T11:09:48.454Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "0819ec22-47d0-4b8e-832b-0b977be6e3ac",
      "type" : "UserLogin",
      "userId" : "71af680c-da32-4175-a475-8738b2f32f4e",
      "description" : "Officer__Official logged in",
      "createdAt" : "2023-09-10T11:09:30.553Z",
      "user" : {
        "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
        "avatar" : "/uploads/image-1689580000483.jpg",
        "name" : "Officer__Official",
        "email" : "officer@gmail.com",
        "status" : "inactive",
        "role" : "Officer",
        "latestLogin" : "2023-10-06T08:25:42.006Z"
      }
    },
    {
      "id" : "7e47bb27-db76-4ebb-9457-e14bd68db3e5",
      "type" : "UserLogin",
      "userId" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
      "description" : "Client__Official logged in",
      "createdAt" : "2023-09-10T11:09:26.921Z",
      "user" : {
        "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
        "avatar" : "/uploads/image-1689906063833.jpg",
        "name" : "Client__Official",
        "email" : "client@gmail.com",
        "status" : "inactive",
        "role" : "Client",
        "latestLogin" : "2023-10-06T08:25:37.724Z"
      }
    },
    {
      "id" : "bebb7505-775d-4c17-bd6d-e5995e1e9ed0",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T11:09:21.842Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "d63bfc9b-719c-4adc-bbf9-acfe75bdb903",
      "type" : "UserLogin",
      "userId" : "71af680c-da32-4175-a475-8738b2f32f4e",
      "description" : "Officer__Official logged in",
      "createdAt" : "2023-09-10T11:08:58.125Z",
      "user" : {
        "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
        "avatar" : "/uploads/image-1689580000483.jpg",
        "name" : "Officer__Official",
        "email" : "officer@gmail.com",
        "status" : "inactive",
        "role" : "Officer",
        "latestLogin" : "2023-10-06T08:25:42.006Z"
      }
    },
    {
      "id" : "331c848d-12c7-4e03-a2f3-e37e9a0bd9b6",
      "type" : "UserLogin",
      "userId" : "71af680c-da32-4175-a475-8738b2f32f4e",
      "description" : "Officer__Official logged in",
      "createdAt" : "2023-09-10T11:07:52.479Z",
      "user" : {
        "id" : "71af680c-da32-4175-a475-8738b2f32f4e",
        "avatar" : "/uploads/image-1689580000483.jpg",
        "name" : "Officer__Official",
        "email" : "officer@gmail.com",
        "status" : "inactive",
        "role" : "Officer",
        "latestLogin" : "2023-10-06T08:25:42.006Z"
      }
    },
    {
      "id" : "d4725e1e-19a6-4641-bffb-029808f39efa",
      "type" : "UserLogin",
      "userId" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
      "description" : "Client__Official logged in",
      "createdAt" : "2023-09-10T11:07:47.494Z",
      "user" : {
        "id" : "124d3512-9e02-4ea0-896d-d936e9c4e9d2",
        "avatar" : "/uploads/image-1689906063833.jpg",
        "name" : "Client__Official",
        "email" : "client@gmail.com",
        "status" : "inactive",
        "role" : "Client",
        "latestLogin" : "2023-10-06T08:25:37.724Z"
      }
    },
    {
      "id" : "c880902f-88ce-44b4-9c24-6987f138d642",
      "type" : "UserLogin",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official logged in",
      "createdAt" : "2023-09-10T11:07:40.078Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    }
  ],
  limit : 100,
  offset : 0
};
export const AllUsersActivities = {
  count : 100,
  data : [
    {
      "id" : "1d087c85-b45e-48d4-913c-11ca0b83f5b2",
      "type" : "StartPatrolTask",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official started patrolling Night 1__s/e",
      "createdAt" : "2023-10-08T14:11:57.296Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "dd1a10cc-a0ac-453b-a4eb-662759d57095",
      "type" : "DownloadMonthlyReport",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official downloaded monthly report vps-monthly-report-Invalid date",
      "createdAt" : "2023-10-06T06:56:57.800Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "f4909456-8dae-4648-98ba-fcd39f7805f8",
      "type" : "DownloadDailyReport",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official downloaded daily report vps-daily-report-Invalid date",
      "createdAt" : "2023-10-06T06:56:20.259Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "2282f6cd-131a-4395-a737-513cc0530935",
      "type" : "DownloadTaskReport",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official downloaded patrol report summary vps-task-report-19-09-2023",
      "createdAt" : "2023-10-06T06:55:41.080Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "ee53433d-34ea-493e-993c-2fb02bcb7ffe",
      "type" : "CreateRoute",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official created patrol route new one created",
      "createdAt" : "2023-10-06T06:43:56.190Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "cbfe6de5-51c3-4ec9-bfb5-47c08a770187",
      "type" : "StartPatrolTask",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official started patrolling Night issue__61-G4",
      "createdAt" : "2023-10-06T04:17:41.502Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "f2a3b7c3-6bb2-497b-ac96-977a58f1ffb3",
      "type" : "UpdateRoute",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official updated patrol route issue__61-G4",
      "createdAt" : "2023-10-06T04:17:31.740Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "71c89c8a-bf6f-43d1-a431-1676907a5e92",
      "type" : "StartPatrolTask",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official started patrolling Night candy",
      "createdAt" : "2023-10-06T04:02:02.346Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "95c83e9b-feac-4103-8bfe-fff2d35e47a9",
      "type" : "UpdateRoute",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official updated patrol route candy",
      "createdAt" : "2023-10-06T04:01:56.685Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    },
    {
      "id" : "ceeac87e-f19a-4b07-aebd-72cd25dfa778",
      "type" : "StartPatrolTask",
      "userId" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
      "description" : "Admin__Official started patrolling Night candy",
      "createdAt" : "2023-10-06T03:45:06.449Z",
      "user" : {
        "id" : "4601f050-11aa-4cc8-a8cc-9a9debfe0fac",
        "avatar" : "/uploads/image-1694071187153.jpg",
        "name" : "Admin__Official",
        "email" : "admin@vps.com",
        "status" : "active",
        "role" : "Admin",
        "latestLogin" : "2023-10-09T02:32:11.063Z"
      }
    }
  ],
  limit : 10,
  offset : 0
};
export const SingleUserActivities = {
  count : 4,
  data : [
    {
      "id" : "f3dd0d19-8014-45e3-9298-1b42f4905a4b",
      "type" : "UpdateSite",
      "userId" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
      "description" : "mr.hpn updated site Building BB",
      "createdAt" : "2023-08-28T02:13:46.846Z",
      "user" : {
        "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
        "avatar" : null,
        "name" : "huydang",
        "email" : "admin@vps.com",
        "status" : "inactive",
        "role" : "Admin",
        "latestLogin" : "2023-07-28T02:10:50.956Z"
      }
    },
    {
      "id" : "3c4ad1a3-35d6-41db-bc76-1422d7e9d460",
      "type" : "CreateRoute",
      "userId" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
      "description" : "mr.hpn created patrol route test-route-1",
      "createdAt" : "2023-07-28T02:11:46.669Z",
      "user" : {
        "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
        "avatar" : null,
        "name" : "huydang",
        "email" : "admin@vps.com",
        "status" : "inactive",
        "role" : "Admin",
        "latestLogin" : "2023-07-28T02:10:50.956Z"
      }
    },
    {
      "id" : "936a397d-3792-48d9-9dbb-db979acdb118",
      "type" : "UserLogout",
      "userId" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
      "description" : "mr.hpn logged out",
      "createdAt" : "2023-07-28T02:09:55.703Z",
      "user" : {
        "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
        "avatar" : null,
        "name" : "huydang",
        "email" : "admin@vps.com",
        "status" : "inactive",
        "role" : "Admin",
        "latestLogin" : "2023-07-28T02:10:50.956Z"
      }
    },
    {
      "id" : "12f6f378-caa5-4357-8733-27dfb78e878d",
      "type" : "UserLogout",
      "userId" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
      "description" : "mr.hpn logged out",
      "createdAt" : "2023-07-28T02:09:37.055Z",
      "user" : {
        "id" : "c90b08cc-ad08-4b0e-be48-5f1b3d345b2f",
        "avatar" : null,
        "name" : "huydang",
        "email" : "admin@vps.com",
        "status" : "inactive",
        "role" : "Admin",
        "latestLogin" : "2023-07-28T02:10:50.956Z"
      }
    }
  ],
  limit : 100,
  offset : 0
};

// Cameras
export const CamerasListResponse = {
  count : 546,
  data : [
    {
      "id" : "54f709d2-c0c7-2bea-fdc8-ac13b74a6882",
      "name" : "DI01 - Wimborne PS L1",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 16,
      "siteName" : "20 sites",
      "sops" : [
        {
          "id" : 2,
          "name" : "g-sop22",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:55.618Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 1,
          "name" : "g-sop1",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:23.930Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 3,
          "name" : "s-sop1",
          "type" : "Special",
          "startDate" : "2023-06-23T17:30:00.000Z",
          "endDate" : "2023-06-28T17:30:00.000Z",
          "checklists" : [
            "a",
            "b",
            "c"
          ],
          "createdAt" : "2023-06-23T16:42:49.560Z"
        }
      ]
    },
    {
      "id" : "fb71888b-4a48-da1d-058c-967e7ae90d1b",
      "name" : "DI02 - Wimborne PS L2",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 16,
      "siteName" : "20 sites",
      "sops" : []
    },
    {
      "id" : "f705d8b3-9872-51be-d677-e4543021d61f",
      "name" : "DI03 - Wimborne PS L3",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 16,
      "siteName" : "20 sites",
      "sops" : [
        {
          "id" : 1,
          "name" : "g-sop1",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:23.930Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 2,
          "name" : "g-sop22",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:55.618Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 3,
          "name" : "s-sop1",
          "type" : "Special",
          "startDate" : "2023-06-23T17:30:00.000Z",
          "endDate" : "2023-06-28T17:30:00.000Z",
          "checklists" : [
            "a",
            "b",
            "c"
          ],
          "createdAt" : "2023-06-23T16:42:49.560Z"
        }
      ]
    },
    {
      "id" : "2a2b995f-c32d-c797-5d11-cb75bbf30860",
      "name" : "DI04 - Wimborne PS L4",
      "address" : "",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 0,
      "siteName" : "Unassigned",
      "sops" : [
        {
          "id" : 1,
          "name" : "g-sop1",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:23.930Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 2,
          "name" : "g-sop22",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:55.618Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 3,
          "name" : "s-sop1",
          "type" : "Special",
          "startDate" : "2023-06-23T17:30:00.000Z",
          "endDate" : "2023-06-28T17:30:00.000Z",
          "checklists" : [
            "a",
            "b",
            "c"
          ],
          "createdAt" : "2023-06-23T16:42:49.560Z"
        }
      ]
    },
    {
      "id" : "45f4b772-ec2c-461f-8202-d87570510d9b",
      "name" : "DI05 - Wimborne PS L5",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 16,
      "siteName" : "20 sites",
      "sops" : []
    },
    {
      "id" : "17908996-5290-e1f9-8aee-0717faf58bc8",
      "name" : "DI06 - Wimborne PS L6",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 0,
      "siteName" : "Unassigned",
      "sops" : [
        {
          "id" : 2,
          "name" : "g-sop22",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:55.618Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 1,
          "name" : "g-sop1",
          "type" : "General",
          "checklists" : [
            "Check if windows are closed",
            "Check if doors are closed",
            "Check if lightings are ON",
            "Check if rubbish bin is full",
            "Check for any intrusion/third party",
            "Check if any  suspicious activity"
          ],
          "createdAt" : "2023-06-23T16:41:23.930Z",
          "startDate" : "",
          "endDate" : ""
        },
        {
          "id" : 3,
          "name" : "s-sop1",
          "type" : "Special",
          "startDate" : "2023-06-23T17:30:00.000Z",
          "endDate" : "2023-06-28T17:30:00.000Z",
          "checklists" : [
            "a",
            "b",
            "c"
          ],
          "createdAt" : "2023-06-23T16:42:49.560Z"
        }
      ]
    },
    {
      "id" : "909789a6-1ff9-9298-dc55-482e0e786e6b",
      "name" : "DI07 - Wimborne PS Office",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 0,
      "siteName" : "Unassigned",
      "sops" : []
    },
    {
      "id" : "a93d1985-e1c1-5f84-31d1-47666307f720",
      "name" : "DI08-Poole Rd PS L1",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 16,
      "siteName" : "20 sites",
      "sops" : []
    },
    {
      "id" : "9ae372f1-9b06-8044-9218-91ac1739219a",
      "name" : "DI09 - Poole Rd PS L2",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 0,
      "siteName" : "Unassigned",
      "sops" : []
    },
    {
      "id" : "d681a0d3-723e-afb7-e1c7-755b03b4a134",
      "name" : "DI10 - Poole Rd PS L3",
      "address" : "a",
      "tags" : [],
      "lat" : "",
      "lng" : "",
      "status" : "Recording",
      "bearing" : "",
      "siteId" : 16,
      "siteName" : "20 sites",
      "sops" : []
    }
  ],
  limit : 10,
  offset : 0
};
export const SOPResponse = {
  count : 13,
  data : [
    {
      "id" : 3,
      "name" : "s-sop1",
      "type" : "Special",
      "startDate" : "2023-06-23T17:30:00.000Z",
      "endDate" : "2023-06-28T17:30:00.000Z",
      "checklists" : [
        "a",
        "b",
        "c"
      ],
      "createdAt" : "2023-06-23T16:42:49.560Z"
    },
    {
      "id" : 1,
      "name" : "g-sop1",
      "type" : "General",
      "checklists" : [
        "Check if windows are closed",
        "Check if doors are closed",
        "Check if lightings are ON",
        "Check if rubbish bin is full",
        "Check for any intrusion/third party",
        "Check if any  suspicious activity"
      ],
      "createdAt" : "2023-06-23T16:41:23.930Z"
    },
    {
      "id" : 2,
      "name" : "g-sop22",
      "type" : "General",
      "checklists" : [
        "Check if windows are closed",
        "Check if doors are closed",
        "Check if lightings are ON",
        "Check if rubbish bin is full",
        "Check for any intrusion/third party",
        "Check if any  suspicious activity"
      ],
      "createdAt" : "2023-06-23T16:41:55.618Z"
    },
    {
      "id" : 4,
      "name" : "g-sop3",
      "type" : "General",
      "checklists" : [
        "Nx Witness VMS Server offers a mostly HTTP-based API.",
        "Nx Witness VMS Server offers.",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API"
      ],
      "createdAt" : "2023-08-10T01:53:16.891Z"
    },
    {
      "id" : 5,
      "name" : "g-sop4",
      "type" : "General",
      "checklists" : [
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API"
      ],
      "createdAt" : "2023-08-10T01:53:33.924Z"
    },
    {
      "id" : 7,
      "name" : "sp01",
      "type" : "Special",
      "startDate" : "2023-08-28T16:00:00.000Z",
      "endDate" : "2023-08-29T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-08-24T08:14:21.941Z"
    },
    {
      "id" : 8,
      "name" : "abc",
      "type" : "Special",
      "startDate" : "2023-08-30T16:00:00.000Z",
      "endDate" : "2023-08-30T15:59:59.999Z",
      "checklists" : [
        "dfd"
      ],
      "createdAt" : "2023-08-24T08:40:30.805Z"
    },
    {
      "id" : 9,
      "name" : "ab",
      "type" : "Special",
      "startDate" : "2023-08-30T16:00:00.000Z",
      "endDate" : "2023-08-24T15:59:59.999Z",
      "checklists" : [
        "d"
      ],
      "createdAt" : "2023-08-24T08:42:10.219Z"
    },
    {
      "id" : 10,
      "name" : "asdf",
      "type" : "Special",
      "startDate" : "2023-08-30T16:00:00.000Z",
      "endDate" : "2023-08-24T15:59:59.999Z",
      "checklists" : [
        "sdf"
      ],
      "createdAt" : "2023-08-24T09:06:00.322Z"
    },
    {
      "id" : 11,
      "name" : "aa",
      "type" : "General",
      "checklists" : [
        "j"
      ],
      "createdAt" : "2023-09-30T06:11:21.295Z"
    },
    {
      "id" : 12,
      "name" : "aband thus ",
      "type" : "General",
      "checklists" : [
        "dd"
      ],
      "createdAt" : "2023-09-30T06:41:49.741Z"
    },
    {
      "id" : 13,
      "name" : "new sop",
      "type" : "General",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-09-30T06:47:53.248Z"
    },
    {
      "id" : 14,
      "name" : "abcdsfsdfsdfs",
      "type" : "General",
      "checklists" : [
        "adf"
      ],
      "createdAt" : "2023-09-30T06:55:08.915Z"
    }
  ]
};
export const UpdateCameraDetailsResponse = {
  "id" : "54f709d2-c0c7-2bea-fdc8-ac13b74a6882",
  "name" : "DI01 - Wimborne PS L1 updated",
  "address" : null,
  "tags" : null,
  "lat" : null,
  "lng" : null,
  "status" : "Recording",
  "bearing" : null,
  "siteId" : "13",
  "siteName" : "abc",
  "sops" : [
    {
      "id" : 3,
      "name" : "s-sop1",
      "type" : "Special",
      "startDate" : "2023-06-23T17:30:00.000Z",
      "endDate" : "2023-06-28T17:30:00.000Z",
      "checklists" : [
        "a",
        "b",
        "c"
      ],
      "createdAt" : "2023-06-23T16:42:49.560Z"
    },
    {
      "id" : 1,
      "name" : "g-sop1",
      "type" : "General",
      "checklists" : [
        "Check if windows are closed",
        "Check if doors are closed",
        "Check if lightings are ON",
        "Check if rubbish bin is full",
        "Check for any intrusion/third party",
        "Check if any  suspicious activity"
      ],
      "createdAt" : "2023-06-23T16:41:23.930Z"
    },
    {
      "id" : 2,
      "name" : "g-sop22",
      "type" : "General",
      "checklists" : [
        "Check if windows are closed",
        "Check if doors are closed",
        "Check if lightings are ON",
        "Check if rubbish bin is full",
        "Check for any intrusion/third party",
        "Check if any  suspicious activity"
      ],
      "createdAt" : "2023-06-23T16:41:55.618Z"
    },
    {
      "id" : 4,
      "name" : "g-sop3",
      "type" : "General",
      "checklists" : [
        "Nx Witness VMS Server offers a mostly HTTP-based API.",
        "Nx Witness VMS Server offers.",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API"
      ],
      "createdAt" : "2023-08-10T01:53:16.891Z"
    }
  ]
};

// Sites
export const SitesListResponse = {
  count : 16,
  data : [
    {
      "id" : "16",
      "name" : "20 sites",
      "description" : "abc",
      "noCameras" : 14
    },
    {
      "id" : "15",
      "name" : "18-sites",
      "description" : "ddf",
      "noCameras" : 8
    },
    {
      "id" : "14",
      "name" : "19-cams",
      "description" : "dd",
      "noCameras" : 2,
      "cameras" : [
        {
          "id" : "6ac41060-e7b7-abf5-9b2b-ebbabbe7ccff",
          "name" : "GroundFloor Perimeter4"
        },
        {
          "id" : "c5afbd55-47d5-2563-be97-b664f92017ad",
          "name" : "GroundFloor Perimeter3"
        }
      ]
    },
    {
      "id" : "13",
      "name" : "abc",
      "description" : "sfsdf",
      "noCameras" : 501
    },
    {
      "id" : "12",
      "name" : "new-site-hpn",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "11",
      "name" : "new-site-9999",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "10",
      "name" : "new-site-998",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "9",
      "name" : "site-new",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "8",
      "name" : "site-new",
      "description" : "desc",
      "noCameras" : 0
    },
    {
      "id" : "7",
      "name" : "new-site",
      "description" : "desc",
      "noCameras" : 0
    }
  ],
  limit : 10,
  offset : 0
};
export const UpdateSiteDetailsResponse = {
  "name" : "19-cams (updated)",
  "description" : "dd (updated)",
  "cameraIds" : [
    "54f709d2-c0c7-2bea-fdc8-ac13b74a6882"
  ]
};

// Alert Types
export const AlertTypesListResponse = {
  count : 3,
  data : [
    {
      "id" : "4f578828-15eb-4035-bc41-495bb2eb29b5",
      "type" : "floodd",
      "priority" : "Medium",
      "description" : "flood desc",
      "actionTaken" : [
        "a"
      ],
      "imageUrl" : "/uploads/image-1689580000483.jpg"
    },
    {
      "id" : "f9cb6ba6-b8ff-4419-8316-554d023328ba",
      "type" : "fire",
      "priority" : "Medium",
      "description" : "fire 1 desc",
      "actionTaken" : [
        "call 911",
        "call 119"
      ],
      "imageUrl" : "/uploads/image-1688634923863.jpg"
    },
    {
      "id" : "406dee07-9e9f-44d0-9b19-cef59b9e7ace",
      "type" : "new",
      "priority" : "Medium",
      "description" : "abc",
      "actionTaken" : [
        "def",
        "ghi"
      ],
      "imageUrl" : "uploads/image-1688557271550.jpg"
    }
  ],
  limit : 10,
  offset : 0
};
export const UpdateAlertTypeResponse = {
  "id" : "4f578828-15eb-4035-bc41-495bb2eb29b5",
  "type" : "floodd (updated)",
  "priority" : "Medium",
  "description" : "flood (updated)",
  "actionTaken" : [
    "a (updated)",
    "new action taken"
  ],
  "imageUrl" : "/uploads/image-1689580000483.jpg"
};

// SOPs
// general sops
export const GeneralSOPListResponse = {
  count : 11,
  data : [
    {
      "id" : 1,
      "name" : "g-sop1",
      "type" : "General",
      "checklists" : [
        "Check if windows are closed",
        "Check if doors are closed",
        "Check if lightings are ON",
        "Check if rubbish bin is full",
        "Check for any intrusion/third party",
        "Check if any  suspicious activity"
      ],
      "createdAt" : "2023-06-23T16:41:23.930Z"
    },
    {
      "id" : 2,
      "name" : "g-sop22",
      "type" : "General",
      "checklists" : [
        "Check if windows are closed",
        "Check if doors are closed",
        "Check if lightings are ON",
        "Check if rubbish bin is full",
        "Check for any intrusion/third party",
        "Check if any  suspicious activity"
      ],
      "createdAt" : "2023-06-23T16:41:55.618Z"
    },
    {
      "id" : 4,
      "name" : "g-sop3",
      "type" : "General",
      "checklists" : [
        "Nx Witness VMS Server offers a mostly HTTP-based API.",
        "Nx Witness VMS Server offers.",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API"
      ],
      "createdAt" : "2023-08-10T01:53:16.891Z"
    },
    {
      "id" : 5,
      "name" : "g-sop4",
      "type" : "General",
      "checklists" : [
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API",
        "Nx Witness VMS Server offers a mostly HTTP-based API"
      ],
      "createdAt" : "2023-08-10T01:53:33.924Z"
    },
    {
      "id" : 11,
      "name" : "aa",
      "type" : "General",
      "checklists" : [
        "j"
      ],
      "createdAt" : "2023-09-30T06:11:21.295Z"
    },
    {
      "id" : 12,
      "name" : "aband thus ",
      "type" : "General",
      "checklists" : [
        "dd"
      ],
      "createdAt" : "2023-09-30T06:41:49.741Z"
    },
    {
      "id" : 13,
      "name" : "new sop",
      "type" : "General",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-09-30T06:47:53.248Z"
    },
    {
      "id" : 14,
      "name" : "abcdsfsdfsdfs",
      "type" : "General",
      "checklists" : [
        "adf"
      ],
      "createdAt" : "2023-09-30T06:55:08.915Z"
    },
    {
      "id" : 15,
      "name" : "new-sop-1",
      "type" : "General",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-02T08:44:01.216Z"
    },
    {
      "id" : 16,
      "name" : "new-sop-2",
      "type" : "General",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-02T08:44:08.203Z"
    }
  ],
  limit : 10,
  offset : 0
};
export const UpdateGeneralSOPResponse = {
  "id" : 1,
  "name" : "g-sop1 (updated)",
  "type" : "General",
  "checklists" : [
    "Check if windows are closed (updated)",
    "Check if doors are closed",
    "Check if lightings are ON",
    "Check if rubbish bin is full",
    "Check for any intrusion/third party",
    "Check if any  suspicious activity",
    "new checklist"
  ],
  "createdAt" : "2023-06-23T16:41:23.930Z"
};
export const CreateGeneralSOPResponse = {
  "id" : 18,
  "name" : "New-Sop",
  "type" : "General",
  "checklists" : [
    "check-list-1",
    "check-list-2"
  ],
  "createdAt" : "2023-10-02T16:50:46.824Z"
};
// special sops
export const SpecialSOPListResponse = {
  count : 12,
  data : [
    {
      "id" : 3,
      "name" : "s-sop1",
      "type" : "Special",
      "startDate" : "2023-06-23T17:30:00.000Z",
      "endDate" : "2023-06-28T17:30:00.000Z",
      "checklists" : [
        "a",
        "b",
        "c"
      ],
      "createdAt" : "2023-06-23T16:42:49.560Z"
    },
    {
      "id" : 7,
      "name" : "sp01",
      "type" : "Special",
      "startDate" : "2023-08-28T16:00:00.000Z",
      "endDate" : "2023-08-29T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-08-24T08:14:21.941Z"
    },
    {
      "id" : 8,
      "name" : "abc",
      "type" : "Special",
      "startDate" : "2023-08-30T16:00:00.000Z",
      "endDate" : "2023-08-30T15:59:59.999Z",
      "checklists" : [
        "dfd"
      ],
      "createdAt" : "2023-08-24T08:40:30.805Z"
    },
    {
      "id" : 9,
      "name" : "ab",
      "type" : "Special",
      "startDate" : "2023-08-30T16:00:00.000Z",
      "endDate" : "2023-08-24T15:59:59.999Z",
      "checklists" : [
        "d"
      ],
      "createdAt" : "2023-08-24T08:42:10.219Z"
    },
    {
      "id" : 10,
      "name" : "asdf",
      "type" : "Special",
      "startDate" : "2023-08-30T16:00:00.000Z",
      "endDate" : "2023-08-24T15:59:59.999Z",
      "checklists" : [
        "sdf"
      ],
      "createdAt" : "2023-08-24T09:06:00.322Z"
    },
    {
      "id" : 19,
      "name" : "sp-sop-1",
      "type" : "Special",
      "startDate" : "2023-10-02T16:00:00.000Z",
      "endDate" : "2023-10-03T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-03T06:36:38.256Z"
    },
    {
      "id" : 20,
      "name" : "sp-sop-2",
      "type" : "Special",
      "startDate" : "2023-10-02T16:00:00.000Z",
      "endDate" : "2023-10-03T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-03T06:36:46.529Z"
    },
    {
      "id" : 21,
      "name" : "sp-sop-3",
      "type" : "Special",
      "startDate" : "2023-10-02T16:00:00.000Z",
      "endDate" : "2023-10-03T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-03T06:36:54.580Z"
    },
    {
      "id" : 22,
      "name" : "sp-sop-4",
      "type" : "Special",
      "startDate" : "2023-10-02T16:00:00.000Z",
      "endDate" : "2023-10-03T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-03T06:37:00.667Z"
    },
    {
      "id" : 23,
      "name" : "sp-sop-5",
      "type" : "Special",
      "startDate" : "2023-10-02T16:00:00.000Z",
      "endDate" : "2023-10-03T15:59:59.999Z",
      "checklists" : [
        "a"
      ],
      "createdAt" : "2023-10-03T06:37:07.687Z"
    }
  ],
  limit : 10,
  offset : 0
};
export const UpdateSpecialSOPResponse = {
  "id" : 3,
  "name" : "s-sop1 (updated)",
  "type" : "Special",
  "startDate" : "2023-10-09T16:00:00.000Z",
  "endDate" : "2023-10-23T15:59:59.999Z",
  "checklists" : [
    "a (updated)",
    "b",
    "c",
    "d",
    "new checklist"
  ],
  "createdAt" : "2023-06-23T16:41:23.930Z"
};
export const CreateSpecialSOPResponse = {
  "id" : 18,
  "name" : "New-Special-Sop",
  "type" : "Special",
  "checklists" : [
    "check-list-1", 
    "check-list-2"
  ],
  "createdAt" : "2023-10-03T08:17:45.586Z",
  "endDate" : "2023-10-23T15:59:59.999Z",
  "startDate" : "2023-10-09T16:00:00.000Z"
};
