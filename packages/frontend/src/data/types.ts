import { 
  RouteCheckpointResponse, 
  RouteScheduleResponse 
} from "@vps/utils/lib/dto";
import { CalendarDate } from "model-type/component-style";

interface CheckpointsState extends Omit<RouteCheckpointResponse, "id"> {
  id ?: string;
}

interface SchedulesState extends Omit<RouteScheduleResponse, "id" | "startOccurrenceDate" | "endOccurrenceDate">{
  id ?: string;
  startOccurrenceDate : CalendarDate;
  endOccurrenceDate : CalendarDate;
  isRecurForever : boolean;
}

export { 
  CheckpointsState,
  SchedulesState
};