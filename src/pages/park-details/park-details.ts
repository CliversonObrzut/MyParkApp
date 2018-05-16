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

@IonicPage()
@Component({
  selector: 'page-park-details',
  templateUrl: 'park-details.html',
})
export class ParkDetailsPage {

  public parkDetails : Park;
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
