import { Prohibition } from './prohibition';
import { Contact } from './contact';
import { Comment } from './comment';
import { Address } from "./address";
import { ParkImage } from './park-image';
import { Facility } from './facility';
import { Permission } from './permission';
import { Rating } from './rating';

export class Park {
    parkID?: string;
    address?: Address;
    comments? : Array<Comment>;
    contact? : Contact;
    description? : string;
    facilities?: Array<Facility>;
    images?: Array<ParkImage>;
    name? : string;
    permissions? : Array<Permission>;
    prohibitions? : Array<Prohibition>;
    rating? : Rating;
    parkRating: number = 0;
    starRatingArray : Array<String> = [];

    parseToParkModel(docRef : any) {
        this.parkID = docRef.id;
        this.address = docRef.data().Address;
        this.comments = docRef.data().Comments;
        this.contact = docRef.data().Contact;
        this.description = docRef.data().Description;
        this.facilities = docRef.data().Facilities;
        this.images = docRef.data().Images;
        this.name = docRef.data().Name;
        this.permissions = docRef.data().Permissions;
        this. prohibitions = docRef.data().Prohibitions;
        this.rating = docRef.data().Rating;
        this.calculateParkRating();
    }

    calculateParkRating()
    {
        this.parkRating = this.rating.sumOfRateValues / this.rating.numberOfRatings;
        console.log(this.rating.sumOfRateValues);
        console.log(this.rating.numberOfRatings);
        this.updateStarRatingArray();
    }

    updateStarRatingArray() {
        let rat : number = (this.rating.sumOfRateValues / (this.rating.numberOfRatings*5))*10;
        for(let i:number = 0; i<5; i++) {
            if((rat / 2) <= 0) {
                this.starRatingArray.push("star-outline");
            }
            else if ((rat / 2) > 0 && (rat / 0.2) < 1) {
                this.starRatingArray.push("star-half");
            }
            else if ((rat / 2) >= 1) {
                this.starRatingArray.push("star");
            }
            rat = rat-2;
        }
    }
}

