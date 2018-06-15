import { Park } from './park';
import { Rating } from './rating';

/**
 * User Class Model for holding user information
 */
export class User {

    id: string;
    userID: string;
    dateCreated: Date;
    email: string;
    favouriteParks? : Array<Park> = [];
    name : string;
    imageURL : string;
    ratings?: Array<Rating> = [];

    parseToUserModel(docRef : any) {
        this.id = docRef.id;
        this.userID = this.id;
        this.dateCreated = new Date(docRef.data().dateCreated);
        this.email = docRef.data().email;
        this.name = docRef.data().name;
        this.imageURL = docRef.data().imageURL;

        if(docRef.data().favouriteParks != undefined) {
            this.favouriteParks = [];
            docRef.data().favouriteParks.forEach(element => {
                let park : Park =  new Park();
                park.id = element.id;
                this.favouriteParks.push(park);
            });
        }        

        if(docRef.data().userRatings != undefined) {
            docRef.data().userRatings.forEach(element => {
                let rating : Rating = new Rating();
                rating.parkId = element.parkId;
                rating.rate = element.rate;
                this.ratings.push(rating);
            });
        }
        
    }

    getName() : string {
        return this.name;
    }

    getId() : string {
        return this.id;
    }

    getImage() : string {
        return this.imageURL;
    }
}