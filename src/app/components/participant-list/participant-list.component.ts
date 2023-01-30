import { CalendarQueryResult } from './../../models/calendar-query-result';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Participant } from '../../models/participant';
import { ParticipantService } from '../../services/participant.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-participant-list',
  template: `
  <div id="container">
    <div *ngIf="cqr!=null">
      <h3>Participants Available</h3>
      {{ dateRange }}
      <mat-list>
        <mat-list-item id="participant-list" *ngFor="let participant of cqr.participants">
          <p class="participant-list-item">{{participant.name}}<p>
        </mat-list-item>
      </mat-list>
    </div>
  </div>
  `,
  styles: [`
      .participant-list-item {
        font-size:2vw;
        color: white;
      }

      #container{
        padding: 16px;
      }
    }
  `]

})
export class ParticipantListComponent implements OnInit {
  @Output() toggleEvent = new EventEmitter<Participant[]>();

  cqr: CalendarQueryResult = null;
  
  activeParticipants: Participant[] = [];

  participantService: ParticipantService;
  participants: Participant[];

  pipe = new DatePipe('en-US'); // Use your own locale


  dateRange: String = "";

    
  constructor(participantService: ParticipantService) {
      this.participantService = participantService;
      this.participants = participantService.getParticipants();
  }

  updateCQR(cqr){
    this.cqr = cqr;
    this.dateRange = this.dateRangeStr(cqr.startDateTime, cqr.endDateTime);
  }

  dateRangeStr(startDateTime: Date, endDateTime: Date){
    let sameDate = startDateTime.getDate() === endDateTime.getDate();

    return this.pipe.transform(startDateTime, 'EEEE, MMMM d, y h:mm a') 
    + " to " 
    + this.pipe.transform(endDateTime, sameDate ?'h:mm a' : 'EEEE, MMMM d, y h:mm a');
  }

  toggleParticpants(participant){
    if (this.activeParticipants.includes(participant)){
      this.activeParticipants = this.activeParticipants.filter(obj => obj !== participant);
    } else {
      this.activeParticipants.push(participant);
    }
    this.toggleEvent.emit(this.activeParticipants);
  }
  // baseUrl:string = "http://localhost:8080"

  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //     'Access-Control-Allow-Origin': 'http://localhost:4200'
  //   })
  // };

  // constructor(
  //   private http: HttpClient
  // ) { }

  ngOnInit() {
    console.log(this.participants);
        // this.http.get<Participant[]>(this.baseUrl + "/participants",  this.httpOptions)
        // .subscribe((data: Participant[]) => this.participants = data);
   }

  // addParticipant(name){
  //   console.log("in here");
  //   var participant = new Participant();
  //   this.participants.push(participant);

  //   participant.name = name.value;
  //   console.log("in herestest");
  //   this.http.post<Participant>(this.baseUrl + "/participant", participant, this.httpOptions).subscribe();

  //   console.log("in herio");
  //   return "done";
  // }

  // updateParticipantAttendance(id){
  //   console.log(name);
  // }
}

//https://github.com/thelgevold/angular-samples/blob/master/src/apps/shared-components/contact-list/contact-list.ts