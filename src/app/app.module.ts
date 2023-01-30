import { ParticipantListDialogComponent } from './components/participant-list-dialog/participant-list-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { FormsModule } from '@angular/forms';
import { ParticipantExistingNewComponent } from './components/participant-existing-new/participant-existing-new.component';
import { ParticipantSelectorComponent } from './components/participant-selector.component';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalModule } from './components/calendar/calendar.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ParticipantService } from './services/participant.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  declarations: [
    AppComponent,
    ParticipantListComponent,
    ParticipantSelectorComponent,
    ParticipantExistingNewComponent,
    TutorialComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    CalModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [ParticipantService],
  bootstrap: [AppComponent],
})
export class AppModule {}
