import { Prohibition } from './prohibition';
import { Contact } from './contact';
import { Comment } from './comment';
import { Address } from "./address";
import { ParkImage } from './park-image';
import { Facility } from './facility';
import { Rating } from './rating';

export class Park {
    id?: string;
    address?: Address = new Address();
    comments? : Array<Comment> = [];
    contact? : Contact;
    description? : string;
    facilities?: Array<Facility>;
    images?: Array<ParkImage>;
    name? : string;
    prohibitions? : Array<Prohibition> = new Array<Prohibition>();
    rating? : Rating;
    parkRating: number = 0;
    starRatingArray : Array<String> = [];
    addedToFavourites : boolean = false;
    userParkRating : number = 0;
    userStarRatingArray : Array<String> = [];
    userRateHidden : boolean = true;

    parseToParkModel(docRef : any) {
        console.log(docRef.data());
        this.id = docRef.id;        
        this.address.parseToAddressModel(docRef.data().address);
        // if(docRef.data().comments != undefined) {
        //     docRef.data().comments.forEach(element => {
        //         let comment : Comment = new Comment();
        //         console.log(comment);
        //         console.log(element);
        //         comment.parseObjToCommentModel(element);
        //         console.log(comment);
        //         this.comments.push(comment);
        //     });
        // }
        // console.log(this.comments);

        this.comments = docRef.data().comments;
        this.contact = docRef.data().contact;
        this.description = docRef.data().description;
        this.facilities = docRef.data().facilities;
        this.images = docRef.data().images;
        this.name = docRef.data().name;

        if(docRef.data().prohibitions != undefined) {
            docRef.data().prohibitions.forEach(element => {
                let prohibition : Prohibition = new Prohibition();
                prohibition.parseObjToProhibitionModel(element);
                this.prohibitions.push(prohibition);
            });
            console.log(this.prohibitions);
        }
        this.rating = docRef.data().rating;
        this.calculateParkRating();
    }

    calculateParkRating()
    {
        if(this.rating.sumOfRateValues == 0 && this.rating.numberOfRatings == 0) {
            this.parkRating = 0;
        }
        else {
            this.parkRating = this.rating.sumOfRateValues / this.rating.numberOfRatings;
        }
        this.updateStarRatingArray();
    }

    updateStarRatingArray() {
        let rat : number;
        if (this.parkRating == 0) {
            rat = 0;
        }
        else {
            rat = (this.rating.sumOfRateValues / (this.rating.numberOfRatings*5))*10;
        }

        let noDecimal : number = 2;
        while(rat - Math.trunc(rat) > 0) {
            rat = rat * 10;
            noDecimal = noDecimal * 10;
        }

        this.starRatingArray = [];
        for(let i:number = 0; i<5; i++) {
            if((rat / noDecimal) <= 0) {
                this.starRatingArray.push("star-outline");
            }
            else if ((rat / noDecimal) > 0 && (rat / noDecimal) < 1) {
                this.starRatingArray.push("star-half");
            }
            else if ((rat / noDecimal) >= 1) {
                this.starRatingArray.push("star");
            }
            if(i != 4) {
                rat = rat-noDecimal;
            }
        }
    }

    updateParkRating() {
        this.calculateParkRating();
        this.updateStarRatingArray();
    }

    updateUserStarRatingArray(rate : number) {
        this.userParkRating = rate;
        this.userStarRatingArray = [];

        for(let i:number = 1; i<=5; i++) {
            if(i <= this.userParkRating) {
                this.userStarRatingArray.push("star");                
            }
            else {
                this.userStarRatingArray.push("star-outline");
            }
        }

    }
}

