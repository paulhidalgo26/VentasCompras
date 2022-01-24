

import { async } from 'rxjs';
import { Producto} from 'src/app/models';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { FirestorageService } from 'src/app/servicios/firestorage.service';

@Component({
  selector: 'app-set-productos',
  templateUrl: './set-productos.component.html',
  styleUrls: ['./set-productos.component.scss'],
})
export class SetProductosComponent implements OnInit {

  productos: Producto[]=[];
  newProducto: Producto;
  loading: any;
  newProduct= '';
  newfile='';
  enableNewProducto= false;
  private path= 'Productos/';

  constructor(public menucontrol: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
             public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getProductos();
  }

openMenu(){
  console.log('abrir el menu');
  this.menucontrol.toggle('principal');
}

  async guaradarproducto(){
    this.presentLoading();

    const path='Productos';
    const name=this.newProducto.nombre;
    const res= await this.firestorageService.uploadImage(this.newfile, path,name);
    this.newProducto.foto=res;

   this.firestoreService.createDoc(this.newProducto,this.path,this.newProducto.id).then(resp=>{
    this.loading.dismiss();
    this.presentToast('Guaradado con exito');
    }).catch(err=>{
      this.presentToast('error al guardar');
    });
  }


  getProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res=>{
      console.log(res);
     this.productos=res;
    });
  }

  async deleteProducto(producto: Producto){

    const alert = await this.alertController.create({
      cssClass: 'normal',
      header: 'Advertencia',
      message: 'Seguro desea Eliminar <strong>text</strong> este producto',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'normal',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'ok',
          handler: () => {
            console.log('Confirm Okay');
            this.firestoreService.deleteDoc(this.path,producto.id).then(res=>{
              this.presentToast('Eliminado con exito');
              this.alertController.dismiss();
            }).catch(rerror=> {
              this.presentToast('No se pudo eliminar');
            });
          }
        }
      ]
    });
    await alert.present();
}


  nuevo(){
    this.enableNewProducto=true;
    this.newProducto={
      nombre: '',
      precioNormal: null,
      precioReducido: null,
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date(),
    };
  }


  async presentLoading() {
  this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
      duration: 2000
    });
    await this.loading.present();

  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      cssClass: 'normal',
      color:'success',
      message: msg,
      duration: 2000
    });
    toast.present();

  }

  async newimageupload(event: any){

    if(event.target.files && event.target.files[0]){
      this.newfile=event.target.files[0];
      const reader=new FileReader();
      reader.onload=((image)=>{
       this.newProducto.foto= image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);

    }

  }
}
