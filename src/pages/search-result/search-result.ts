import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PreloaderProvider } from './../../providers/utils/preloader';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';

import { Park } from '../../models/park';
import { Facility } from './../../models/facility';
import { ParkDetailsPage } from './../park-details/park-details';


@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {

  public facilitiesFilterList : Array<Facility> = new Array<Facility>();
  public parksFiltered: Array<Park> = new Array<Park>();

  constructor(public navParams : NavParams,
    public navCtrl: NavController, 
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    private _preloader : PreloaderProvider) {
      this.facilitiesFilterList = navParams.data;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResultPage');
    this._preloader.displayPreloader();
    this.getSearchedParks();
    //this.getUserData();
   
  }

  ionViewCanEnter(){

  }

  getSearchedParks() : void {
    this._dbService.getDocuments("Parks")
    .then((data : any) => {
      console.log(data);
      if(data.length === 0) {
        console.log("Parks collection is empty");
      }
      else { 
        data.forEach(element => {
          console.log(element.data());
          let park : Park = new Park();
          let filterCount = this.facilitiesFilterList.length;
          let parksFacilityCount = 0;
          park.parseToParkModel(element);
          park.facilities.forEach(parkFacility => {
            this.facilitiesFilterList.forEach(filterFacility => {
              if(parkFacility.id == filterFacility.id)
              {
                parksFacilityCount++;
              }
            });
          });
          if(parksFacilityCount == filterCount) {
            this.parksFiltered.push(park);
          }
        });
        this._preloader.hidePreloader();
        console.log(this.parksFiltered);
      }
    })
    .catch(err =>console.log(err))
  }

  getParkDetails (park : Park) {
    this.navCtrl.push(ParkDetailsPage, park);
  }
}
