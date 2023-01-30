import { ParticipantListDialogComponent } from '../participant-list-dialog/participant-list-dialog.component';
import { CalendarNavigation } from './../../models/calendar-navigation';
import { CalendarQueryResult } from './../../models/calendar-query-result';
import { CalendarAction } from './../../models/calendar-action';
import { ParticipantAvailability } from '../../models/participant-availability';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
  ViewEncapsulation,
  AfterViewInit,
  EventEmitter,
  Output,
  Input,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTitleFormatter,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
} from 'angular-calendar';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { WeekViewHourSegment, WeekViewHourColumn } from 'calendar-utils';
import { fromEvent, pipe, Subject } from 'rxjs';
import { finalize, takeUntil, filter, map } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { MapType } from '@angular/compiler';
import { Participant } from '../../models/participant';
import { ParticipantService } from '../../services/participant.service';
import { createQualifiedName } from 'typescript';
import { OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styleUrls: ['./calendar.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnDestroy {
  @Output() queryEvent = new EventEmitter<CalendarQueryResult>();

  @Input() view: CalendarView;

  @Input() viewDate: Date

  daysInWeek = 7;

  private destroy$ = new Subject();

  weekStartsOn: 0 = 0;

  CalendarAction = CalendarAction;

  chosenCalendarAction: CalendarAction = CalendarAction.Add;

  dragToCreateActive = false;

  refreshl: Subject<any> = new Subject();

  currentUser: Participant;

  events: CalendarEvent[] = [];

  availableDateTimes: Map<String, Set<String>[]> = new Map();

  participantService: ParticipantService;

  constructor(
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    participantService: ParticipantService,
    public dialog: MatDialog
  ) {
    this.participantService = participantService;
  }


  ngOnInit() {
    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 3,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 3,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 5,
      },
    };

    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
        } else {
          this.daysInWeek = 7;
        }
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  refreshView(): void {
    this.refreshl.next();
  }

  selectCurrentUser(participant) {
    console.log('selectCurentUser: ' + participant.name);
    this.currentUser = participant;
    this.refreshView();
  }

  updateViewDate(date){
    console.log("date:" + date);
    this.viewDate.setDate(this.viewDate.getDate() + this.daysInWeek);
    this.refreshView();
  }

  changeCalendarAction(calendarAction){
    this.chosenCalendarAction = calendarAction;
    this.refreshView();
  }

  /**
   * updates Calendar with latest participant availability information
   * @param renderEvent
   */
  renderCalendar(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    if (this.currentUser == null) {
      return;
    }

    //map of (date, times where everyone selected is available)
    let availableTimes: Map<String, number[]> = new Map();
    this.availableDateTimes = new Map();

    let participantAvailabilities = this.participantService.getParticipantAvailabilities(
      this.viewDate,
      null
    );

    //loop through participants and populate availableTimes
    participantAvailabilities.forEach((pa) => {
      if (this.currentUser.id != pa.participantId) {
        let date = pa.startDateTime.toISOString().substring(0, 10);
        let s = this.timeToRowNum(pa.startDateTime.getHours(), pa.startDateTime.getMinutes() == 30);
        let e = this.timeToRowNum(pa.endtDateTime.getHours(), pa.endtDateTime.getMinutes() == 30);

        if (!this.availableDateTimes.has(date)){
          this.availableDateTimes.set(date, Array<Set<String>>(52));
        }

        for (let i = s; i < e; i++) {
          if(this.availableDateTimes.get(date)[i] == undefined) {
            this.availableDateTimes.get(date)[i] =  new Set();
          }
          this.availableDateTimes.get(date)[i].add(pa.participantId);
        }
      }
    });

    //update css for date/times in availableTimes to display as available
    renderEvent.hourColumns.forEach((hourColumn) => {
      let dt = hourColumn.date.toISOString().substring(0, 10);
      let dateTimes = this.availableDateTimes.get(dt);
      if (dateTimes != null) {
        hourColumn.hours.forEach((hour) => {
          hour.segments.forEach((segment) => {
            if (this.availableDateTimes.get(dt)[this.timeToRowNum(segment.date.getHours(), segment.date.getMinutes() == 30)] != undefined){
              let numParticipantsAtTime = this.availableDateTimes.get(dt)[this.timeToRowNum(segment.date.getHours(), segment.date.getMinutes() == 30)].size;
              if(numParticipantsAtTime > 0) {
                segment.cssClass =
                  'bg-purple-' + numParticipantsAtTime;
              }
            }
          });
        });
      }
    });
  }

  timeToRowNum(hours :number, includeHalfHour :boolean){
    return hours * 2 + (includeHalfHour ? 1 : 0);
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {

    console.log("Drag To Create");
    const colors: any = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
    };

    const dragToSelectEvent: CalendarEvent = {
      id: this.currentUser.id + segment.date.toISOString(),
      title: this.getActionStr(this.chosenCalendarAction),
      start: segment.date,
      end: addMinutes(segment.date, 30),
      color: colors.blue,
      meta: {
        tmpEvent: true,
      },
      actions: [
        {
          label: '<i class="fas fa-fw fa-trash-alt"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.removeAvailability(event);
            console.log('Event deleted', event);
          },
        },
      ],
    };

    console.log("viewDate" + this.viewDate);
    this.events.push(dragToSelectEvent);

    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          dragToSelectEvent.title="My Availability"
          this.refreshView();
        }),
        takeUntil(fromEvent(document, 'mouseup')
        )

      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refreshView();
      });
  }

  startDragToCreateTouch(
    segment: WeekViewHourSegment,
    touchStartEvent: TouchEvent,
    segmentElement: HTMLElement
  ) {

    console.log("Drag To Create Touch");
    const colors: any = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
    };

    const dragToSelectEvent: CalendarEvent = {
      id: this.currentUser.id + segment.date.toISOString(),
      title: this.getActionStr(this.chosenCalendarAction),
      start: segment.date,
      end: addMinutes(segment.date, 30),
      color: colors.blue,
      meta: {
        tmpEvent: true,
      },
      actions: [
        {
          label: '<i class="fas fa-fw fa-trash-alt"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.removeAvailability(event);
            console.log('Event deleted', event);
          },
        },
      ],
    };

    console.log("viewDate" + this.viewDate);
    this.events.push(dragToSelectEvent);

    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'touchmove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          dragToSelectEvent.title="My Availability"
          this.refreshView();
        }),
        takeUntil(fromEvent(document, 'touchend')
        )

      )
      .subscribe((touchMoveEvent: TouchEvent) => {
        const minutesDiff = ceilToNearest(
          touchMoveEvent.touches[0].clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            touchMoveEvent.touches[0].clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refreshView();
      });
  }


  startDragToSearch(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const colors: any = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
      },
    };

    const dragToSelectEvent: CalendarEvent = {
      id: this.currentUser.id + segment.date.toISOString(),
      title: this.getActionStr(this.chosenCalendarAction),
      start: segment.date,
      end: addMinutes(segment.date, 30),
      color: colors.blue,
      meta: {
        tmpEvent: true,
      },
    };

    this.events.push(dragToSelectEvent);

    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          console.log("hodor");
          this.dragToCreateActive = false;
          let cqr = new CalendarQueryResult();
          cqr.startDateTime = dragToSelectEvent.start;
          console.log("end: " + dragToSelectEvent.end);

          cqr.endDateTime = dragToSelectEvent.end;
          cqr.participants = this.participantsAvailableDuringThisTime(dragToSelectEvent);
          this.queryEvent.emit(cqr);
          this.events.pop();
          this.openDialog(cqr.participants, cqr.startDateTime, cqr.endDateTime);
          this.refreshView();
          console.log("heres");
        }),
        takeUntil(
          fromEvent(document, 'mouseup')
        )
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refreshView();
      });
  }

  searchParticipants(startDateTime, endDateTime){

    this.participantsAvailableDuringThisTime
  }

  addAvailability(calendarAvailabilty) {
    this.events.push(calendarAvailabilty);
  }

  removeAvailability(calendarAvailabilty) {
    this.events = this.events.filter(
      (availability) => availability !== calendarAvailabilty
    );
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  selectAction(action) {
    this.chosenCalendarAction = action;
  }

  navigateCalendar(action) {
    let nextDateOffset = action == CalendarNavigation.Next ? + this.daysInWeek : - this.daysInWeek;
    console.log("nextDayOffset: " + nextDateOffset);
    this.viewDate.setDate(this.viewDate.getDate() + nextDateOffset);
    this.refreshView();
  }

  getActionStr(action) {
    switch (+action) {
      case CalendarAction.Add:
        return 'Add';
      case CalendarAction.Search:
        return 'Search';
      default:
        return null;
    }
  }

  participantsAvailableDuringThisTime(calendarEvent: CalendarEvent) {
    console.log("in participantsAvailableDuringThisTime");
    let s = this.timeToRowNum(calendarEvent.start.getHours(), calendarEvent.start.getMinutes() == 30);
    console.log("in participantsAvailableDuringThisTimes");
    let e = this.timeToRowNum(calendarEvent.end.getHours(), calendarEvent.end.getMinutes() == 30)
    let date = calendarEvent.start.toISOString().substring(0, 10);
    let result = new Set<Participant>();

    if (this.availableDateTimes.has(date)){
      for (let i = s; i < e; i++) {
        if (this.availableDateTimes.get(date)[i] != undefined) {
          this.availableDateTimes
            .get(date)[i]
            .forEach((pid) => result.add(this.getParticipantById(pid)));
        }
      }
    }
    return Array.from(result);
  }

  getParticipantById(id) {
    let matchedParticipant = null;
    this.participantService.getParticipants().forEach((p) => {
      if (p.id == id) {
        matchedParticipant = p;
      }
    });
    return matchedParticipant;
  }

  openDialog(participants, startDateTime, endDateTime) {
    this.dialog.open(ParticipantListDialogComponent, {
      data: {
        participants: participants,
        startDateTime: startDateTime,
        endDateTime: endDateTime
      }
    });
  }


  // private refresh() {
  //   this.events = [...this.events];
  //   // this.participantAvailabilityMap.set(this.user.id, [...this.participantAvailabilityMap.get(this.user.id)]);
  //   this.cdr.detectChanges();
  // }
}
