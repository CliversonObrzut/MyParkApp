import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { User } from '../../models/user';
import { DbServiceProvider } from '../../providers/db-service/db-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { PreloaderProvider } from '../../providers/utils/preloader';
import { Park } from '../../models/park';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public user : User = new User();
  private collection : string;
  public userHasFavourites : boolean;
  public favouriteParks : Array<Park>;

  constructor(public navParams : NavParams,
    public navCtrl: NavController,
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    public _platform : Platform,
    private _preloader : PreloaderProvider) {
      
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this._preloader.displayPreloader();
    this._platform.ready().then(()=>{
      this.loadUserData();
    });
  }

  loadUserData() {
    this.collection = "Users";
    console.log(this._authService.getUserEmail());
    this._dbService.getDocument(this.collection, this._authService.getUserEmail())
    .then(data => {
      this.user.parseToUserModel(data);
      this.user.imageURL = this._authService.getUserImage();
      this.loadUserFavourites();
    })
    .catch(err => {
      console.log("it did not retrieved user data from db");
      console.log(err);
    });
  }

  loadUserFavourites() {
    if(this.user.favouriteParks.length == 0){
      this.userHasFavourites = false;
    }
    else {
      this.collection = "Parks";
      let favParks : Array<Park> = new Array<Park>();
      this.userHasFavourites = true;
      this.user.favouriteParks.forEach(favPark => {      
        this._dbService.getDocument(this.collection,favPark.id).then(result => {
          let park : Park = new Park();
          park.parseToParkModel(result);
          favParks.push(park);
        })
        .catch(() => {
          console.log("It could not get a park");
          this.userHasFavourites = false;
        });
      });
      this.favouriteParks = favParks;
      this._preloader.hidePreloader();
    }
  }

  removeFavPark(parkId : string) {
    console.log("removing "+ parkId);
  }
}
