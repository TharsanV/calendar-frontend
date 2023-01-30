import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Participant } from '../models/participant';

@Component({
  selector: 'app-participant-selector',
  template: `
  <label for="userDropDown">I am</label>
  <div style="display: inline;" name="userDropDown" class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      {{selectedUser?.name}}
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a>New User</a>
      <a *ngFor="let participant of participants" class="dropdown-item" (click)="selectCurrentUser(participant)" href="#">{{participant.name}}</a>
    </div>
  </div>
  <form>
    <div class="form-group">
      <div class="col-md-4 mb-3">
        <input type="text" class="form-control" id="inputName" placeholder="Enter your Name" size="10">
      </div>
      <div class="col-md-4 mb-3">
        <button  class="btn btn-primary">Create New User</button>
      </div>
    </div>
  </form>
  `
})
//Form CSShttps://www.youtube.com/watch?v=k0bQmGu27Hk

export class ParticipantSelectorComponent implements OnInit {
  @Input() participants: Participant[];
  @Output() selectUserEvent = new EventEmitter<Participant>();

  selectedUser: Participant;

  selectCurrentUser(participant){
    this.selectedUser = participant;
    console.log("ParticipantSelectorComponent selectCurrentUser: " + this.selectedUser.name);
    this.selectUserEvent.emit(this.selectedUser);
  }


  ngOnInit() {
  }

}

