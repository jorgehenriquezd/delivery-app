import { Component, OnInit } from '@angular/core';
import { Platform, AlertController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { NotificationsService } from "./services/notifications.service";
import {AuthService } from "./services/auth.service";
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from "./models/models.model";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  user = {} as User
  newMessage: BehaviorSubject<number>;
  isLogged;
  uid; 
  faTruck = faTruck;
  orders;
  reload: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private onesignal: OneSignal,
    private alertController: AlertController,
    private notifications: NotificationsService,
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore,   
    private auth: AngularFireAuth,
    private loadingCtrl: LoadingController 

  ) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.show();
      this.splashScreen.hide();

      this.authService.getUserAuth().subscribe(u =>{
        this.uid = u.uid         
      })  

      

      setTimeout(() => {
        this.getUserProfile(this.uid)
      }, 2000);

      this.newMessage = this.notifications.newBadgeMessage();

      if (this.platform.is('cordova')) {
        this.setupPush();     
       }

    })
  }

  refresh(){
    this.reload = true;
    this.initializeApp();
    setTimeout(() => {
      this.reload = false;
    }, 3000);
  }

 async getUserProfile(uid: string) {
    let loader = this.loadingCtrl.create({
      message: "Por favor espere...",

    });
    (await loader).present();
    this.firestore.doc('users/' + uid)
      .valueChanges()
      .subscribe(data => {
        this.user.name = data['name']
        this.user.photo = data['photo']        
        this.orders = data['orders']
      });
      (await loader).dismiss();
  }


  async confirmLogOut() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '¿Estás seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout(){
    this.authService.logout();
  }

  setupPush() {

    this.onesignal.startInit('ed9fa51a-e3b7-46ec-9173-d228b686527e', '1084280859692');
    this.onesignal.inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.None);

    this.onesignal.handleNotificationReceived().subscribe(data => {
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;

      if (additionalData.messagecreator) {
        this.newMessage.next(this.newMessage.value + 1);
        this.router.navigate(['chat-user', additionalData.chatId]);      
      }

      if (additionalData.messageuser) {
        this.newMessage.next(this.newMessage.value + 1);
        this.router.navigate(['chat-creator', additionalData.chatId]);
      }


      if (additionalData.userid) {       
        this.router.navigate(['admin-user-profile', additionalData.userid]);
      }

      if (additionalData.delivered) {       
        this.sweetAlert(title,msg)
      }

    });

    this.onesignal.handleNotificationOpened().subscribe(data =>{
      let msg = data.notification.payload.body;
      let title = data.notification.payload.title;
      let additionalData = data.notification.payload.additionalData;

      if (additionalData.delivered) {       
        this.sweetAlert(title,msg)
      }
    })

    this.onesignal.endInit();
  }

  async building() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Módulo en construcción',   
      buttons: [
        {
          text: 'Cerrar',
          handler: () => {
  
          }
        }
      ]
    });

    await alert.present();
  }

  async updateOnWait(){ 

    let loader =  this.loadingCtrl.create({
      message: "Por favor espere...",
  
    });
   (await loader).present();
    try{ 
    this.firestore.collection('users').doc(this.uid).update({
      onWait: false
    }); 
  }catch(e){
    alert(e);
  }
  (await loader).dismiss();

  }
 
  sweetAlert(title, msg){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: title,
      text: msg,
      showConfirmButton: false,
      timer: 2000
    }).then(()=>{
      this.updateOnWait()
    })
  }

}
