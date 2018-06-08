export class Prohibition {
    id?: string = "";
    name?: string = "";
    iconURL? : string = "";
    restriction? : string = "";
    hiddenRestriction : boolean = true;
    iconAlertURL : string = "https://firebasestorage.googleapis.com/v0/b/mypark-5778d.appspot.com/o/prohibition-ico%2Fprohibited_alert.png?alt=media&token=58ad87a2-1feb-48d2-b0cb-0afc273727cd";

    parseObjToProhibitionModel(docRef : any)
    {
        this.id = docRef.id;
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

