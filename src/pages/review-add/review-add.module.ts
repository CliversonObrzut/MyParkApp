import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewAddPage } from './review-add';

@NgModule({
  declarations: [
    ReviewAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewAddPage),
  ],
})
export class ReviewAddPageModule {}
