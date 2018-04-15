import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the UtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilsProvider {

  constructor(public toastCtrl: ToastController) { }

  showToast(message: string, position?: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position || 'bottom'
    });

    toast.present(toast);
  }

}
