import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from './../../providers/utils/preloader';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';

import { Park } from '../../models/park';

@IonicPage()
@Component({
  selector: 'page-park-details',
  templateUrl: 'park-details.html',
})
export class ParkDetailsPage {

  public parkDetails : Park;
  constructor(public navParams : NavParams,
    public navCtrl: NavController, 
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    private _utilsService : UtilsProvider,
    private _preloader : PreloaderProvider) {
      this.parkDetails = navParams.data;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkDetailsPage');
    this._preloader.displayPreloader();
    this.loadParkDetails();
    this._preloader.hidePreloader();
  }

  loadParkDetails() {
    this.parkDetails = this.navParams.data;
    console.log(this.parkDetails);
  }

}
