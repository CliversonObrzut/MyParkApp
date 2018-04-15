import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { DbServiceProvider } from "../../providers/db-service/db-service";
import { UtilsProvider } from "../../providers/utils/utils";
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private collection : string;
  public documents : any = null;

  constructor(public navCtrl: NavController, 
    private _dbService : DbServiceProvider, 
    private _authService : AuthServiceProvider,
    private _utilsService : UtilsProvider) { }

    ionViewDidEnter() {
      this.getFacilities();
    }
  
    getFacilities() : void {
      this.collection = "Facilities";
      this.getCollection();
    }
  
    getCollection() : void {
      this._dbService.getDocuments(this.collection)
      .then((data) => {
        if(data.length === 0) {
          console.log(this.collection+" collection is empty");
          this.documents = null;
        }
        else {
          this.documents = data;
        }
      })
      .catch(err =>console.log(err))
    }
  
    doLogout() {
      this._authService.signOut()
        .then(() => {
          this._utilsService.showToast('You have been successfully logged out!');
          console.log("User logged out!");
          this.navCtrl.setRoot(LoginPage);
        })
        .catch(err =>console.log(err))
    }
  
    testButton(facility : any) {
      console.log(facility.name+" pressed!");
    }

}
