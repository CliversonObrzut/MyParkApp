import { Park } from './park';
import { Rating } from './rating';

export class User {

    id: string;
    userID: string;
    dateCreated: string;
    email: string;
    favouriteParks? : Array<Park> = [];
    name : string;
    imageURL : string;
    ratings?: Array<Rating> = [];

    parseToUserModel(docRef : any) {
        this.id = docRef.id;
        this.userID = this.id;
        this.dateCreated = docRef.data().dateCreated;
        this.email = docRef.data().email;
        this.name = docRef.data().name;
        this.imageURL = docRef.data().imageURL;

        if(docRef.data().favouriteParks != undefined) {
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
    
    addFavoritePark(parkID : string) {
        // todo:
    }

    removeFavoritePark(parkID : string) {
        // todo
    }

    addParkRate(parkID : string, rate : number) {
        // todo:
    }

    removeParkRate(parkID : string) {
        // todo:
    }

    updateParkRate(parkID : string, newRate : number) {
        // todo:
    }
}