import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DbServiceProvider } from './../../providers/db-service/db-service';
import { UtilsProvider } from '../../providers/utils/utils';
import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
import { HomePage } from '../home/home';
import { Rating } from './../../models/rating';
import { Park } from './../../models/park';
import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public _loginForm: FormGroup;
  private collection : string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _authService : AuthServiceProvider,
    private _dbService : DbServiceProvider,
    private _utils : UtilsProvider,
    private formBuilder : FormBuilder,
    private _platform : Platform) {
      this._loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.email, Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  doLogin() {
    this._authService.getProvidersForEmail(this._loginForm.value.email)
    .then(providers => {
      console.log(providers);
      if(providers.length > 0) {        
        this._authService.emailLogin(this._loginForm.value.email, this._loginForm.value.password)
        .then(() => {
           this.setHomePage("with email and password");
        })
        .catch(() => {
          let providersText : string = ""; 
          providers.forEach(provider => {
            providersText = providersText + " " + provider;
          });
          if(providers.some(p => p === "password")) {
            this._utils.showToast("Invalid Password!");
            console.log("Login attempt with invalid password!");
          }
          else {
            this._utils.showToast("Account created with: "+providersText);
            console.log("Password login attempt for account(s) from: "+providersText);
          }          
        });
      }
      else {
        this._utils.showToast("There is no account for the given email");
        console.log("Invalid email account for login");
      }
    })
    .catch(err => {console.log(err.message)});
  }

  navForget() {
    this.navCtrl.push(ForgetPage);
  }

  navRegister() {
    this.navCtrl.push(RegisterPage);
  }

  doSocialLogin(social: string) {
    if (social == 'google') {
      const provider = new firebase.auth.GoogleAuthProvider()
      this.socialSignIn(provider);
    }
    else if (social == 'facebook') {
      const provider = new firebase.auth.FacebookAuthProvider()
      this.socialSignIn(provider);
    }
    else if (social == 'twitter') {
      const provider = new firebase.auth.TwitterAuthProvider()
      this.socialSignIn(provider);
    }
  }

  socialSignIn(provider : any) {
    console.log("social sign in");
    if (this._platform.is('cordova')) { // if running in a IOS or Android device
      this._authService.getAuth().signInWithRedirect(provider).then(() => {
          this._authService.getAuth().getRedirectResult().then(result => {

          });
      }); // sign in with redirect
    }
    else {
        // It will work only in browser
        console.log("sign in pop up")
        this._authService.getAuth().signInWithPopup(provider).then(result => {
          this.checkParkUser(result);
        });
    }
  }

  checkParkUser(result : any) {
    console.log("checking if park user exists");
    this._dbService.getDocument("Users", this._authService.getUserEmail())
    .then(user => {
      if(user.exists) {
        this.setHomePage("user exists");
      }
      else {
        this.createMyParkUser(result);            
      }
    })
    .catch(err => {
      console.log(err.message)});
  }


  createMyParkUser(result : any) : void {
    this.collection = "Users";
    let email = this._authService.getUserEmail();
    let username : string;
    let imageURL : string;
    let origin : string;
    if(result.credential.providerId == "google.com"){
      username = result.additionalUserInfo.profile.given_name;
      imageURL = result.additionalUserInfo.profile.picture;
      origin = "Google";
    }
    else if(result.credential.providerId = "facebook.com") {
      username = result.additionalUserInfo.profile.first_name;
      imageURL = this._authService.getUserImage();
      origin = "Facebook";
    }
    else if(result.credential.providerId == "twitter.com") {
      username = result.additionalUserInfo.profile.name;
      imageURL = result.additionalUserInfo.profile.profile_image_url;
      origin = "Twitter";
    }

    let user = {
      email: email,
      name: username,
      dateCreated: this._authService.getUserCreationDate(),
      favouriteParks: new Array<Park>(),
      userRatings: new Array<Rating>(),
      imageURL: imageURL
    }
    this.addParkUserDb(user, email, origin);

  }

  addParkUserDb(user : any, email : any, origin : string) {
    this._dbService.addDocument(this.collection,email,user).then(() => {
      this.setHomePage(origin);
    });
  }

  setHomePage(origin : string){
    console.log("User logged in with " + origin);
    this.navCtrl.setRoot(HomePage);
    this._utils.showToast("Logged in successfully!");
  }
}
