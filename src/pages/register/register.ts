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
    let email = this.registerForm.value.email;
    let username = this.registerForm.value.username;

    let user = {
      email: email,
      name: username,
      dateCreated: this._authService.getUserCreationDate(),
      favouriteParks: new Array<Park>(),
      ratings: new Array<Rating>(),
      imageURL: "https://i.pinimg.com/originals/0e/ca/cf/0ecacf1245c5e8c723414ea1a19407cf.jpg"
    }

    this._dbService.addDocument(this.collection,email,user);
  }
}
