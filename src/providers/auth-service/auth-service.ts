import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from "rxjs/Observable";
import firebase from "firebase";

@Injectable()
export class AuthServiceProvider {

  private user: Observable<firebase.User>;  

  constructor(private _authService : AngularFireAuth, 
    private platform : Platform) {
    console.log('Hello AuthServiceProvider Provider');
        this.user = _authService.authState;
  }

  isAuthenticated() : boolean {
    if(this.user !== null) {
      return true;
    }
    return false;
  }

  getUserImage() : string {
    return this._authService.auth.currentUser.photoURL;
  }

  getUserEmail() : string {
    return this._authService.auth.currentUser.email;
  }

  getUserCreationDate() : string {
    return this._authService.auth.currentUser.metadata.creationTime;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.socialSignIn(provider);
  }

  facebookLogin() {
    const provider = new firebase.auth.FacebookAuthProvider()
    return this.socialSignIn(provider);
  }

  twitterLogin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    return this.socialSignIn(provider);
  }

  private socialSignIn(provider) {
    if (this.platform.is('cordova')) {
        return this._authService.auth.signInWithRedirect(provider);
    }
    else {
        // It will work only in browser
        return this._authService.auth.signInWithPopup(provider);
    }
  }

  // Email / Password Registration
  emailSignUp(email:string, password:string) : Promise<any> {
    return this._authService.auth.createUserWithEmailAndPassword(email, password);
  }
  
  // Email / Password Authentication //
  emailLogin(email:string, password:string) : Promise<any> {
     return this._authService.auth.signInWithEmailAndPassword(email, password);
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) : Promise<void> {
    return this._authService.auth.sendPasswordResetEmail(email);
  }

  // Sign Out
  signOut() : Promise<void> {
    return this._authService.auth.signOut();
  }
}
