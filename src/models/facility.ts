export class Facility {
    id?: string;
    name?: string;
    iconURL? : string;
    imageURL? : string;
    quantity? : number;
    addedToFilter? : boolean = false;

    parseToFacilityModel(docRef : any) {
        this.id = docRef.id;
        this.name = docRef.data().name;
        //this.iconURL = docRef.data().iconURL;
        this.imageURL = docRef.data().imageURL;
    }
}