import { Participant } from "./participant";

export class CalendarQueryResult {
  startDateTime: Date;
  endDateTime: Date;
  participants : Participant[]
}