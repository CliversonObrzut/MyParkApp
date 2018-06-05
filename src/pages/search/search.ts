import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Park } from './../../models/park';
import { ParkDetailsPage } from './../park-details/park-details';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  public parksFiltered: Array<Park> = new Array<Park>();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  searchParks(query : string) : any{

  }

  getParkDetails (park : Park) {
    this.navCtrl.push(ParkDetailsPage, park);
  }
}
