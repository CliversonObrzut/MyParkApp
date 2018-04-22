import { Park } from './park';
import { Rating } from './rating';

export class User {

    userId: string;
    dateCreated: Date;
    email: string;
    favoriteParks? : Array<Park>;
    name : string;
    imageURL : string;
    ratings?: Array<Rating>;

    parseToUserModel(docRef : any) {
        this.userId = docRef.id;
        this.dateCreated = docRef.data().DateCreated;
        this.email = docRef.data().Email;
        this.name = docRef.data().Name;
        this.imageURL = docRef.data().UserImageURL;
        this.favoriteParks = docRef.data().FavoriteParks;
        this.ratings = docRef.data().UserRatings;
    }

    getName() : string {
        return this.name;
    }

    getId() : string {
        return this.userId;
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