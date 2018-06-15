import { UtilsProvider } from './utils';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/map';

/**
* Class for the Preloader provider.
* @author Cliverson
* Date: 19/04/2018
* @version 1.0 
*/ 

@Injectable()
export class PreloaderProvider {

  private loading : any;

  constructor(public loadingCtrl: LoadingController,
              private _utils : UtilsProvider){ }

  // displays the preloader for user when the page is loading data
  displayPreloader() : void{
    try {       
      this.loading = this.loadingCtrl.create({
          content: 'Please wait..' // message with the spinner
      });
      this.loading.present(); // show preloader
    }
    catch(e) {
      this._utils.showToast(e);
    }
  }

  // Hides the preloader from the screen
  hidePreloader() : void {
    try {    
      this.loading.dismiss();    
    }
    catch(e) {
      this._utils.showToast(e);
    }
  }
}
