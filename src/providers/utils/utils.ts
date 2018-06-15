import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

/**
 * Class for the Utils Provider
 * @author Cliverson
 * Date: 19/04/2018
 * @version 1.0
 */

@Injectable()
export class UtilsProvider {

  constructor(public toastCtrl: ToastController) { }

  // Displays a custom toast message for user actions
  showToast(message: string, position?: string) {
    let toast = this.toastCtrl.create({
      message: message, // custom message
      duration: 3000, // 3 seconds
      position: position || 'top' // top of the screen
    });
    toast.present(toast);
  }
}
