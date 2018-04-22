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
    }
}

