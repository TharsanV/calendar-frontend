import { CalendarNavigation } from './../../models/calendar-navigation';
import { CalendarAction } from '../../models/calendar-action';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent, CalendarEventTitleFormatter, CalendarView } from 'angular-calendar';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CustomEventTitleFormatter } from './calendar.component';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-calendar-toolbar',
  templateUrl: './calendar-toolbar.html',
  styles: [`
      .selected {
        border: 2px solid #3f51b5;
      }

      .btn-primary {
        background-color: #3f51b5 !important;
      }

      #container {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }

      #left {
        width: 30%;
        display: inline-flex;
      }

      #toolbar {
        width: 100%;
        display: flex;
        justify-content: center;
      }

      #right {
        width: 30%;
        display: flex;
        justify-content: flex-end;
      }

      #date-header{
        font-size: 35px; 
        width: 30%;
        display: inline-flex;
        align-items: center; 
      }
   `]
})

export class CalendarToolbarComponent {
  
  chosenCalendarAction: CalendarAction = CalendarAction.Add;

  @Input() viewDate: Date

  @Output() updateViewDateEvent = new EventEmitter<Date>();
  @Output() changeCalendarActionEvent = new EventEmitter<CalendarAction>();
  @Output() calendarNavigateEvent = new EventEmitter<CalendarEvent>();
  @Output() toggleSidebarEvent = new EventEmitter();


  weekStartsOn: 0 = 0;

  CalendarView = CalendarView;

  CalendarAction = CalendarAction;

  CalendarNavigation = CalendarNavigation;

  selectAction(action) {
    this.chosenCalendarAction = action;
    this.changeCalendarActionEvent.emit(this.chosenCalendarAction);
  }

  navigateCalendar(navigate) {
    this.calendarNavigateEvent.emit(navigate);
  }

  toggleSidebar(){
    this.toggleSidebarEvent.emit();
  }

}