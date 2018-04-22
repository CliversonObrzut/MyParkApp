import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable()
export class DbServiceProvider {

  private _db : any;

  constructor() {
    this._db = firebase.firestore();
    console.log('Hello DbServiceProvider Provider');
  }

    /*
   * Return documents from specific database collection
   */
  // getDocuments(collectionObj: string) : Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._db.collection(collectionObj).get()
  //     .then((querySnapshot) => {        
  //       let obj : any = [];
  //       querySnapshot.forEach((doc: any) => {
  //         if (collectionObj === "Facilities") {
  //           obj.push({
  //               id             : doc.id,
  //               name           : doc.data().name,
  //               imageURL       : doc.data().imageURL
  //             });
  //           }
  //       });
  //       resolve(obj);
  //     })
  //     .catch((error : any) => {
  //       reject(error);
  //     });
  //   });
  // }

  getDocuments(collectionObj : string) : Promise<any> {
    return this._db.collection(collectionObj).get();
  }
  
  getDocument(collectionObj : string, docID : string) : Promise<any> {
    return this._db.collection(collectionObj).doc(docID).get();
  }

  /**
   * Add a new document to a selected database collection
   */

  addDocument(collectionObj : string,
    docID : string,
    dataObj : any) : Promise<any>{
      return new Promise((resolve, reject) => {
      this._db.collection(collectionObj).doc(docID).set(dataObj)
        .then((obj : any) => {
          resolve(obj);
        })
        .catch((error : any) => {
          reject(error);
        });
      });
  }

  /**
  * Delete an existing document from a selected database collection
  */

  deleteDocument(collectionObj : string,
          docID : string) : Promise<any>{
    return new Promise((resolve, reject) => {
      this._db.collection(collectionObj).doc(docID)
        .delete()
        .then((obj : any) => {
          resolve(obj);
        })
        .catch((error : any) => {
          reject(error);
        });
    });
  }

  /**
  * Update an existing document within a selected database collection
  */

  updateDocument(collectionObj : string,
            docID : string,
            dataObj : any) : Promise<any>{
    return new Promise((resolve, reject) => {
      this._db.collection(collectionObj).doc(docID)
        .update(dataObj)
        .then((obj : any) => {
          resolve(obj);
        })
        .catch((error : any) => {
          reject(error);
        });
    });
  }
}
