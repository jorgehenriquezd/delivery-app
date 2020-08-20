import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";
import { NoAuthGuard } from "./guards/no-auth.guard";

const routes: Routes = [ 
  {
    path: '',
    redirectTo: 'delivery-panel',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [AuthGuard]
  },  
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule), canActivate: [NoAuthGuard]
  },
  {
    path: 'user-sale-detail/:idDate',
    loadChildren: () => import('./pages/user-sale-detail/user-sale-detail.module').then( m => m.UserSaleDetailPageModule)
  },
  {
    path: 'user-edit-profile/:uid',
    loadChildren: () => import('./pages/user-edit-profile/user-edit-profile.module').then( m => m.UserEditProfilePageModule), canActivate: [NoAuthGuard]
  },
  
  {
    path: 'client-data-modal',
    loadChildren: () => import('./pages/client-data-modal/client-data-modal.module').then( m => m.ClientDataModalPageModule), canActivate: [NoAuthGuard]
  }, 
  {
    path: 'delivery-panel',
    loadChildren: () => import('./pages/delivery-panel/delivery-panel.module').then( m => m.DeliveryPanelPageModule), canActivate: [NoAuthGuard]
 
  }, 
  {
    path: 'complete-user-data',
    loadChildren: () => import('./pages/complete-user-data/complete-user-data.module').then( m => m.CompleteUserDataPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
