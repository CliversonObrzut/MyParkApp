import { Park } from './park';
import { Rating } from './rating';

export class User {

    id: string;
    userID: string;
    dateCreated: Date;
    email: string;
    favoriteParks? : Array<Park>;
    name : string;
    imageURL : string;
    ratings?: Array<Rating>;

    parseToUserModel(docRef : any) {
        this.id = docRef.id;
        this.userID = this.id;
        this.dateCreated = docRef.data().dateCreated;
        this.email = docRef.data().email;
        this.name = docRef.data().name;
        this.imageURL = docRef.data().imageURL;
        this.favoriteParks = docRef.data().FavoriteParks;
        this.ratings = docRef.data().UserRatings;
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