import { TutorialComponent } from './components/tutorial/tutorial.component';
import { ParticipantService } from './services/participant.service';
import { ParticipantExistingNewComponent } from './components/participant-existing-new/participant-existing-new.component';
import { ParticipantSelectorComponent } from './components/participant-selector.component';

import { CalendarComponent } from './components/calendar/calendar.component';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Participant } from './models/participant';
import { MatDrawer } from '@angular/material/sidenav';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('calendarComponent') 
  calendarComponent: CalendarComponent;

  @ViewChild('participantSelectorComponent') 
  participantSelectorComponent: ParticipantSelectorComponent;

  @ViewChild('participantExistingNewComponent') 
  participantExistingNewComponent: ParticipantExistingNewComponent;

  @ViewChild('tutorialComponent') 
  tutorialComponent: TutorialComponent;

  @ViewChild('matDrawer') 
  matDrawer: MatDrawer;

  @ViewChild('participantListComponent') 
  participantListComponent: ParticipantListComponent;

  viewDate = new Date();

  title = 'calendar-app';

  handleUserSelection($event){
    this.tutorialComponent.showModal(); 
    this.calendarComponent.selectCurrentUser($event);
  }

  handleUpdateViewDateEvent($event){
    this.calendarComponent.updateViewDate($event);
  }

  handleChangeCalendarActionEvent($event){
    this.calendarComponent.changeCalendarAction($event);
  }

  handleCalendarNavigateEvent($event){
    this.calendarComponent.navigateCalendar($event);
  }

  handleQueryEvent($event){
    this.participantListComponent.updateCQR($event);
  }

  handleToggleSidebar($event){
    this.matDrawer.toggle();
  }

  ngAfterViewInit() {
    console.log("app ngAfterViewInit")
    this.participantExistingNewComponent.showModal();
  }  
}
