import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CalendarToolbarComponent } from './calendar-toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarComponent } from './calendar.component';
import { ParticipantService } from '../../services/participant.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ParticipantListDialogComponent } from '../participant-list-dialog/participant-list-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    ParticipantService
  ],
  declarations: [CalendarToolbarComponent, CalendarComponent, ParticipantListDialogComponent],
  exports: [CalendarToolbarComponent, CalendarComponent],
})
export class CalModule {}
