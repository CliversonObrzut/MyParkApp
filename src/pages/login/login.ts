import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DbServiceProvider } from './../../providers/db-service/db-service';
import { UtilsProvider } from '../../providers/utils/utils';
import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
import { HomePage } from '../home/home';
import { Rating } from './../../models/rating';
import { Park } from './../../models/park';

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
    private formBuilder : FormBuilder) {
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
        .then((user) => {
           this.setHomePage("with email and password");
        })
        .catch(error => {
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
      this._authService.googleLogin()
      .then((credential) => {
        console.log(credential.additionalUserInfo.profile.email);
        this._dbService.getDocument("Users", credential.additionalUserInfo.profile.email)
        .then(user => {
          console.log(user.exists);
          if(user.exists) {
            this.setHomePage("with Google");
          }
          else {
            this.createMyParkUserFromGoogle(credential);            
          }
        })
        .catch(err => {console.log(err.message)});
      })
      .catch(error => {
        //this._utils.showToast("Account email exists but from different provider");
        this._utils.showToast(error.message);
        console.log(error.message)
      });
    } else if (social == 'facebook') {
      this._authService.facebookLogin()
      .then((credential) => {
        this._dbService.getDocument("Users", credential.additionalUserInfo.profile.email)
        .then(user => {
          if(user.exists) {
            this.setHomePage("with Facebook");
          }
          else {
            this.createMyParkUserFromFacebook(credential);            
          }
        })
        .catch(err => {console.log(err.message)});
      })
      .catch(error => {
        //this._utils.showToast("Account email exists but from different provider");
        this._utils.showToast(error.message);
        console.log(error.message)
      });
    } else if (social == 'twitter') {
      this._authService.twitterLogin()
      .then((credential) => {
        this._dbService.getDocument("Users", credential.additionalUserInfo.profile.email)
        .then(user => {
          if(user.exists) {
            this.setHomePage("with Twitter");
          }
          else {
            this.createMyParkUserFromTwitter(credential);            
          }
        })
        .catch(err => {console.log(err.message)});
      })
      .catch(error => {
        //this._utils.showToast("Account email exists but from different provider");
        this._utils.showToast(error.message);
        console.log(error.message)
      });
    }
  }

  createMyParkUserFromGoogle(credential : any) : void {
    this.collection = "Users";
    let email = credential.additionalUserInfo.profile.email;
    let username = credential.additionalUserInfo.profile.given_name;

    let user = {
      email: email,
      name: username,
      dateCreated: this._authService.getUserCreationDate(),
      favouriteParks: new Array<Park>(),
      userRatings: new Array<Rating>(),
      imageURL: credential.additionalUserInfo.profile.picture
    }
    this.addParkUserDb(user, email, "with Google2");

  }

  createMyParkUserFromFacebook(credential : any) : void {
    this.collection = "Users";
    let email = credential.additionalUserInfo.profile.email;
    let username = credential.additionalUserInfo.profile.first_name;

    let user = {
      email: email,
      name: username,
      dateCreated: this._authService.getUserCreationDate(),
      favouriteParks: new Array<Park>(),
      userRatings: new Array<Rating>(),
      imageURL: this._authService.getUserImage()
    }

    this.addParkUserDb(user, email, "with Facebook2");
  }

  createMyParkUserFromTwitter(credential : any) : void {
    this.collection = "Users";
    let email = credential.additionalUserInfo.profile.email;
    let username = credential.additionalUserInfo.profile.name;

    let user = {
      email: email,
      name: username,
      dateCreated: this._authService.getUserCreationDate(),
      favouriteParks: new Array<Park>(),
      userRatings: new Array<Rating>(),
      imageURL: credential.additionalUserInfo.profile.profile_image_url
    }

    this.addParkUserDb(user, email, "with Twitter2");
  }

  addParkUserDb(user : any, email : any, origin : string) {
    this._dbService.addDocument(this.collection,email,user).then(() => {
      this.setHomePage(origin);
    });
  }

  setHomePage(origin : string){
    console.log("User logged in " + origin);
    this.navCtrl.setRoot(HomePage);
    this._utils.showToast("Logged in successfully!");
  }
}
