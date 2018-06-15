import { Map } from './../../models/map';
import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { PreloaderProvider } from './../../providers/utils/preloader';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';

import { Park } from '../../models/park';
import { Prohibition } from '../../models/prohibition';
import { Facility } from './../../models/facility';
import { User } from '../../models/user';
import { FavouritePark } from './../../models/favourite-park';
import { Rating } from './../../models/rating';
import { ReviewPage } from '../review/review';

declare var google;
let map : any;
let mapData : Map = new Map();

@IonicPage()
@Component({
  selector: 'page-park-details',
  templateUrl: 'park-details.html',
})
export class ParkDetailsPage {

  @ViewChild('map') mapElement : ElementRef;
  //public map : any;
  public parkDetails : Park;
  private collection : string;
  public user : User = new User();
  //public mapData : Map = new Map();

  constructor(public navParams : NavParams,
    public navCtrl: NavController,
    public socialSharing : SocialSharing,
    public _platform : Platform, 
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    private _utilsService : UtilsProvider,
    public _geolocation : Geolocation,
    private _preloader : PreloaderProvider) {
      this.parkDetails = navParams.data;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParkDetailsPage');
    this._preloader.displayPreloader();
    this._platform.ready().then(()=>{
      this.loadMap();
      this.loadParkDetails();
    })
    //this._preloader.hidePreloader();
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
      this._preloader.hidePreloader();
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

  openReviews(){    
    this.navCtrl.push(ReviewPage, this.parkDetails);
  }

  doFavourite() {
    this.updateUserObj();
    this.updateUserFavDb();
    this.updateParkDetailsObj();
  }

  updateParkDetailsObj() {
    if(this.parkDetails.addedToFavourites) {      
      this.parkDetails.addedToFavourites = false;
    }
    else {
      this.parkDetails.addedToFavourites = true;
    }
  }

  updateUserObj() {
    this.collection = "Users";
    if(this.parkDetails.addedToFavourites) {
      let userFav = this.user.favouriteParks.find(f => f.id == this.parkDetails.id);
      let userFavIndex = this.user.favouriteParks.indexOf(userFav);
      console.log(userFavIndex);
      this.user.favouriteParks.splice(userFavIndex,1);
      console.log(this.user.favouriteParks);
    }
    else {
      let park = new Park();
      park.id = this.parkDetails.id;
      this.user.favouriteParks.push(park);
      console.log(this.user.favouriteParks);
    }
  }

  updateUserFavDb(){
    this.collection = "Users";
    let userFavParks = Array<FavouritePark>();
    this.user.favouriteParks.forEach(park => {
      let favPark = new FavouritePark();
      favPark.id = park.id;
      userFavParks.push(favPark);
    });
    let dataObj = JSON.parse(JSON.stringify(userFavParks));
    console.log(dataObj);
    let user = {
      favouriteParks: dataObj
    }
    this._dbService.updateDocument(this.collection, this.user.email, user);
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
    this._dbService.getDocument(this.collection,this.parkDetails.id).then(data => {
      let newPark : Park = new Park();
      newPark.parseToParkModel(data);
      this.parkDetails.rating = newPark.rating;
      // if user rate for this park exists
      if(this.user.ratings.some(r => r.parkId == this.parkDetails.id)) {
        let userRate = this.user.ratings.find(r => r.parkId == this.parkDetails.id);
        let userRateIndex = this.user.ratings.indexOf(userRate);
        // if user wants to clear any rate for this park, remove from user rates and from park rates
        if(rate == 0){
          console.log("user removing rate for park");
          this.parkDetails.rating.numberOfRatings = this.parkDetails.rating.numberOfRatings - 1;
          this.parkDetails.rating.sumOfRateValues = this.parkDetails.rating.sumOfRateValues - userRate.rate;
          this.user.ratings.splice(userRateIndex,1);
        }
        else { // else, update user rates and park rates
          console.log("user updating rate of park");
          this.parkDetails.rating.sumOfRateValues = this.parkDetails.rating.sumOfRateValues - userRate.rate + rate;
          this.user.ratings[userRateIndex].rate = rate;
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
      }
      console.log(this.parkDetails.rating.numberOfRatings);
      console.log(this.parkDetails.rating.sumOfRateValues);
      this.updateParkRateDb();
      this.updateUserRateDb(rate);
      this.parkDetails.updateParkRating();
    })
    .catch((err) =>{console.log(err.message)});    
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

  // mapServiceCallback(results, status) {
  //   console.log(status);
  //   console.log(google.maps.places.PlacesServiceStatus.OK);
  //   if(status == google.maps.places.PlacesServiceStatus.OK){
  //     console.log(results[0].place_id);
  //     let placeId = results[0].place_id;
  //     console.log(results.length);
  //     console.log(placeId);
  //     console.log(mapData);
  //     console.log(map);
  //     let serv = new google.maps.places.PlacesService(map);
  //     console.log(serv);
  //     serv.getDetails({placeId: placeId},(place, status) => {
  //       console.log(status);
  //       console.log(google.maps.places.PlacesServiceStatus.OK)
  //       if(status == google.maps.places.PlacesServiceStatus.OK) {
  //         mapData.parkMapLocation = place;
  //         console.log(mapData.parkMapLocation);
  //         //this.addMarker();
  //       }
  //     });
  //   }
  //   else {
  //     console.log("Status not Ok");
  //   }
  // }

  loadMap() {
    this._geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      mapData.userMapLatLng = latLng;
      let mapOptions = {
        center : latLng,
        zoom : 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      console.log(map);
      
      this.findParkMapPosition();
    })
    .catch((err) => {
      console.log(err);
      this._utilsService.showToast(err.message);
    }); 
  }

  findParkMapPosition(){
    let request = {
      fields: ['formatted_address','name','geometry','id','place_id'],
      query: this.parkDetails.address.fullAddress
    }
    console.log(request);
    let service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if(status == google.maps.places.PlacesServiceStatus.OK){
        mapData.parkMapLocation = results[0].geometry.location;
        console.log(mapData.parkMapLocation);
        this.addParkMarker();
      }
      else {
        console.log("Status not Ok");
      }
    });
  }

  public addParkMarker(){ 
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: mapData.parkMapLocation
    });
    map.setCenter(mapData.parkMapLocation); 
   
    this.addParkInfoWindow(marker);   
  }

  public addParkInfoWindow(marker){
    let place = mapData.parkMapLocation;
    place.name = this.parkDetails.name;
    place.formatted_address = this.parkDetails.address.fullAddress;
    let content : string = "<div><strong>" + place.name + "</strong><br>" +
    place.formatted_address + "</div>";

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });     
  }

  public addUserMarker(){ 
    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      //position: this.map.getCenter()
      position: mapData.userMapLatLng
    });
    map.setCenter(mapData.userMapLatLng); 
   
    this.addUserInfoWindow(marker);   
  }

  public addUserInfoWindow(marker){
    let content : string = "Your current position";

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
   
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });     
  }

  getDirections() {
    
  }
}
