import { Component, ElementRef, ViewChild } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.html',
  styles: [`
    #purpleshade {
    border-radius: 10%;
    background-image: linear-gradient(to right, #DDA0DD , #8B008B);
    height: 57px;
    width: 100%;
    display:inline-block;
  }

  table { height: 1px; } /* Will be ignored, don't worry. */
  tr { height: 100%; }
  td { height: 100%; }
  td > div { height: 100%; }

  .btn-primary {
    background-color: #3f51b5 !important;
  }
   `]
})

export class TutorialComponent {

  @ViewChild('tutorialModal') tutorialModal: ElementRef;

  showModal(){
    $(this.tutorialModal.nativeElement).modal('show'); 
  }
  
  hideModal(){
    $(this.tutorialModal.nativeElement).modal('hide'); 
  }

}