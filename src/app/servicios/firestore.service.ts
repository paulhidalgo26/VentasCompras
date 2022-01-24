import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

createDoc(data: any,path: string,id: string){
  const collection=this.database.collection(path);
  return collection.doc(id).set(data);
}


// eslint-disable-next-line @typescript-eslint/naming-convention
getDoc<tipo>(path: string,id: string){
  const collection=this.database.collection<tipo>(path);
  return collection.doc(id).valueChanges();
}

deleteDoc(path: string,id: string){
  const collection=this.database.collection(path);
  return collection.doc(id).delete();
}

updateDoc(data: any,path: string,id: string){
  const collection=this.database.collection(path);
  return collection.doc(id).update(data);
}

getId(){

  return this.database.createId();
}

// eslint-disable-next-line @typescript-eslint/naming-convention
getCollection <tipo>(path: string){
const collection=this.database.collection<tipo>(path);
return collection.valueChanges();

}


// eslint-disable-next-line @typescript-eslint/naming-convention
getCollectionQuery<tipo>(path: string,parametro: string,condicion: any,busqueda: string){
  const collection=this.database.collection<tipo>(path,
    ref=>ref.where(parametro,condicion,busqueda));
  return collection.valueChanges();
  }
}
