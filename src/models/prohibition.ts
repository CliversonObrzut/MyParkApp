export class Prohibition {
    id?: string = "";
    name?: string = "";
    iconURL? : string = "";
    restriction? : string = "";
    hiddenRestriction : boolean = true;
    iconAlertURL : string = "https://firebasestorage.googleapis.com/v0/b/mypark-5778d.appspot.com/o/prohibition-ico%2Fprohibited_alert.gif?alt=media&token=494ceb79-3c74-40f0-abf1-c3159c5b7a2d";

    parseObjToProhibitionModel(docRef : any)
    {
        this.id = docRef.name;
        this.name = docRef.name;
        this.iconURL = docRef.iconURL;
        this.restriction = docRef.restriction;
    }

    parseDocToProhibitionModel(docRef : any)
    {
        this.id = docRef.id;
        this.name = docRef.data().name;
        this.iconURL = docRef.data().iconURL;
        this.restriction = docRef.data().restriction;
    }
}

