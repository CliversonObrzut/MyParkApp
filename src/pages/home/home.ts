import { Rating } from './../../models/rating';
import { Park } from './../../models/park';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DbServiceProvider } from "../../providers/db-service/db-service";
import { PreloaderProvider } from './../../providers/utils/preloader';
import { SearchResultPage } from '../search-result/search-result';
import { Facility } from './../../models/facility';
import { User } from './../../models/user';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private collection : string;
  public documents : any;
  public userModel : User = new User();
  public facilitiesModel : Array<Facility> = new Array<Facility>();
  public filterList: Array<Facility> = [];
  public selectedFacilities : string;

  constructor(public navCtrl: NavController, 
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    private _preloader : PreloaderProvider) {
    }

    ionViewDidLoad(){
      this._preloader.displayPreloader();
      this.checkParkUser();
      this.getFacilities();
      this.updateSelectedFacilitiesText();
      this._preloader.hidePreloader();
    }
    
    checkParkUser() {
      this._dbService.getDocument("Users", this._authService.getUserEmail())
      .then(user => {
        if(!user.exists) {
          this.createMyParkUser();
        }
        else {
          this._preloader.hidePreloader();
          this.getUserData();
        }
      })
      .catch(err => {
        console.log(err.message)});
    }  
  
    createMyParkUser() : void {
      this.collection = "Users";
      let email = this._authService.getUserEmail();
      let username = this._authService.getUserName();
      let imageURL = this._authService.getUserImage();
  
      let user = {
        email: email,
        name: username,
        dateCreated: this._authService.getUserCreationDate(),
        favouriteParks: new Array<Park>(),
        userRatings: new Array<Rating>(),
        imageURL: imageURL
      }
      this.addParkUserDb(user, email);
  
    }
  
    addParkUserDb(user : any, email : any) {
      this._dbService.addDocument(this.collection,email,user).then(() => {
        console.log("park user created");
        this.getUserData();
      });
    }

    getUserData() : void {
      this.collection = "Users";
      console.log(this._authService.getUserEmail());
      this._dbService.getDocument(this.collection, this._authService.getUserEmail())
      .then(data => {
        console.log(data.data());
        this.userModel.parseToUserModel(data);
        console.log(this.userModel);
      })
      .catch(err => {
        console.log(err.message);
      });
    }

    getFacilities() : void {
      this._dbService.getDocuments("Facilities")
      .then((data: any) => {
        if(data.length === 0) {
          console.log("Facilities collection is empty");
        }
        else {
          data.forEach(document => {
            let facility : Facility = new Facility();
            facility.parseToFacilityModel(document);
            console.log(facility);
            if(facility.category == "activity") {
              this.facilitiesModel.push(facility);
            }            
          });
          console.log("Data collected!");
          console.log(this.facilitiesModel);
        }
      })
      .catch(err =>console.log(err))
    }
  
    selectFacility(facility : Facility) {
      let listItemIndex : number = undefined;
      this.filterList.forEach((item : Facility, index : number) => {
        if(facility.id === item.id)
          listItemIndex = index;
      });
      if (facility.addedToFilter) {
        this.removeFromFilter(facility, listItemIndex);
      }
      else {
        this.addToFilter(facility);
      }
      console.log(this.filterList);
    }

    addToFilter(facility : any) {
      facility.addedToFilter = true;
      this.filterList.push(facility);
      this.updateSelectedFacilitiesText();
      console.log(facility.name+ " added to filter");
    }

    removeFromFilter(facility : any, index : number) {
      facility.addedToFilter = false;
      this.filterList.splice(index, 1);
      this.updateSelectedFacilitiesText();
      console.log(facility.name+ " removed from filter");
    }

    updateSelectedFacilitiesText() {
      if(this.filterList.length == 0) {
        this.selectedFacilities = "Nothing Selected!";
      }
      else {
        this.selectedFacilities = "Selected: ";
        this.filterList.forEach(element => {
          if(this.filterList.length-1 == this.filterList.indexOf(element)) {
            this.selectedFacilities += element.name;
          }
          else {
            this.selectedFacilities += element.name+", ";
          }
        });
      }
    }
  
    search() {
      this.navCtrl.push(SearchResultPage, this.filterList);
      console.log("searched pressed!");
    }
}
