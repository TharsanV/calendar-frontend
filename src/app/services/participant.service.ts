import { addDays } from 'date-fns';
import { ParticipantAvailability } from './../models/participant-availability';
import { Participant } from "../models/participant";
import * as moment from 'moment';

export class ParticipantService {

  participants: Participant[] = [];
  participantAvailabilities: ParticipantAvailability[] = [];
  startDateOfWeek: Date;

  constructor(){
    let krissan = new Participant();
    krissan.name = "Krissan";
    krissan.id = "1";
    let mathuson = new Participant();
    mathuson.name = "Mathuson";
    mathuson.id = "2";
    let tharsan = new Participant();
    tharsan.name = "Tharsan";
    tharsan.id = "3";
  
    this.participants = [krissan, mathuson, tharsan]

    this.startDateOfWeek = moment().startOf('week').toDate();

    for (var p of this.participants){
      this.participantAvailabilities = [...this.participantAvailabilities,...this.generateRandomAvailabilityForWeek(p, this.startDateOfWeek)];
    }
  }

  getParticipants(){
    return this.participants;
  }

  addParticipant(p: Participant){
    p.id = (this.participants.length + 1).toString();
    this.participantAvailabilities = [...this.participantAvailabilities,...this.generateRandomAvailabilityForWeek(p, this.startDateOfWeek)];
    return this.participants.push(p);
  }

  getParticipantAvailabilities(startDate: Date, endDate: Date){
    return this.participantAvailabilities;
  }

  generateRandomAvailabilityForWeek(participant: Participant, startDate: Date){
    let result: ParticipantAvailability[] = [];
    for (let i = 0; i <= 7; i++) {
      let pa = new ParticipantAvailability();
      pa.participantId = participant.id;
      pa.startDateTime = new Date(startDate);
      pa.startDateTime.setDate(pa.startDateTime.getDate() + i);
      let randTime = this.getRandomTimeBetween9to5();
      pa.startDateTime.setHours(randTime);
      pa.endtDateTime = new Date(pa.startDateTime);
      pa.endtDateTime.setHours(randTime + 2);
      result.push(pa);
    } 
    return result;
  }

  getRandomTimeBetween9to5() {
    return Math.floor(Math.random() * 8) + 9;
  }
  
}