import { Prohibition } from './prohibition';
import { Contact } from './contact';
import { Comment } from './comment';
import { Address } from "./address";
import { ParkImage } from './park-image';
import { Facility } from './facility';
import { Permission } from './permission';

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
}

