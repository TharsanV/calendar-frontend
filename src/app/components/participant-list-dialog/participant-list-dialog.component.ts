import { ParticipantAvailability } from '../../models/participant-availability';
import { CalendarQueryResult } from '../../models/calendar-query-result';
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Participant } from '../../models/participant';
import { ParticipantService } from '../../services/participant.service';
import { DatePipe } from '@angular/common';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  participants: Participant[];
  startDateTime: Date;
  endDateTime: Date;
}

@Component({
  selector: 'app-participant-list-dialog',
  templateUrl: './participant-list-dialog.html'
})


export class ParticipantListDialogComponent {

  participants: Participant[];

  pipe = new DatePipe('en-US'); // Use your own locale

  dateRange: String = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.participants = data.participants;
    this.dateRange = this.dateRangeStr(data.endDateTime, data.startDateTime);
  }

  dateRangeStr(startDateTime: Date, endDateTime: Date){
    let sameDate = startDateTime.getDate() === endDateTime.getDate();

    return this.pipe.transform(startDateTime, 'EEEE, MMMM d, y h:mm a') 
    + " to " 
    + this.pipe.transform(endDateTime, sameDate ?'h:mm a' : 'EEEE, MMMM d, y h:mm a');
  }
}

//https://github.com/thelgevold/angular-samples/blob/master/src/apps/shared-components/contact-list/contact-list.ts