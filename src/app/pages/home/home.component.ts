import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Producto } from 'src/app/models';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private path ='/Productos/';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  productos: Producto[]=[];

  constructor(public menucontroler: MenuController,
     public firestoreService: FirestoreService ) {

    this.loadProductos();
   }

  ngOnInit() {}

  openMenu(){
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }


  loadProductos(){
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res =>{
     // console.log(res);
      this.productos=res;
    });

  }




}
