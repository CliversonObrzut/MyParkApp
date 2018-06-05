import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { UtilsProvider } from "../../providers/utils/utils";

@IonicPage()
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {
  public forgetForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder : FormBuilder,
    private _authService : AuthServiceProvider,
    private utils : UtilsProvider) {
      this.forgetForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.email, Validators.required])]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }

  doForget() {
    this._authService.resetPassword(this.forgetForm.value.email)
        .then(() => {
            console.log("Reset email sent!")
            this.navCtrl.pop();
            this.utils.showToast('Forgotten Password Email Sent');
        })
        .catch((error) => console.log(error))
  }
}
