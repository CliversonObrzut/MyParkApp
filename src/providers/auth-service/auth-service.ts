import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from "rxjs/Observable";
import firebase from "firebase";

/**
 * Class for Firebase Firestore database activities
 * @author Cliverson
 * Date: 13/04/2018
 * @version 1.0
 */
@Injectable()
export class AuthServiceProvider {

  public collection : string;
  private user: Observable<firebase.User>;  

  constructor(
    private _authService : AngularFireAuth, 
    private platform : Platform) {
      console.log('Hello AuthServiceProvider Provider');
      this.user = _authService.authState;
  }

  /**
   * Returns if the user is authenticated or not
   */
  isAuthenticated() : boolean {
    if(this.user !== null) {
      return true;
    }
    return false;
  }

  getAuth() {
    return this._authService.auth;
  }
  /**
   * Returns the current user image from Firebase Authentication Service
   */
  getUserImage() : string {
    return this._authService.auth.currentUser.photoURL;
  }

  /**
   * Returns the current user email from Firebase Authentication Service
   */
  getUserEmail() : string {
    return this._authService.auth.currentUser.email;
  }

  /**
   * Returns the creation date of the current user
   */
  getUserCreationDate() : string {
    return this._authService.auth.currentUser.metadata.creationTime;
  }

    /**
   * Returns the creation date of the current user
   */
  getUserName() : string {
    return this._authService.auth.currentUser.displayName;
  }

  /**
   * Selects the Google provider for Login
   */
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  /**
   * Selects the Facebook provider for Login
   */
  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  /**
   * Selects the Twitter provider for Login
   */
  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  /**
   * Executes the Login with the given social account provider
   * @param provider 
   */
  socialSignIn(provider) {
    console.log("social sign in");
    if (this.platform.is('cordova')) { // if running in a IOS or Android device
        console.log("social with cordova");
        this._authService.auth.signInWithRedirect(provider).then(() => {
            this._authService.auth.getRedirectResult().then(result => {
              return result;
            });
        }); // sign in with redirect
    }
    else {
        // It will work only in browser
        return this._authService.auth.signInWithPopup(provider);
    }
  }

  /**
   * Returns the list of registered providers for the given email.
   * If no providers, the list will be empty.
   * @param email 
   */
  getProvidersForEmail(email : string) : Promise<any> {
    return this._authService.auth.fetchProvidersForEmail(email);
  }

  /**
   * Registers users with Email and Password
   * @param email 
   * @param password 
   */
  emailSignUp(email:string, password:string) : Promise<any> {
    return this._authService.auth.createUserWithEmailAndPassword(email, password);
  }
  
  /**
   * Login user with email and password
   * @param email 
   * @param password 
   */
  emailLogin(email:string, password:string) : Promise<any> {
     return this._authService.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Sends an email to user to reset the password
   * @param email 
   */
  resetPassword(email: string) : Promise<void> {
    return this._authService.auth.sendPasswordResetEmail(email);
  }

  /**
   * Signs out the user
   */
  signOut() : Promise<void> {
    return this._authService.auth.signOut();
  }
}
