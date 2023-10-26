import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth
} from "date-fns";

// 8-25 characters, at least one uppercase letter, one lowercase letter, one number and one special character
export const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$");

export const getNxWitnessDeviceId = (id : string) : string => {
  return id.replace("{", "").replace("}", "");
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

export const getFromToOfMonth = (month : Date) : [from : Date, to : Date] => {
  return [
    startOfMonth(month),
    endOfMonth(month)
  ];
};

export const getFromToOfDate = (date: Date): [from: Date, to: Date] => {
  return [
    startOfDay(date),
    endOfDay(date)
  ];
};