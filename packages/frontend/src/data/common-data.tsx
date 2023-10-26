export enum LEFT_MENU_STATE {
  NONE,
  MAIN,
  SUB,
  MAX
}

export type PAGE_LIMIT = 10 | 20 | 50;

export enum CHECK_POINTS_IMAGE_LAYOUTS {
  "1x1" = "1x1",
  "2x2" = "2x2",
  "3x3" = "3x3",
  "5x5" = "5x5"
}

export enum CHECK_POINTS_VIDEO_LAYOUTS {
  "1x1" = "1x1",
  "1x2" = "1x2",
}

export const REMINDER_TIME_PATROL = [
  {
    id : 15 * 60,
    name : "15 mins"
  },
  {
    id : 30 * 60,
    name : "30 mins"
  },
  {
    id : 45 * 60,
    name : "45 mins"
  }
];

export const HOURS_12 = [
  {
    label : "1",
    value : 1
  },
  {
    label : "2",
    value : 2
  },
  {
    label : "3",
    value : 3
  },
  {
    label : "4",
    value : 4
  },
  {
    label : "5",
    value : 5
  },
  {
    label : "6",
    value : 6
  },
  {
    label : "7",
    value : 7
  },
  {
    label : "8",
    value : 8
  },
  {
    label : "9",
    value : 9
  },
  {
    label : "10",
    value : 10
  },
  {
    label : "11",
    value : 11
  },
  {
    label : "12",
    value : 12
  }
];

export const MINUTES_5_INTERVALS = [
  {
    label : "00",
    value : 0
  },
  {
    label : "05",
    value : 5
  },
  {
    label : "10",
    value : 10
  },
  {
    label : "15",
    value : 15
  },
  {
    label : "20",
    value : 20
  },
  {
    label : "25",
    value : 25
  },
  {
    label : "30",
    value : 30
  },
  {
    label : "35",
    value : 35
  },
  {
    label : "40",
    value : 40
  },
  {
    label : "45",
    value : 45
  },
  {
    label : "50",
    value : 50
  },
  {
    label : "55",
    value : 55
  }
];

interface TimeRange {
  label : string;
  value : number;
}

interface TimeRangeGroup {
  title : string;
  ranges : TimeRange[];
}

// used in creating schedules for patrol route
export const TIME_RANGES : TimeRangeGroup[] = [
  {
    title : "AM",
    ranges : [
      {
        label : "12:00 am",
        value : 0
      },
      {
        label : "12:30 am",
        value : 30 * 60
      },
      {
        label : "1:00 am",
        value : 60 * 60
      },
      {
        label : "1:30 am",
        value : 90 * 60
      },
      {
        label : "2:00 am",
        value : 120 * 60
      },
      {
        label : "2:30 am",
        value : 150 * 60
      },
      {
        label : "3:00 am",
        value : 180 * 60
      },
      {
        label : "3:30 am",
        value : 210 * 60
      },
      {
        label : "4:00 am",
        value : 240 * 60
      },
      {
        label : "4:30 am",
        value : 270 * 60
      },
      {
        label : "5:00 am",
        value : 300 * 60
      },
      {
        label : "5:30 am",
        value : 330 * 60
      },
      {
        label : "6:00 am",
        value : 360 * 60
      },
      {
        label : "6:30 am",
        value : 390 * 60
      },
      {
        label : "7:00 am",
        value : 420 * 60
      },
      {
        label : "7:30 am",
        value : 450 * 60
      },
      {
        label : "8:00 am",
        value : 480 * 60
      },
      {
        label : "8:30 am",
        value : 510 * 60
      },
      {
        label : "9:00 am",
        value : 540 * 60
      },
      {
        label : "9:30 am",
        value : 570 * 60
      },
      {
        label : "10:00 am",
        value : 600 * 60
      },
      {
        label : "10:30 am",
        value : 630 * 60
      },
      {
        label : "11:00 am",
        value : 660 * 60
      },
      {
        label : "11:30 am",
        value : 690 * 60
      }
    ]
  },
  {
    title : "PM",
    ranges : [
      {
        label : "12:00 pm",
        value : 12 * 60 * 60
      },
      {
        label : "12:30 pm",
        value : 12.5 * 60 * 60
      },
      {
        label : "1:00 pm",
        value : 13 * 60 * 60
      },
      {
        label : "1:30 pm",
        value : 13.5 * 60 * 60
      },
      {
        label : "2:00 pm",
        value : 14 * 60 * 60
      },
      {
        label : "2:30 pm",
        value : 14.5 * 60 * 60
      },
      {
        label : "3:00 pm",
        value : 15 * 60 * 60
      },
      {
        label : "3:30 pm",
        value : 15.5 * 60 * 60
      },
      {
        label : "4:00 pm",
        value : 16 * 60 * 60
      },
      {
        label : "4:30 pm",
        value : 16.5 * 60 * 60
      },
      {
        label : "5:00 pm",
        value : 17 * 60 * 60
      },
      {
        label : "5:30 pm",
        value : 17.5 * 60 * 60
      },
      {
        label : "6:00 pm",
        value : 18 * 60 * 60
      },
      {
        label : "6:30 pm",
        value : 18.5 * 60 * 60
      },
      {
        label : "7:00 pm",
        value : 19 * 60 * 60
      },
      {
        label : "7:30 pm",
        value : 19.5 * 60 * 60
      },
      {
        label : "8:00 pm",
        value : 20 * 60 * 60
      },
      {
        label : "8:30 pm",
        value : 20.5 * 60 * 60
      },
      {
        label : "9:00 pm",
        value : 21 * 60 * 60
      },
      {
        label : "9:30 pm",
        value : 21.5 * 60 * 60
      },
      {
        label : "10:00 pm",
        value : 22 * 60 * 60
      },
      {
        label : "10:30 pm",
        value : 22.5 * 60 * 60
      },
      {
        label : "11:00 pm",
        value : 23 * 60 * 60
      },
      {
        label : "11:30 pm",
        value : 23.5 * 60 * 60
      }
    ]
  }
];

export const DATE_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const API_ERROR_CODE = {
  URL_NOT_FOUND_URL : 404,
  UNAUTHORIZED : 403,
  ACCESS_DENIED : 401,
  SERVER_ERROR : 500
};

export const DEFAULT_START_ALLOW_TIME_IN_SECOND = 60 * 60; // 1hr

export const REFRESH_TIME_IN_SECOND = 5;

export const ACKNOWLEDGE_IN_MILLISECOND = 5 * 1000;

export const MILLISECOND_IN_SECOND = 1000;

export const UPDATE_ONGOING_INTERVAL = 2 * 60 * 1000; // 2 mins

export const PatrolViewModes = [
  {
    id : "LiveImage",
    name : "Live image"
  },
  {
    id : "LiveVideoFeed",
    name : "Live video feed"
  }
];

export const StartAllowTimeForPatrol = [
  {
    id : 0,
    name : "0 min"
  },
  {
    id : 15 * 60,
    name : "15 mins"
  },
  {
    id : 30 * 60,
    name : "30 mins"
  },
  {
    id : 1 * 60 * 60,
    name : "1 hr"
  }
];

export const RepeatEveryXHoursForSchedule = [
  {
    id : 1,
    name : "1 hr"
  },
  {
    id : 2,
    name : "2 hr"
  },
  {
    id : 3,
    name : "3 hr"
  },
  {
    id : 4,
    name : "4 hr"
  },
  {
    id : 6,
    name : "6 hr"
  }
];

export type AlertTypeButtons = {
  id : string,
  label : string,
  value : string,
  imageUrl : string,
};

export const MISSED_PATROL_REASONS = [
  "Previous Route delay",
  "Late / Urgent Leave",
  "Problems at Site",
  "Technical issues",
  "Forgot about Patrol"
];

export const INCOMPLETE_PATROL_REASONS = [
  "Previous Route delay",
  "Late / Urgent Leave",
  "Problems at Site",
  "Technical issues"
];

export const MONTHS_3STRING = ["Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"];

export enum REPORT_TABS {
  TASK = "TASK",
  DAILY = "DAILY",
  MONTHLY = "MONTHLY",
}

export enum TableSelectAllBehavior {
  "CURRENT_PAGE" = "currentPage",
  "ALL_PAGE" = "allPage"
}
