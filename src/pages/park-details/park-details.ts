import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from './../../providers/utils/preloader';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';

import { Park } from '../../models/park';
import { Prohibition } from '../../models/prohibition';
import { Facility } from './../../models/facility';

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
    this.loadFacilityData();
    this.loadProhibitionData();
    console.log(this.parkDetails);
  }

  loadFacilityData()
  {
    let parkFacilities : Array<Facility> = new Array<Facility>();
    this.parkDetails.facilities.forEach(item => {
      let facility : Facility = new Facility();
      console.log(item.id);
      this._dbService.getDocument("Facilities", item.id)
      .then (data => {
        facility.parseToFacilityModel(data);
        facility.quantity = item.quantity;
        parkFacilities.push(facility);
      });
    });
    this.parkDetails.facilities = parkFacilities;
  }

  loadProhibitionData()
  {
    let parkProhibitions : Array<Prohibition> = new Array<Prohibition>();
    console.log(this.parkDetails.prohibitions);
    this.parkDetails.prohibitions.forEach(item => {
      let prohibition : Prohibition = new Prohibition();
      console.log(item.id);
      this._dbService.getDocument("Prohibitions", item.id)
      .then (data => {
        prohibition.parseDocToProhibitionModel(data);
        prohibition.restriction = item.restriction;
        parkProhibitions.push(prohibition);
      });
    });
    this.parkDetails.prohibitions = parkProhibitions;
  }

  viewRestriction(prohibition : any) {
    if(prohibition.hiddenRestriction) {
      prohibition.hiddenRestriction = false;
    }
    else {
      prohibition.hiddenRestriction = true;
    }
  }
}
