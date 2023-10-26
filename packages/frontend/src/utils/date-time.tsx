import moment from "moment-timezone";
import { TIME_ZONE } from "./time-format";
import { CalendarDate } from "model-type/component-style";

export const convertSecondsToHumanReadableFormat = (seconds: string): string => {
  const duration = moment.duration(seconds, "seconds");
  const formattedTime = moment.utc(duration.asMilliseconds()).format("hh:mm a");

  return formattedTime;
};

export const convertSecondsToTimeObj = (totalSeconds: number): { hour: number; minute: number; time: 0 | 1 | number } => {
  const hours = Math.floor(totalSeconds / 3600) % 12;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const timeIndicator = Math.floor(totalSeconds / 43200); // 43200 seconds = 12 hours

  return {
    hour : hours === 0 ? 12 : hours,
    minute : minutes,
    time : timeIndicator
  };
};

export const convertISOToTimeObj = (dateTime: string): CalendarDate => {
  const result = moment(dateTime).tz(TIME_ZONE);
  return {
    year : result.year(),
    month : result.month() + 1, // Adding 1 because months are zero-based
    day : result.date()
  };
};

export const convertTimeObjToSeconds = (timeObj: {
  hour: number;
  minute: number;
  time: 0 | 1 | number;
}): number => {
  const {
    hour, minute, time 
  } = timeObj;
  const totalSeconds = ((hour % 12) + (time === 1 ? 12 : 0)) * 3600 + minute * 60;

  return totalSeconds;
};

export const calculateTimeDiffBetweenDateAndCurrentTime = (incomingDate: Date, timeInSeconds: number): string => {
  const currentDateTime = moment().tz(TIME_ZONE);
  const date = moment(incomingDate).format("YYYY-MM-DD");

  const singaporeDateTime = moment(`${date}T00:00:00`).add(timeInSeconds, "seconds")
    .tz(TIME_ZONE);

  const timeDifferenceMs = currentDateTime.diff(singaporeDateTime);
  const duration = moment.duration(timeDifferenceMs);

  // Calculate the individual time units (days, hours, minutes, seconds)
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  // Format the time difference as "days hr min sec" while omitting zero values
  let formattedTimeDifference = "";

  if (days > 0) {
    formattedTimeDifference += `${days} day${days > 1 ? "s" : ""} `;
  }

  if (hours > 0) {
    formattedTimeDifference += `${hours} hr `;
  }

  if (minutes > 0) {
    formattedTimeDifference += `${minutes} min `;
  }

  if (seconds > 0 || formattedTimeDifference === "") {
    formattedTimeDifference += `${seconds} sec`;
  }

  return formattedTimeDifference;
};

export const calculateTimeDiffBetweenDateTimes = (time1 : string, time2 : string) : string => {
  const time1Moment = moment.utc(time1);
  const time2Moment = moment(time2).tz(TIME_ZONE);

  const timeDifferenceMs = time2Moment.diff(time1Moment);
  const duration = moment.duration(timeDifferenceMs);

  const daysDiff = Math.abs(duration.days());
  const hoursDiff = Math.abs(duration.hours());
  const minutesDiff = Math.abs(duration.minutes());

  let result = "";
  if (daysDiff > 0) {
    result = `${daysDiff} day${daysDiff > 1 ? "s" : ""} ${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ${minutesDiff} minute${minutesDiff > 1 ? "s" : ""}`;
  } else if (hoursDiff > 0) {
    result = `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ${minutesDiff} minute${minutesDiff > 1 ? "s" : ""}`;
  } else {
    result = `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""}`;
  }

  return result;
}; 

export const getCurrentTimeInSgInEpoch = (): number => {
  const currentTimeSG = moment().tz(TIME_ZONE);
  return currentTimeSG.valueOf();
};

export const checkDateTimeisXSecondsAway = (dateTime: Date, hourInSeconds: number, xSeconds: number) => {
  const durationInSeconds = calculateTotalDurationInSecondsFromDateTimeByXSeconds(dateTime, hourInSeconds);
  return durationInSeconds <= Number(xSeconds);
};

export const getTotalTimeAwayFromDateTimeByXseconds = (dateTime: Date, hourInSeconds: number) => {
  const durationInSeconds = calculateTotalDurationInSecondsFromDateTimeByXSeconds(dateTime, hourInSeconds);

  const durationObj = moment.duration(durationInSeconds, "seconds");
  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();

  let formattedDuration = "";
  if (days > 0) formattedDuration += days + (days > 1 ? " ds, " : " d, ");
  if (hours > 0) formattedDuration += hours + (hours > 1 ? " hrs, " : " hr, ");
  if (minutes > 0) formattedDuration += minutes + (minutes > 1 ? " mins, " : " min, ");

  return formattedDuration.slice(0, -2);
};

const calculateTotalDurationInSecondsFromDateTimeByXSeconds = (dateTime: Date, hourInSeconds: number) => {
  const currentTime = moment().tz(TIME_ZONE);
  const _dateTime = moment(dateTime).tz(TIME_ZONE)
    .startOf("day")
    .add(hourInSeconds, "seconds");

  const duration = moment.duration(_dateTime.diff(currentTime));
  return duration.asSeconds();
};

// date format => "2023-07-20T17:30:00.000Z"
export const isTodayInRangeOfTwoDates = (startDate : string, endDate : string) : boolean => {
  const today = moment().tz(TIME_ZONE)
    .startOf("day");
  const start = moment(startDate).tz(TIME_ZONE)
    .startOf("day");
  const end = moment(endDate).tz(TIME_ZONE)
    .endOf("day");

  return today.isBetween(start, end, "day", "[]");
};

export const getTimeOfADayText = (time : number) : string => {
  if (time == undefined) return "";

  if (time == 0) return "Midnight";

  if (time < 3600 * 5) return "Night";

  if (time < 3600 * 12) return "Morning";

  if (time < 3600 * 17) return "Afternoon";

  if (time < 3600 * 21) return "Evening";

  return "Night";
};

export const getNumberOfDaysInMonth = (dateString : string) : number => {
  const date = moment(dateString);
  const numberOfDays = date.daysInMonth();
  
  return numberOfDays;
};

// endTimeInSeconds : 86800 => 86800 / 3600 => 23 => 11pm
export const getReminingTimeInSeconds = (endTimeInSeconds : number) => {
  const currentTime = moment().tz(TIME_ZONE);
  const endTime = moment()
    .tz(TIME_ZONE)
    .set({
      hour : Math.floor(endTimeInSeconds / 3600),
      minute : Math.floor((endTimeInSeconds % 3600) / 60),
      second : endTimeInSeconds % 60
    });

  return endTime.diff(currentTime, "seconds");
};

export const isDateXGreaterThanDateY = (dateX : CalendarDate, dateY : CalendarDate) : boolean => {
  const start = moment(dateX);
  const end = moment(dateY);

  if (start.isSame(end)) return false;
  return start.isAfter(end);
};

export const getEndDateOfMonth = (monthNumber : number) : number => {
  const endDate = moment().month(monthNumber)
    .endOf("month");
  return endDate.date();
};

export const convertCalendarDateToDate = (calendarDate : CalendarDate, endOfDay ?: boolean) : Date => {
  if (endOfDay) {
    return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day, 23, 59, 59);
  }
  return new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
};

export const getLastDayOfMonth = (month : number, year : number) : string => { // return in 30th format
  const lastDayOfMonth = moment({
    year,
    month 
  }).endOf("month");
  return lastDayOfMonth.format("Do");
};

export const getWeekNumber = (incomingDate : CalendarDate, isSuffixIncluded = false) : number | string => {
  const {
    year, day, month 
  } = incomingDate;
  const date = moment({
    year,
    month : month - 1,
    day 
  });

  const weekNumber = date.isoWeek();

  let suffix = "";
  if (isSuffixIncluded) {
    const lastDigit = weekNumber % 10;
    if (weekNumber >= 11 && weekNumber <= 13) {
      suffix = "th";
    } else {
      switch (lastDigit) {
        case 1:
          suffix = "st";
          break;
        case 2:
          suffix = "nd";
          break;
        case 3:
          suffix = "rd";
          break;
        default:
          suffix = "th";
          break;
      }
    }

    return `${weekNumber}${suffix}`;
  }

  return weekNumber;
};

export const getCurrentWeekSunday = () : CalendarDate => {
  const currentDate = moment();
  const sundayDate = currentDate.clone().subtract(currentDate.day(), "days");

  const day = sundayDate.date();
  const month = sundayDate.month() + 1;
  const year = sundayDate.year();

  return {
    day,
    month,
    year 
  };
};

export const getPreviousWeekSunday = () : CalendarDate => {
  const currentDate = moment();

  const previousSundayDate = currentDate.clone().subtract(currentDate.day() + 7, "days");

  const day = previousSundayDate.date();
  const month = previousSundayDate.month() + 1;
  const year = previousSundayDate.year();

  return {
    day,
    month,
    year 
  };
};

export const getPreviousWeekSaturday = () : CalendarDate => {
  const currentDate = moment();

  const previousSundayDate = currentDate.clone().subtract(currentDate.day() + 7, "days");
  const previousSaturdayDate = previousSundayDate.clone().add(6, "days");

  const day = previousSaturdayDate.date();
  const month = previousSaturdayDate.month() + 1;
  const year = previousSaturdayDate.year();

  return {
    day,
    month,
    year 
  };
};

export const getCurrentWeekSaturday = () : CalendarDate => {
  const currentDate = moment();

  const daysUntilSaturday = (6 - currentDate.day() + 7) % 7;
  const currentSaturdayDate = currentDate.clone().add(daysUntilSaturday, "days");

  const day = currentSaturdayDate.date();
  const month = currentSaturdayDate.month() + 1;
  const year = currentSaturdayDate.year();

  return {
    day,
    month,
    year 
  };
};