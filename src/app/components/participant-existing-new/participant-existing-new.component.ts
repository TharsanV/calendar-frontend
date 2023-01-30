import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { bufferToggle } from 'rxjs/operators';
import { ParticipantService } from 'src/app/services/participant.service';
import { Participant } from '../../models/participant';

declare var $: any;

@Component({
  selector: 'app-participant-existing-new',
  templateUrl: './participant-existing-new.html',
  styles: [`
      .selected {
        border: 2px solid #3f51b5;
      }

      .btn-primary {
        background-color: #3f51b5 !important;
      }
   `]
})
//Form CSShttps://www.youtube.com/watch?v=k0bQmGu27Hk

export class ParticipantExistingNewComponent implements OnInit {
  @Output() selectUserEvent = new EventEmitter<Participant>();

  @ViewChild('welcomeModal') welcomeModal: ElementRef;

  @ViewChild('existingDropDown') existingDropdown: ElementRef;
  @ViewChild('newNameText') newNameText: ElementRef;

  selectedUser: Participant = null;
  selectedExisting: boolean = true;
  showChooseOneAlert: boolean = false;

  participantService: ParticipantService;
  participants: Participant[];

    
  constructor(participantService: ParticipantService) {
      this.participantService = participantService;
      this.participants = participantService.getParticipants();
  }

  log(x) {
    console.log(x);
  }

  showModal(){
    $(this.welcomeModal.nativeElement).modal('show'); 
  }

  setSelectedExisting(selectedExisting){
    if (selectedExisting != null){
      this.selectedExisting = selectedExisting;
    }
    console.log(this.selectedExisting);
  }

  submit(f){
    if (this.selectedExisting){
      if (!f.value.existingDropDown){
        this.showChooseOneAlert = true;
        return;
      }
      this.selectUserEvent.emit(f.value.existingDropDown);
    } else {
      if (!f.value.newNameText){
        this.showChooseOneAlert = true;
        return;
      }
      let p = new Participant;
      p.name = f.value.newNameText;
      this.participantService.addParticipant(p);
      this.selectUserEvent.emit(p);
    }
    $(this.welcomeModal.nativeElement).modal('hide'); 
  }

  ngOnInit() {
    console.log("welcome");
    console.info(this.participants);
  }
  
}

