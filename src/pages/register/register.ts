import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { UtilsProvider } from "../../providers/utils/utils";
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public registerForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder : FormBuilder,
    private _authService : AuthServiceProvider,
    private utils : UtilsProvider) {
      this.registerForm = this.formBuilder.group({
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
        this.utils.showToast('User created successfully!');
        console.log(user.email+" account created successfully!")
        this.navCtrl.setRoot(HomePage);
      })
      .catch(error => console.log(error));
  }
}
