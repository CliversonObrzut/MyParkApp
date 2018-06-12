import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { PreloaderProvider } from './../../providers/utils/preloader';
import { UtilsProvider } from './../../providers/utils/utils';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { DbServiceProvider } from './../../providers/db-service/db-service';
import { Park } from './../../models/park';
import { Comment } from './../../models/comment';
import { User } from './../../models/user';

@IonicPage()
@Component({
  selector: 'page-review-add',
  templateUrl: 'review-add.html',
})
export class ReviewAddPage {

  public park : Park;
  private collection : string;
  public parkComments : Array<Comment>;
  public user : User = new User();
  public addReviewForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder : FormBuilder,
    public _dbService : DbServiceProvider, 
    public _authService : AuthServiceProvider,
    private _utilsService : UtilsProvider,
    private _preloader : PreloaderProvider) {
    this.park = navParams.data;
    this.addReviewForm = this.formBuilder.group({
      review:['', Validators.compose([Validators.required])]
    });
    console.log(this.park);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewAddPage');
    this._preloader.displayPreloader();
    this.loadUserData();
  }

  loadUserData() {
    this.collection = "Users";
    console.log(this._authService.getUserEmail());
    this._dbService.getDocument(this.collection, this._authService.getUserEmail())
    .then(data => {
      console.log(data.data());
      this.user.parseToUserModel(data);
      console.log(this.user);
      this._preloader.hidePreloader();
    })
    .catch(err => {
      console.log("it did not retrieved user data from db");
      console.log(err);
    });
  }

  sendReview() {
    this.collection = "Parks";
    this._dbService.getDocument(this.collection, this.park.id)
    .then(docRef => {
      let newPark : Park = new Park();
      newPark.parseToParkModel(docRef);
      this.park = newPark;
      this.updateParkComments();
    })
    .catch(err => {console.log(err.message)});
  }

  updateParkComments() {
      console.log("user adding comment to park");
      let comment = new Comment();
      comment.comment = this.addReviewForm.value.review;
      comment.name = this.user.name;
      comment.userId = this.user.userID;
      comment.date = new Date().toISOString();
      this.park.comments.push(comment);
      console.log(comment);
      this.addReviewForm.reset();
      this.updateParkCommentsDb(); 
  }

  updateParkCommentsDb(){
    this.collection = "Parks";
    let dataObj = JSON.parse(JSON.stringify(this.park.comments));
    console.log(dataObj);
    let park = {
      comments: dataObj
    }

    this._dbService.updateDocument(this.collection, this.park.id, park)
    .then(()=>{
      this._utilsService.showToast("Review added successfully");
      console.log("Review added to database");
    });
  }

}
