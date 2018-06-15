import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

/**
 * Class for Firebase Firestore database activities
 * @author Cliverson
 * Date: 13/04/2018
 * @version 1.0
 */

@Injectable()
export class DbServiceProvider {

  private _db : any;

  constructor() {
    this._db = firebase.firestore();
    console.log('Hello DbServiceProvider Provider');
  }

  /**
   * Get the reference to a specific user inside the Users collection
   */    
  getUserReference(userDoc : string) {
    return this._db.collection("Users").doc(userDoc);
  }

  /**
   * Get all the documents from a given collection
   */
  getDocuments(collectionObj : string) : Promise<any> {
    return this._db.collection(collectionObj).get();
  }
  
  /**
   * Get a specific document from a given collection
   */
  getDocument(collectionObj : string, docID : string) : Promise<any> {
    return this._db.collection(collectionObj).doc(docID).get();
  }

  /**
   * Get the current timestamp from the Firebase server
   */
  getCurrentTimestamp() {
    return this._db.FieldValue.serverTimestamp();
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
