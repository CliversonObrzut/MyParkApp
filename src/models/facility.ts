/**
 * Facility Model for Park facilities
 */
export class Facility {
    id?: string;
    name?: string;
    iconURL? : string;
    imageURL? : string;
    quantity? : string;
    category? : string;
    addedToFilter? : boolean = false;

    parseToFacilityModel(docRef : any) {
        this.id = docRef.id;
        this.name = docRef.data().name;
        this.iconURL = docRef.data().iconURL;
        this.imageURL = docRef.data().imageURL;
        this.category = docRef.data().category;
        this.quantity = docRef.data().quantity;
    }
}