import { Injectable } from '@angular/core';
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { Badge } from '@ionic-native/badge/ngx';
import { DatePipe } from '@angular/common';



@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private newMessage = new BehaviorSubject(0);

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private platform: Platform,
    private toastCtrl: ToastController,
    private badge: Badge,
    private onesignal: OneSignal,
    private date: DatePipe,
) { }

 newBadgeMessage() {
    return this.newMessage;   
  }


  
adminTopics(){
  this.onesignal.sendTags({
    paypal: 'si',
    mobile: 'si',
    new: 'si'
  });
}


  MessageFromCreator(chatId, photo, name, token, msg){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",      
        "include_player_ids": [token],
        "large_icon": photo,
        "headings": {"en": "Nuevo mensaje de: "+name},
        "contents": {"en": msg},
        "data": {"messagecreator": "1",
                 "chatId": chatId}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }

  MessageFromUser(chatId, photo, name, token, msg){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",      
        "include_player_ids": [token], 
        "large_icon": photo,      
        "headings": {"en": "Nuevo mensaje de: "+name},
        "contents": {"en": msg},
        "data": {"messageuser": "1",
                 "chatId": chatId}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }


  token(){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",      
        "included_segments": ["Active Users"],
        "large_icon":"https://firebasestorage.googleapis.com/v0/b/store-17c3e.appspot.com/o/profile-default.jpg?alt=media&token=4f8da899-9fd5-4894-93de-46f7fe2958bb",
        "headings": {"en": "¡Realiza compras el día de hoy!"},
        "contents": {"en": "sirve"},
        "data": {"setcounter": "1" }        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }
  
  SaleVerify(saleid, token){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",      
        "include_player_ids": [token],
        "headings": {"en": "Pago Verificado"},
        "large_icon": "https://firebasestorage.googleapis.com/v0/b/store-17c3e.appspot.com/o/payment_approve.png?alt=media&token=cf637370-f88f-402f-840b-dbb888d09f83",
        "contents": {"en": "Tu pedido se realizará en breves momentos"},
        "data": {"saleid": saleid}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }

  PayPalSale(saleid, name){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",
        "included_segments": ["Admin"],
        "large_icon": "https://firebasestorage.googleapis.com/v0/b/store-17c3e.appspot.com/o/paypal.png?alt=media&token=aad8df0a-2ae9-4c98-8e38-4faa0e5918a3",
        "headings": {"en": "Nueva compra de: "+name},
        "contents": {"en": "Compra verificada desde PayPal"},
        "data": {"saleid": saleid}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }

  NewUser(id, name){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",
        "included_segments": ["Admin"],
        "large_icon": "https://firebasestorage.googleapis.com/v0/b/store-17c3e.appspot.com/o/new_user.png?alt=media&token=0aeb2a9e-5014-4dc0-bfb1-9bf882ed2d1e",
        "headings": {"en": "¡Nuevo usuario: "+name+"!"},
        "contents": {"en": "Toca para ver su perfíl"},
        "data": {"userid":id}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }
  
  MobileSale(saleid, name){
      
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",
        "included_segments": ["Admin"],
        "large_icon": "https://firebasestorage.googleapis.com/v0/b/store-17c3e.appspot.com/o/icondelivered%2Fdelivery_icon_ready.png?alt=media&token=8e337ed1-1d50-4f6e-a8fd-02a4cefc94b1",
        "headings": {"en": "Nueva compra de: "+name},
        "contents": {"en": "Pago móvil/transferencia pendiente por verificar"},
        "data": {"saleid": saleid}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }



  orderDelivered(token){
        
    fetch("https://onesignal.com/api/v1/notifications", {
      method: 'POST',
      body: JSON.stringify({
        "app_id": "ed9fa51a-e3b7-46ec-9173-d228b686527e",      
        "include_player_ids": [token], 
        "large_icon": "https://firebasestorage.googleapis.com/v0/b/store-17c3e.appspot.com/o/icondelivered%2Fdelivery_icon_ready.png?alt=media&token=8e337ed1-1d50-4f6e-a8fd-02a4cefc94b1",      
        "headings": {"en": "Entrega realizada con éxito"},
        "contents": {"en": "Buen trabajo"},
        "data": {"delivered": "1"}        
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic YmViMGRmNTEtZjFmOS00YzAwLTg4YTEtODVjMDc0NmRiZDhi"
      }
    }).then(res =>{
      res.json();
      console.log('Success:', res);
    })
      .catch(error => console.error('Error:', error));   
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 1500
    }).then(toastData => toastData.present());
  }

  

}






