/**
 * Rating Class Model for holding Park and User rating information
 */
export class Rating {
    id? : string;
    parkId?: string;
    rate?: number;
    numberOfRatings? : number; 
    sumOfRateValues? : number;
}