import { Component, OnInit } from '@angular/core';
import { User } from '../../models/models.model';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.page.html',
  styleUrls: ['./user-edit-profile.page.scss'],
})
export class UserEditProfilePage implements OnInit {

  user = {} as User;
  uid: any;

  cloudFiles = [];
  croppedImage: string;
  percent;
  isUploadStart = false;

  constructor(private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private firestore: AngularFirestore,
    private navCtrl: NavController,
    private auth: AngularFireAuth,
    private camera: Camera,
    private base64: Base64,
    private crop: Crop,
    private storage: AngularFireStorage,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.authService.getUserAuth().subscribe(u => {
      this.uid = u.uid
    })

  }


  ionViewDidEnter() {
    this.getUserById(this.uid);
  }

  async loadCloudFiles(id) {
    let loader = await this.loadingCtrl.create({
      message: "Por favor espere...",
    });

    loader.present();

    try{
    const storageRef = firebase.storage().ref(id)
    storageRef.listAll().then(result => {
      result.items.forEach(async ref => {
        this.cloudFiles.push({
          name: ref.name,
          full: ref.fullPath,
          url: await ref.getDownloadURL(),
          ref: ref
        });
        this.user.photo = await ref.getDownloadURL();
      });
      loader.dismiss(); 
    });
  }
  catch(e){
    loader.dismiss();
    this.showToast(e);
  }
  }

  async getUserById(uid: string) {
    let loader = this.loadingCtrl.create({
      message: "Por favor espere...",

    });
    (await loader).present();



    this.firestore.doc('users/' + uid)
      .valueChanges()
      .subscribe(data => {
        this.user.name = data['name'];
        this.user.photo = data['photo'];
        this.user.address = data['address'];
        this.user.phonenumber = data['phonenumber'];
      });
    (await loader).dismiss();

  }

  chooseImage() {
    let options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.FILE_URI
    };
    this.camera.getPicture(options).then(filePath => {
      this.crop.crop(filePath).then((croppedPath) => {
        this.base64.encodeFile(croppedPath).then(base64Data => {

          let temp = base64Data.substring(34);
          this.croppedImage = 'data:image/jpeg;base64,' + temp;

          setTimeout(() => {
            document.getElementById("image").setAttribute("src", this.croppedImage);
          }, 250);

          this.uploadImage();
        })
      })
    })
  }

  uploadImage() {
    this.isUploadStart = true;
    let task = this.storage.ref(this.uid + "/" + this.uid).putString(this.croppedImage, "data_url");

    task.snapshotChanges().subscribe(snap => {
      this.percent = ((snap.bytesTransferred / snap.totalBytes) * 100).toString().split(".")[0];
      task.then(async () => {
        this.isUploadStart = false;        
        this.loadCloudFiles(this.uid);
        this.showToast('Imagen cargada con éxito');  
   })  
 })
  }


  async updateUser() {
    if (this.formValidation()) {
      let loader = this.loadingCtrl.create({
        message: "Por favor espere...",

      });
      (await loader).present();


      try {
        if(!this.user.photo){
          await this.firestore.doc('users/' + this.uid).update({
          name: this.user.name,
          address: this.user.address,
          phonenumber: this.user.phonenumber          
        });
        }else{
          await this.firestore.doc('users/' + this.uid).update({
            name: this.user.name,
            address: this.user.address,
            phonenumber: this.user.phonenumber,
            photo: this.user.photo          
          });
        }  

      } catch (e) {
        this.showToast(e);
      }

      (await loader).dismiss();
      this.navCtrl.navigateRoot('user-profile');

    }
  }

  formValidation() {
    if (!this.user.name) {
      this.showToast('Introduzca un nombre');
      return false;
    }

    if (!this.user.phonenumber) {
      this.showToast('Introduzca un número de teléfono');
      return false;
    }

    if (this.user.phonenumber.toString().length < 10) {
      this.showToast('Introduzca un número de teléfono válido: El número debe contener 11 dígitos');
      return false;
    }

    if (this.user.phonenumber.toString().length > 10) {
      this.showToast('Introduzca un número de teléfono válido: El número debe contener 11 dígitos');
      return false;
    }

    if (!this.user.address) {
      this.showToast('Introduzca una dirección');
      return false;
    }
    return true;

  }


  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 1500
    }).then(toastData => toastData.present());
  }

}