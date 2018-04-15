import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { UtilsProvider } from '../../providers/utils/utils';
import { RegisterPage } from '../register/register';
import { ForgetPage } from '../forget/forget';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private _loginForm: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private _authService : AuthServiceProvider,
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
         this._utils.showToast('Logged in successfully!');
         console.log(user.email+" logged in!");
         this.navCtrl.setRoot(HomePage);
      })
      .catch(error => console.log(error));
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
        this.navCtrl.setRoot(HomePage);
        this._utils.showToast("Logged in successfully!");
        console.log(credential.user.email+" logged in successfully!");

      })
      .catch(error => console.log(error));
    } else if (social == 'facebook') {
      this._authService.facebookLogin()
      .then((credential) => {
        this.navCtrl.setRoot(HomePage);
        this._utils.showToast("Logged in successfully!");
        console.log(credential.user.email+" logged in successfully!");
      })
      .catch(error => console.log(error));
    } else if (social == 'twitter') {
      this._authService.twitterLogin()
      .then((credential) => {        
        this.navCtrl.setRoot(HomePage);
        this._utils.showToast("Logged in successfully!");
        console.log(credential.user.email+" logged in successfully!");
      })
      .catch(error => console.log(error));
    }
  }
}
