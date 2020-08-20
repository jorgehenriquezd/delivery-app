import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSaleDetailPageRoutingModule } from './user-sale-detail-routing.module';

import { UserSaleDetailPage } from './user-sale-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSaleDetailPageRoutingModule
  ],
  declarations: [UserSaleDetailPage]
})
export class UserSaleDetailPageModule {}
