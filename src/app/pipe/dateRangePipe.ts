// import { Pipe, PipeTransform } from "@angular/core";

// @Pipe({
//   name: 'dateRangeStr',
//   pure: true
// })
// export class GetMemberShipLevelPipe implements PipeTransform {

//   transform(value: number, args?: any): any {
//     return this.getMemberShipLevel(value);
//   }
//   getMemberShipLevel(startDateTime: Date, endDateTime: date): String{
//     console.info("---getMemberShipLevel---");
//     if(point > 900){
//       return 'Platinum';
//     }else if(point > 700){
//       return 'Gold';
//     }else if(point > 500){
//       return 'Silver';
//     }
//     return 'Basic';
//   }
// }