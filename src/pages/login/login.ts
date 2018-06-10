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
    this._authService.emailLogin(this._loginForm.value.email, this._loginForm.value.password)
      .then((user) => {
         this.setHomePage("with email and password");
      })
      .catch(error => {
        this._utils.showToast(error.message+" Social media account?");
        console.log(error.message+" Social media account?");
      });
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
        console.log(this._dbService.isNewUser(credential.additionalUserInfo.profile.email));
        if(this._dbService.isNewUser(credential.additionalUserInfo.profile.email)) {
          this.createMyParkUserFromGoogle(credential);
        }
        else {
          this.setHomePage("with Google1");
        }
      })
      .catch(error => {
        this._utils.showToast("Account email exists but from different provider");
        console.log(error.message)
      });
    } else if (social == 'facebook') {
      this._authService.facebookLogin()
      .then((credential) => {
        if(this._dbService.isNewUser(credential.additionalUserInfo.profile.email)) {
          this.createMyParkUserFromFacebook(credential);
        }
        else {
          this.setHomePage("with Facebook");
        }
      })
      .catch(error => {
        this._utils.showToast("Account email exists but from different provider");
        console.log(error.message)
      });
    } else if (social == 'twitter') {
      this._authService.twitterLogin()
      .then((credential) => {
        if(this._dbService.isNewUser(credential.additionalUserInfo.profile.email)) {
          this.createMyParkUserFromTwitter(credential);
        }
        else{
          this.setHomePage("with Twitter");
        }
      })
      .catch(error => {
        this._utils.showToast("Account email exists but from different provider");
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
      imageURL: credential.additionalUserInfo.profile.picture.data.url
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
