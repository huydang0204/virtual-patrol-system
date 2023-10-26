import { Schedule } from "model-type/component-types";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
// 8-25 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,25}$");

type TextLength = {
  min: number;
  max: number;
};

export enum DataType {
  UserName = "UserName"
}

export const DataLength: Record<DataType, TextLength> = {
  [DataType.UserName] : {
    min : 1,
    max : 100
  }
};

export const validateEmail = (str: string): boolean => {
  if (!!str) {
    return EMAIL_REGEX.test(str);
  }
  return false;
};

export const validatePassword = (str: string): boolean => {
  if (!!str) {
    return PASSWORD_REGEX.test(str);
  }
  return false;
};

export const validateLength = (value: string, length: TextLength): boolean => {
  if (value != null) {
    const len = value.length;
    return len >= length.min && len <= length.max;
  }
  return false;
};

export const validateSchedules = (schedules: Schedule[]): boolean => {
  console.log("schedules => ", schedules);
  // output: [
  //   {
  //     startOccurrenceDate: { year: 2023, month: 5, day: 26 },
  //     endOccurrenceDate: { year: 2023, month: 5, day: 26 },
  //     isRecurForever: false,
  //     executingTime: [
  //       {
  //         startTime: { hour: 1, minute: 0, time: 0}, // time = 0 | 1 (0 = am, 1 = pm)
  //         endTime: { hour: 1, minute: 0, time: 1 }
  //       }
  //     ],
  //     executingDays: []
  //   },
  //   ...
  // ];

  return false;
};
