import { UtilsProvider } from './utils';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import 'rxjs/add/operator/map';

/**
* Class for the Preloader provider.
* @author Cliverson
* Date: 24/04/2018
* @version 1.0 
*/ 

@Injectable()
export class PreloaderProvider {

   private loading : any;

   constructor(public loadingCtrl: LoadingController,
              private _utils : UtilsProvider){ }

   displayPreloader() : void{
     try{
       
      this.loading = this.loadingCtrl.create({
          content: 'Please wait..'
      });
      this.loading.present();

     }catch(e){
      this._utils.showToast(e);
    }

  }



   hidePreloader() : void{
    try{
    
      this.loading.dismiss();
    
    }catch(e){
      this._utils.showToast(e);
    }
   }

}
