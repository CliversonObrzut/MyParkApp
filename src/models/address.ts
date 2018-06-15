/**
 * Class for Model Address of Park
 */
export class Address {
    suburb? : string = "";
    fullAddress?: string = "";
    postCode? : string = "";
    state? : string = "";
    street? : string = "";

    /**
     * Converts a document object from Firebase to Address Model object
     * @param docRef 
     */
    parseToAddressModel(docRef : any) {
        this.suburb = docRef.suburb;
        this.fullAddress = docRef.fullAddress;
        this.postCode = docRef.postCode;
        this.state = docRef.state;
        this.street = docRef.street;
    }
}