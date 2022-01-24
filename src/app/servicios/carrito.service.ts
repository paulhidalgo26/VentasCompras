/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { Cliente, Pedido, Producto, ProductoPedido } from '../models';
import { FirebaseauthService } from './firebaseauth.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {



private pedido: Pedido;
// eslint-disable-next-line @typescript-eslint/member-ordering
pedido$ = new Subject<Pedido>();
// eslint-disable-next-line @typescript-eslint/member-ordering
path='carrito/';
// eslint-disable-next-line @typescript-eslint/member-ordering
uid='';
// eslint-disable-next-line @typescript-eslint/member-ordering
cliente: Cliente;

// eslint-disable-next-line @typescript-eslint/member-ordering
carritoSuscriber: Subscription;
// eslint-disable-next-line @typescript-eslint/member-ordering
clienteSuscriber: Subscription;

  constructor(public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    public router: Router) {

      this.initCarrito();
    this.firebaseauthService.stateauth().subscribe(res=>{
      if (res !== null) {
        this.uid=res.uid;
        this.loadCliente();

      }
    });

   }

  loadCarrito(){
    const path='Clientes/' + this.uid +'/'+'carrito';
    this.firestoreService.getDoc<Pedido>(path,this.uid).subscribe(res=>{
      console.log(res);
      if (res) {

        this.pedido=res;
        this.pedido$.next(this.pedido);

      }else{
        this.initCarrito();
      }



    });
  }
  initCarrito(){
    this.pedido={
      id:this.uid,
      cliente:this.cliente,
      productos:[]=[],
      precioTotal: null,
      estado:'enviado',
      fecha: new Date(),
      valoracion: null,
    };
    this.pedido$.next(this.pedido);
  }


  loadCliente(){

      const path='Clientes';
       this.firestoreService.getDoc<Cliente>(path,this.uid).subscribe(res=>{
        this.cliente=res;
        this.loadCarrito();
      });

  }

  getCarrito(): Observable<Pedido> {

  setTimeout(()=>{
    this.pedido$.next(this.pedido);
  },100);
  return this.pedido$.asObservable();


  }

  addProducto(producto: Producto){
    if (this.uid.length) {
      const item= this.pedido.productos.find(productoPedido=>{
          return(productoPedido.producto.id===producto.id);
});
      if (item !==undefined) {
        item.cantidad ++;
      }else{
        const add: ProductoPedido={
            cantidad: 1,
            producto,
        };

        this.pedido.productos.push(add);
      }
    }else{
        this.router.navigate(['/perfil']);
        return;
    }
    this.pedido$.next(this.pedido);
    console.log('app pedido ',this.pedido);
    const path='Clientes/' + this.uid +'/'+this.path;
    this.firestoreService.createDoc(this.pedido,path,this.uid).then(()=>{
      console.log('añadido con exito');
    });
  }

  removeProducto(producto: Producto){
    if (this.uid.length) {
      let pocision=0;
      const item= this.pedido.productos.find((productoPedido , index)=>{
          pocision=index;
          return(productoPedido.producto.id===producto.id);
      });
      if (item !==undefined) {
        item.cantidad --;
        if (item.cantidad===0) {
          this.pedido.productos.splice(pocision, 1);
        }
        console.log('app remove pedido ',this.pedido);
        const path='Clientes/' + this.uid +'/'+this.path;
        this.firestoreService.createDoc(this.pedido,path,this.uid).then(()=>{
          console.log('removido  con exito');
        });
      }
  }
}

  realizarPedido(){

  }
  clearCarrito(){

    const path='Clientes/' + this.uid +'/'+'carrito';
    this.firestoreService.deleteDoc(path,this.uid).then(()=>{
      this.initCarrito();
    });

  }
}
