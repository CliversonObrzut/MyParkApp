import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

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
