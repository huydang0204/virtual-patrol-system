import { CameraResponse } from "@vps/utils/lib/dto/camera";
import { ExecuteTime } from "@vps/utils/lib/data";
import { CalendarDate } from "./component-style";

type Checkpoints = {
  id?: string;
  name?: string;
  order: number;
  layoutRow: number;
  layoutCol: number;
  cameras: CameraResponse[];
};

type Schedule = {
  id?: string;
  name?: string;
  startOccurrenceDate: CalendarDate;
  endOccurrenceDate: CalendarDate | null;
  isRecurForever: boolean;
  executingTime: ExecuteTime[];
  executingDays: number[]; // [number, number] ?
};

// type Schedule = {
//   id: string;
//   name: string;
//   startOccurrenceDate: Date | { year: number; month: number; day: number } | string;
//   endOccurrenceDate: Date | { year: number; month: number; day: number } | string | null;
//   executingDays: number[];
//   executingTime:
//     | { startTime: number; endTime: number }[]
//     | {
//         startTime: { hour: number; minute: number; time: number };
//         endTime: { hour: number; minute: number; time: number };
//       }[];
// };

export {
  Checkpoints, Schedule
};
