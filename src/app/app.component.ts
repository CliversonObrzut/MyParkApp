import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UtilsProvider } from './../providers/utils/utils';
import { Storage } from '@ionic/storage'

import { AngularFireAuth } from "angularfire2/auth"
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SearchPage } from './../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { WelcomePage } from './../pages/welcome/welcome';
import { ProfilePage } from './../pages/profile/profile';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  firstRun : boolean = false;
  rootPage:any;
  @ViewChild(Nav) nav : Nav;
  activePage : any;
  pages : Array<{title: string, icon: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen, 
    public afAuth : AngularFireAuth,
    public storage : Storage,
    public _utilsService : UtilsProvider) {
      
      this.pages = [
        { title: 'Home', icon:'home', component: HomePage },
        { title: 'Search', icon:'search', component: SearchPage },
        { title: 'Profile', icon:'heart',component: ProfilePage },
        { title: 'Settings', icon:'contact',component: SettingsPage},
        { title: 'Log out', icon:'log-out', component: LoginPage}       
      ];
      this.activePage = this.pages[0];

      this.storage.ready().then(() => {
        this.storage.get('first_time').then((val) => {
          console.log(val);
          if (val !== null) {
             console.log('Not app first run');
             //this._utilsService.showToast("Not app first run");
          } else {
             console.log('App first run');
             this.firstRun = true;
             this.storage.set('first_time', 'done');
             //this._utilsService.showToast("App first run");
          }

          const authObserver = afAuth.authState.subscribe(user => {
            if (user) {
              this.rootPage = HomePage;
              authObserver.unsubscribe();
            } else {
              if(this.firstRun === true){
                this.rootPage = WelcomePage;
              }
              else {
                this.rootPage = LoginPage;
              }
              authObserver.unsubscribe();
            }
          });

          this.initializeApp();
        });  
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
     })
     .catch((err) => {
       console.log(err.message);
     });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component==LoginPage){
      this.doLogout();
      this.activePage = this.pages[0];
     } 
     else if(page.component == HomePage) {
      this.nav.setRoot(page.component);
      this.activePage = page;
     }
     else{
      this.nav.push(page.component);
      this.activePage = page;
     }
  }

  checkActivePage(page) {
    return page == this.activePage;
  }

  doLogout() {
    this.afAuth.auth.signOut()
      .then(() => {
        this._utilsService.showToast('You have been successfully logged out!');
        console.log("User logged out!");
        this.nav.setRoot(LoginPage);
      })
      .catch(err =>console.log(err))
  }
}

