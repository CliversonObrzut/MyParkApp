export class Comment {
    comment? : string;
    date? : string;
    dateNotString : Date = new Date();
    userId? : string;
    name? : string;
    noComments : boolean = false;

    // parseObjToCommentModel(docRef : any) {
    //     this.comment = docRef.data().comment;
    //     this.date = docRef.data().date;
    //     this.userId = docRef.data().userId;
    //     this.name = docRef.data().name;
    // }
}

