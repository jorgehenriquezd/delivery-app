import { Product } from '../../models/models.model'; 
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController} from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NotificationsService } from 'src/app/services/notifications.service';


@Component({
  selector: 'app-user-sale-detail',
  templateUrl: './user-sale-detail.page.html',
  styleUrls: ['./user-sale-detail.page.scss'],
})
export class UserSaleDetailPage implements OnInit {

  cart: Product[] = [];
  idDate: any;  
  sales: any;
  date: any;
  hour: any;
  total: any;
  content: any;
  client: any;
  dolarTotal: any;
  img: any;
  uid: any;
  role: any;
  roleAdmin = 'admin';
  token: any;
  revisionSale = 'En Revisión'
  status:any;
  delivered: any;
  done = 'Si';

  deliveryId;
  deliveryToken;
  constructor(private actRoute: ActivatedRoute,       
    private alertCtrl: AlertController,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private iab: InAppBrowser,
    private notifications: NotificationsService) { 
      this.uid = this.auth.auth.currentUser.uid;
      this.idDate = this.actRoute.snapshot.paramMap.get('idDate');

    }

  ngOnInit() {
    this.getSaleById();  
       
  }

  ionViewDidEnter(){
   this.getUserRole(this.uid); 
   this.getDeliveryToken(this.deliveryId);
  }

  payment(url) {
    this.iab.create(url);
  }


  async confirmVerify(id, token) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Quieres verificar esta compra?',
      message: '<div class="ion-text-justify">El pago de esta compra será verificado para completar el pedido del cliente</div>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'         
        }, {
          text: 'Aceptar',
          handler: () => {
            this.verfifySale(id, token)
          }
        }
      ]
    });

    await alert.present();
  }


  verfifySale(id, token) {
    this.firestore.collection('sales').doc(id).update({
      status: 'Verificada'
    })
   this.notifications.SaleVerify(id, token)
    this.showToast('La venta ha sido verificada, ya puedes completar el pedido del cliente');   
  }

  saleDelivered(id) {
    this.firestore.collection('sales').doc(id).update({
      delivered: 'Si'
    })
    this.notifications.orderDelivered(this.deliveryToken)
    this.showToast('Gracias por comprar'); 
  }

  async confirmDelivered(id) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Ya recibiste tu pedido?',
      message: 'Confirma si ya recibiste tu pedido.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'         
        }, {
          text: 'Recibido',
          handler: () => {
            this.saleDelivered(id);
          }
        }
      ]
    });

    await alert.present();
  }
  
  getUserRole(uid: string) {
    this.firestore.doc('roles/' + uid)
      .valueChanges()
      .subscribe(data => {
        this.role = data['role']
      });
  }

  getDeliveryToken(uid: string) {
    this.firestore.doc('users/' + uid)
      .valueChanges()
      .subscribe(data => {
        this.deliveryToken = data['token']
      });
  }

  async getSaleById(){
   
   this.firestore.collection('sales').doc(this.idDate)  
   .valueChanges()
   .subscribe(data => {
    this.date = data['date'];
    this.client = data['client'];
    this.cart = data['products'];
    this.total = data['total'];
    this.token  = data['token'];
    this.dolarTotal = data['dolarTotal'];
    this.img = data['img'];
    this.status = data['status'];
    this.delivered = data['delivered'];
    this.deliveryId = data['delivery']
    this.content = data; 
   });
  
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 1500
    }).then(toastData => toastData.present());
  }


}