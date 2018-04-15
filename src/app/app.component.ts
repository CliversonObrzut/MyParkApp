import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireAuth } from "angularfire2/auth"
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, afAuth : AngularFireAuth) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      const authObserver = afAuth.authState.subscribe(user => {
        if (user) {
          this.rootPage = HomePage;
          authObserver.unsubscribe();
        } else {
          this.rootPage = LoginPage;
          authObserver.unsubscribe();
        }
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

