import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DbServiceProvider } from './../../providers/db-service/db-service';
import { UtilsProvider } from "../../providers/utils/utils";
import { HomePage } from '../home/home';
import { Park } from './../../models/park';
import { Rating } from './../../models/rating';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public registerForm: FormGroup;
  private collection : string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder : FormBuilder,
    private _authService : AuthServiceProvider,
    private _dbService : DbServiceProvider,
    private utils : UtilsProvider) {
      this.registerForm = this.formBuilder.group({
        username:[''],
        email: ['', Validators.compose([Validators.email, Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  doRegister() {
    this._authService.emailSignUp(this.registerForm.value.email, this.registerForm.value.password)
      .then((user) => {
        this.createMyParkUser();
        this.utils.showToast('User created successfully!');
        console.log(user.email+" account created successfully!")
        this.navCtrl.setRoot(HomePage);
      })
      .catch(error => {
        console.log(error);
        this.utils.showToast("Email address already in use");
      });
  }

  createMyParkUser(){
    this.collection = "Users";
    let email = this._authService.getUserEmail();
    let username = this.registerForm.value.username;
    let user = {
      email: email,
      name: username,
      dateCreated: this._authService.getUserCreationDate(),
      favouriteParks: new Array<Park>(),
      ratings: new Array<Rating>(),
      imageURL: "https://firebasestorage.googleapis.com/v0/b/mypark-5778d.appspot.com/o/default_avatar.jpg?alt=media&token=143941e1-520c-46c1-bb53-e7c6aa7e1225"
    }
    this._dbService.addDocument(this.collection,email,user);
  }
}
