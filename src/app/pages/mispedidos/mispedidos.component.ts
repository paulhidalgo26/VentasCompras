import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/servicios/firebaseauth.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit, OnDestroy {

  nuevosSuscriber: Subscription;
  entrgadosSuscriber: Subscription;
  pedidos: Pedido[]=[];


  constructor(public menucontroler: MenuController,
    public firestoreService: FirestoreService ,
    public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }
  ngOnDestroy(){

    if (this.nuevosSuscriber) {
      this.nuevosSuscriber.unsubscribe();
    }
    if (this.entrgadosSuscriber) {
      this.entrgadosSuscriber.unsubscribe();
    }
  }


  openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegmet(ev: any){
    const opc=ev.detail.value;
    if (opc==='entregados') {
            this.getPedidosCulminados();
    }
    if (opc==='nuevos') {
           this.getPedidosNuevos();
    }
  }

async getPedidosNuevos(){
console.log('Nuevos');
const uid= await this.firebaseauthService.getUid();
  const path='Clientes/'+ uid+'/pedidos/';
  this.nuevosSuscriber=this.firestoreService.getCollectionQuery<Pedido>(path,'estado','==','enviado').subscribe(res=>{
      if (res.length) {
        this.pedidos=res;
      }
  });
}

async getPedidosCulminados(){
  console.log('Entregados');
  const uid= await this.firebaseauthService.getUid();
    const path='Clientes/'+ uid+'/pedidos/';
    this.entrgadosSuscriber=this.firestoreService.getCollectionQuery<Pedido>(path,'estado','==','entregado').subscribe(res=>{
        if (res.length) {
          this.pedidos=res;
        }
    });
}

}
