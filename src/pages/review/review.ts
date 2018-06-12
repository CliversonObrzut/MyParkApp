import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PreloaderProvider } from './../../providers/utils/preloader';
import { UtilsProvider } from './../../providers/utils/utils';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';
import { ReviewAddPage } from './../review-add/review-add';
import { Park } from './../../models/park';
import { Comment } from './../../models/comment';
import { User } from './../../models/user';

@IonicPage()
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {

  public park : Park;
  private collection : string;
  public parkComments : Array<Comment>;
  public user : User = new User();
  public myDate : string;
  public availableComments : boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    private _utilsService : UtilsProvider,
    private _preloader : PreloaderProvider) {
    this.park = navParams.data;
    console.log(this.park);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
    this._preloader.displayPreloader();
    this.loadUserData();
  }

  OpenReviewAddPage() {
    this.navCtrl.push(ReviewAddPage);
  }

  loadUserData() {
    this.collection = "Users";
    console.log(this._authService.getUserEmail());
    this._dbService.getDocument(this.collection, this._authService.getUserEmail())
    .then(data => {
      console.log(data.data());
      this.user.parseToUserModel(data);
      console.log(this.user);
      this.loadParkReviews();
    })
    .catch(err => {
      console.log("it did not retrieved user data from db");
      console.log(err);
    });
  }

  loadParkReviews() {
    this.collection = "Parks";
    this._dbService.getDocument(this.collection, this.park.id)
    .then(docRef => {
      let park : Park = new Park();
      park.parseToParkModel(docRef);
      console.log(park);
      this.parkComments = park.comments;
      console.log(this.parkComments);
      console.log(this.parkComments.length);
      if(this.parkComments.length == 0) {
        this.availableComments = false;
        this._utilsService.showToast("No reviews! Be the first to add one!");
      }
      else {
        this.availableComments = true;
        console.log(this.availableComments);
        this.parkComments.forEach(comment => {
          comment.dateNotString = new Date(comment.date);
        })
        console.log(this.parkComments);
        this.parkComments = park.comments.sort((obj1, obj2) => {
          if(obj1.dateNotString > obj2.dateNotString){
            return 1;
          }
          if(obj2.dateNotString < obj2.dateNotString){
            return -1;
          }
          return 0;
        });
        console.log(this.parkComments);
        this.parkComments.forEach(comment => {
          comment.date = this.convertToDisplayFormat(comment.dateNotString);
        });
        console.log(this.parkComments);
      }
      this._preloader.hidePreloader();
    })
    .catch(err => {console.log(err.message)});
  }

  convertToDisplayFormat(date : Date) : string {
    let month : string = date.toLocaleDateString("en-au", {month: "short"});
    let dateString = month.replace(/\./g, "");
    dateString = dateString + ", " + date.getDate();
    dateString = dateString + " " + date.getFullYear();
    dateString = dateString + " " + date.getHours();
    dateString = dateString + ":" + date.getMinutes();
    return dateString;
  }
}
