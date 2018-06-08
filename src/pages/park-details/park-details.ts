import { Rating } from './../../models/rating';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from './../../providers/utils/preloader';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';

import { Park } from '../../models/park';
import { Prohibition } from '../../models/prohibition';
import { Facility } from './../../models/facility';
import { User } from '../../models/user';

@IonicPage()
@Component({
  selector: 'page-park-details',
  templateUrl: 'park-details.html',
})
export class ParkDetailsPage {

  public parkDetails : Park;
  private collection : string;
  public user : User = new User();

  constructor(public navParams : NavParams,
    public navCtrl: NavController,
    public socialSharing : SocialSharing,
    public _platform : Platform, 
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
    this.loadUserData();
    this.loadFacilityData();
    this.loadProhibitionData();
    console.log(this.parkDetails);
  }

  loadUserData() {
      this.collection = "Users";
      console.log(this._authService.getUserEmail());
      this._dbService.getDocument(this.collection, this._authService.getUserEmail())
      .then(data => {
        console.log("returned user!");
        console.log(data.data());
        this.user.parseToUserModel(data);
        console.log(this.user);
        this.SetUserFavouriteOption();
        this.SetUserRatingOption();
      })
      .catch(err => {
        console.log("it did not retrieved user data from db");
        console.log(err);
      });
  }

  SetUserFavouriteOption(){
    console.log(this.parkDetails.id);
    if(this.user.favouriteParks.some(p => p.id == this.parkDetails.id)) {
      this.parkDetails.addedToFavourites = true;
      console.log("park is a user favourite");
    }
    else {
      this.parkDetails.addedToFavourites = false;
      console.log("parks is not a user favourite");
    }
  }

  SetUserRatingOption() {
    if(this.user.ratings.some(p => p.parkId == this.parkDetails.id)) {
      let rating : Rating = new Rating();
      rating = this.user.ratings.find(r => r.parkId == this.parkDetails.id);
      this.parkDetails.updateUserStarRatingArray(rating.rate);
    }
    else {
      this.parkDetails.updateUserStarRatingArray(0);
    }
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
        console.log("Facilities added correctly");
      })
      .catch(() => {
        this._utilsService.showToast("Facilities did not load");
        console.log("Could not load facilities from database");
      });
    });
    this.parkDetails.facilities = parkFacilities;
  }

  loadProhibitionData()
  {
    let parkProhibitions : Array<Prohibition> = new Array<Prohibition>();
    console.log(this.parkDetails.prohibitions);
    try{
      this.parkDetails.prohibitions.forEach(item => {
        let prohibition : Prohibition = new Prohibition();
        console.log(item.id);
        this._dbService.getDocument("Prohibitions", item.id)
        .then (data => {
          prohibition.parseDocToProhibitionModel(data);
          prohibition.restriction = item.restriction;
          parkProhibitions.push(prohibition);
        })
        .catch(() => {
          this._utilsService.showToast("Prohibitions did not load");
          console.log("Could not load prohibitions from database");
        });
      });
      this.parkDetails.prohibitions = parkProhibitions;
    }
    catch {
      console.log("Error iterating in prohibitions list");
      this._preloader.hidePreloader();
    }
  }

  viewRestriction(prohibition : any) {
    if(prohibition.hiddenRestriction) {
      prohibition.hiddenRestriction = false;
    }
    else {
      prohibition.hiddenRestriction = true;
    }
  }

  doFavourite(parkDetails : Park) {
    if(parkDetails.addedToFavourites) {
      parkDetails.addedToFavourites = false;
      this.removeFavourite();
    }
    else {
      parkDetails.addedToFavourites = true;
      this.addFavourite();
    }
  }

  addFavourite() {

  }

  removeFavourite() {

  }

  openRate(parkDetails : Park) {
    //parkDetails.updateUserStarRatingArray(3);
    if(parkDetails.userRateHidden) {
      parkDetails.userRateHidden = false;
    }
    else {
      parkDetails.userRateHidden = true;
    }
  }

  ratePark(rate : number) {
    this.parkDetails.updateUserStarRatingArray(rate + 1);
    this.updateParkRating(rate + 1);
  }

  removeUserRate() {
    this.parkDetails.updateUserStarRatingArray(0);
    this.updateParkRating(0);
  }

  updateParkRating(rate : number) {
    this.collection = "Parks";
    // this._dbService.getDocument(this.collection,this.parkDetails.id).then(data => {
    //   let newPark : Park = new Park();
    //   newPark.parseToParkModel(data);
    //   console.log("newPark");
    //   console.log(newPark);
    //   this.parkDetails.rating = newPark.rating;
    //   console.log(this.parkDetails.rating);
      // if user rate for this park exists
      if(this.user.ratings.some(r => r.parkId == this.parkDetails.id)) {
        let userRate = this.user.ratings.find(r => r.parkId == this.parkDetails.id);
        let userRateIndex = this.user.ratings.indexOf(userRate);
        console.log(userRateIndex);
        // if user wants to clear any rate for this park, remove from user rates and from park rates
        if(rate == 0){
          console.log("user removing rate for park");
          this.parkDetails.rating.numberOfRatings = this.parkDetails.rating.numberOfRatings - 1;
          this.parkDetails.rating.sumOfRateValues = this.parkDetails.rating.sumOfRateValues - userRate.rate;
          this.user.ratings.splice(userRateIndex,1);
          console.log(this.user.ratings);
        }
        else { // else, update user rates and park rates
          console.log("user updating rate of park");
          this.parkDetails.rating.sumOfRateValues = this.parkDetails.rating.sumOfRateValues - userRate.rate + rate;
          this.user.ratings[userRateIndex].rate = rate;
          console.log(this.user.ratings);
        }
      }
      else { // if user did not rate before, add rate to park and to user ratings
        console.log("user adding rate to park");
        this.parkDetails.rating.numberOfRatings = this.parkDetails.rating.numberOfRatings + 1;
        this.parkDetails.rating.sumOfRateValues = this.parkDetails.rating.sumOfRateValues + rate;
        let rating = new Rating();
        rating.parkId = this.parkDetails.id;
        rating.rate = rate;
        this.user.ratings.push(rating);
        console.log(this.user.ratings);
      }
      console.log(this.parkDetails.rating.numberOfRatings);
      console.log(this.parkDetails.rating.sumOfRateValues);
      this.updateParkRateDb();
      this.updateUserRateDb(rate);
      this.parkDetails.updateParkRating();
    // })
    // .catch((er) =>{console.log(er)});    
  }

  updateParkRateDb(){
    this.collection = "Parks";
    let parkRating = {
      rating: {
        sumOfRateValues: this.parkDetails.rating.sumOfRateValues,
        numberOfRatings: this.parkDetails.rating.numberOfRatings
      }
    }
    this._dbService.updateDocument(this.collection, this.parkDetails.id, parkRating);
  }

  updateUserRateDb(rate: number){
    this.collection = "Users";
    let dataObj = JSON.parse(JSON.stringify(this.user.ratings));
    console.log(dataObj);
    let user = {
      userRatings: dataObj
    }

    this._dbService.updateDocument(this.collection, this.user.email, user);
  }

  // facebook share configuration
  facebookShare(parkDetails : Park) {
    let image : string = parkDetails.images[0].imageURL;
    let url : string = parkDetails.contact.officialWebsite;

    if(this._platform.is("ios")) {
      this.socialSharing.canShareVia('com.apple.social.facebook',null, null, image, url).then(() => {
        this.facebookIosShare(image, url);
      })
      .catch(() => {
        this._utilsService.showToast("Facebook not available");
      });
    }
    else if(this._platform.is("android")) {
      this.socialSharing.canShareVia('com.facebook.katana',null, null, null, url).then(() => {
        this.facebookAndroidShare(url);
      })
      .catch(() => {
        this._utilsService.showToast("Facebook not available!");
      });
    }
    else {
      console.error("Facebook share not available in this platform");
      this._utilsService.showToast("Share not supported in this platform");
    }
  }

  facebookIosShare(image : string, url : string) {
    this.socialSharing.shareViaFacebook(null, image , url).then(() => {
      console.log("shareViaFacebook: Success");
      this._utilsService.showToast("Sharing Success!");
    }).catch((er) => {
      console.error("shareViaFacebook: failed");
      this._utilsService.showToast("Sharing failed!");
    });
  }

  facebookAndroidShare(url : string) {
    this.socialSharing.shareViaFacebook(null, null , url).then(() => {
      console.log("shareViaFacebook: Success");
      this._utilsService.showToast("Sharing Success!");
    }).catch((er) => {
      console.error("shareViaFacebook: failed");
      this._utilsService.showToast("Sharing failed!");
    });
  }

    // Twitter share configuration
    twitterShare(parkDetails : Park) {
      let url : string = parkDetails.contact.officialWebsite;
      let message : string = "Check this Park features! It is awsome!";
  
      if(this._platform.is("ios")) {
        this.socialSharing.canShareVia('com.apple.social.twitter',message, null, null, url).then(() =>  {
          this.twitterSharing(message, url);
        })
        .catch(() =>  {
          this._utilsService.showToast("Twitter not available");
        })
      }
      else if(this._platform.is("android")) {
        this.socialSharing.canShareVia('twitter',message,null,null,url).then(() => {
          this.twitterSharing(message, url);
        })
        .catch(() => {
          this._utilsService.showToast("Twitter not available!");
        });
      }
      else {
        console.error("Twitter share not available in this platform");
        this._utilsService.showToast("Share not supported in this platform");
      }
    }
  
    twitterSharing(message : string, url : string) {
      this.socialSharing.shareViaTwitter(message, null , url).then(() => {
        console.log("shareViaTwitter: Success");
        this._utilsService.showToast("Sharing Success!");
      }).catch((er) => {
        console.error("shareViaTwitter: failed");
        this._utilsService.showToast("Sharing failed!");
      });
    }

    // Instagram share configuration
    instagramShare(parkDetails : Park) {
      let image : string = parkDetails.images[0].imageURL;

      if(this._platform.is("ios")) {
        this.socialSharing.canShareVia('instagram', null, null, image, null).then(() =>  {
          this.instagramSharing(image);
        })
        .catch(() => {
          this._utilsService.showToast("Instagram not available");
        });
      }
      else if(this._platform.is("android")) {
        this.socialSharing.canShareVia('instagram', null, null, image, null).then(() => {
          this.instagramSharing(image);
        })
        .catch(() => {
          this._utilsService.showToast("Instagram not available!");
        });
      }
      else {
        console.error("Instagram share not available in this platform");
        this._utilsService.showToast("Share not supported in this platform");
      }
    }
  
    instagramSharing(image : string) {
        this.socialSharing.shareViaInstagram(null, image).then(() => {
        console.log("shareViaInstagram: Success");
        this._utilsService.showToast("Sharing Success!");
      }).catch((er) => {
        console.error("shareViaInstagram: failed");
        this._utilsService.showToast("Sharing failed!");
      });
    }
}
