import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UtilsProvider } from './../providers/utils/utils';
import { Storage } from '@ionic/storage'

import { AngularFireAuth } from "angularfire2/auth"
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { WelcomePage } from './../pages/welcome/welcome';
import { ProfilePage } from './../pages/profile/profile';

/**
 * Main class of the App
 * @author Cliverson
 * Date: 08/05/2018
 * @version 2.3
 */

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
      
      // object used to render the menu and give the proper navigation between pages
      this.pages = [
        { title: 'Home', icon:'home', component: HomePage },
        { title: 'Profile', icon:'contact',component: ProfilePage },
        { title: 'Settings', icon:'settings',component: SettingsPage},
        { title: 'Log out', icon:'log-out', component: LoginPage}       
      ];
      this.activePage = this.pages[0];

      // read the local storage to identify if it is the first
      // run of the app after installation.
      this.storage.ready().then(() => {
        this.storage.get('first_time').then((val) => {
          console.log(val);
          if (val !== null) {
             console.log('Not app first run');
             //this._utilsService.showToast("Not app first run");
          } else {
            // if the was the first run it will create a register in the local storage
             console.log('App first run');
             this.firstRun = true;
             this.storage.set('first_time', 'done');
             //this._utilsService.showToast("App first run");
          }

          // observer to check if user is authenticated
          const authObserver = afAuth.authState.subscribe(user => {
            if (user) {
              // if user is authenticated return Home page
              this.rootPage = HomePage;
              authObserver.unsubscribe();
            } else {
              // if user is not authenticated and it is first run, it will return Welcome Screen
              if(this.firstRun === true){
                this.rootPage = WelcomePage;
              }
              else {
                // if user is not authenticated and it is not the first run, it will return Login Page
                this.rootPage = LoginPage;
              }
              authObserver.unsubscribe();
            }
          });

          this.initializeApp();
        });  
      });
  }

  /**
   * It removes the splash screen to display the first app page.
   */
  initializeApp() {
    this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
     })
     .catch((err) => {
       console.log(err.message);
     });
  }

  /**
   * Open the given page when selected from the side menu.
   * @param page 
   */
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
      this.activePage = this.pages[0];
     }
  }

  /**
   * Returns if the current page is the active page.
   * @param page 
   */
  checkActivePage(page) {
    return page == this.activePage;
  }

  /**
   * Executes the log out function from the option inside the side menu.
   */
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

