import moment from "moment-timezone";
import { CalendarDate } from "model-type/component-style";

export const TIME_ZONE = "Asia/Singapore";
const DATE_STRING_FORMAT = "DD MMMM, YYYY";
const DATE_STRING_WEEKDAY_FORMAT = "DD MMMM, dddd";
const DATE_STRING_CALENDAR = "DD/MM/YYYY";
const MONTH_YEAR_STRING_FORMAT = "MMMM, YYYY";
const COMPLETE_DATE_TIME = "DD MMM YYYY hh:mm A";

export const getFormattedDate = (date : Date, includeTime = false) : string => {
  const format = includeTime ? COMPLETE_DATE_TIME : DATE_STRING_FORMAT;
  const a = moment.utc(date).tz(TIME_ZONE)
    .format(format);
  return a;
};

export const getFormattedMonthYear = (date : Date) : string => {
  return moment.utc(date).tz(TIME_ZONE)
    .format(MONTH_YEAR_STRING_FORMAT);
};

export const getFormattedDateForCalendar = (dateObj : CalendarDate) : string => {
  if (!dateObj) return "-";
  return moment(`${ dateObj.day }/${ dateObj.month }/${ dateObj.year }`, DATE_STRING_CALENDAR).format(DATE_STRING_CALENDAR);
};

export const getHumanDateFromCalendarDate = (date : CalendarDate, includeTodayDate : boolean, includeWeekDay ?: boolean) : string | JSX.Element => {
  const dateMoment = moment({
    year : date.year,
    month : date.month - 1,
    day : date.day
  }).tz(TIME_ZONE);
  const today = moment().tz(TIME_ZONE);

  if (dateMoment.isSame(today, "day")) {
    let result = "Today";
    if (includeTodayDate && includeWeekDay) result = "Today, " + dateMoment.format(DATE_STRING_WEEKDAY_FORMAT);
    else if (includeTodayDate) result = "Today, " + dateMoment.format(DATE_STRING_FORMAT);

    return result;
  } else {
    const currentDate = moment().tz(TIME_ZONE);
    let formattedDate = dateMoment.format("DD MMMM");

    if (includeWeekDay) {
      return formattedDate += ` ${dateMoment.format("YYYY") !== currentDate.format("YYYY") ? dateMoment.format("YYYY, dddd") : dateMoment.format("dddd")}`;
    } else {
      return dateMoment.format(DATE_STRING_FORMAT);
    }
  }
};

export const getTodayInCalendarAcceptedFormat = () : CalendarDate => {
  const timeZoneDate = moment.tz(TIME_ZONE).format("YYYY-MM-DD");

  const today = moment(timeZoneDate).toObject();

  return {
    year : today.years,
    month : today.months + 1,
    day : today.date
  };
};

export const isDateBeforeToday = (date : CalendarDate) : boolean => {
  const today = getTodayInCalendarAcceptedFormat();
  const givenDate = {
    year : date.year,
    month : date.month,
    day : date.day
  };

  return moment(givenDate).isBefore(moment(today));
};

export const isDateAfterToday = (date : CalendarDate) : boolean => {
  const today = getTodayInCalendarAcceptedFormat();
  const givenDate = {
    year : date.year,
    month : date.month,
    day : date.day
  };

  return moment(givenDate).isAfter(moment(today));
};

export const isDateToday = (date) => {
  const today = getTodayInCalendarAcceptedFormat();

  return date.year === today.year && date.month === today.month && date.day === today.day;
};

export const getStartAndEndTimeOfDay = (date : moment.Moment) : { start : string; end : string } => {
  const singapore = moment.tz(date, TIME_ZONE);
  const startOfDay = singapore.startOf("day").format("YYYY-MM-DDTHH:mm:ssZ");
  const endOfDay = singapore.endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

  return {
    start : startOfDay,
    end : endOfDay
  };
};

export const getStartAndEndTimeOfMonth = (yearMonth : {
  year : number;
  month : number;
}) : { start : string; end : string } => {
  const start = moment(yearMonth).tz(TIME_ZONE)
    .startOf("month")
    .format("YYYY-MM-DDTHH:mm:ssZ");
  const end = moment(yearMonth).tz(TIME_ZONE)
    .endOf("month")
    .format("YYYY-MM-DDTHH:mm:ssZ");

  return {
    start,
    end
  };
};

export const convertTimeInTimeZone = (timestr : string) : string => {
  return moment.tz(timestr, TIME_ZONE).format(DATE_STRING_CALENDAR);
};

export const getCurrentTimeInTimeZone = () : string => {
  return moment.tz(TIME_ZONE).format(COMPLETE_DATE_TIME);
}; 

export const convertTimeToCompleteDateTimeFormat = (dateTime : string) : string => {
  return moment.tz(dateTime, TIME_ZONE).format(COMPLETE_DATE_TIME);
};

export const parseISOTimeToDateObj = (timeString : string) : CalendarDate => {
  const formattedDate = moment.tz(timeString, TIME_ZONE).format("YYYY-MM-DD");

  return {
    year : moment(formattedDate).year(),
    month : moment(formattedDate).month() + 1, // adding 1 because months in Moment.js are zero-based
    day : moment(formattedDate).date()
  };
};

export const parseCalendarDateObjToISOTime = (dateObj : CalendarDate) : string => {
  if (!!dateObj && dateObj.year && dateObj.month && dateObj.day) {
    const momentDate = moment({
      year : dateObj.year,
      month : dateObj.month - 1,
      day : dateObj.day 
    });
    return moment(momentDate).format("YYYY-MM-DD");
  }
  
  return null;
};

export const convertToMonthYearFormat = (dateString : string, delimiter = ", ") => { // dateString => yyyy-mm-dd
  const formattedDate = moment(dateString, "YYYY-MM-DD");
  const monthYear = formattedDate.format(`MMMM${delimiter}YYYY`);

  return monthYear; // June, 2023
};

export const getTimeAgoFromDateTime = (date : Date) : string => {
  const dateTime = moment(date).tz(TIME_ZONE);
  return dateTime.fromNow();
};

export function convertISODateToDDMMYY(dateString : string) : string {
  return moment(dateString).tz(TIME_ZONE)
    .format("DD-MM-YYYY");
}

export const getStartEndDatesOfWeek = (from : CalendarDate, to : CalendarDate) : string => {
  const fromDate = moment({
    year : from.year,
    month : from.month - 1,
    day : from.day 
  }).format("DD/MM/YYYY");
  const toDate = moment({
    year : to.year,
    month : to.month - 1,
    day : to.day 
  }).format("DD/MM/YYYY");

  return `${fromDate}-${toDate}`;
};

export const distributeDatesBetweenXYDates = (fromDate : string, toDate : string) : string[] => {
  const _fromDate = moment(fromDate, "DD-MMM-YYYY");
  const _toDate = moment(toDate, "DD-MMM-YYYY");
  
  const dateArray = [];
  
  while (_fromDate.isSameOrBefore(_toDate)) {
    dateArray.push(_fromDate.format("DD-MM"));
    _fromDate.add(1, "day");
  }
  
  return dateArray;
};