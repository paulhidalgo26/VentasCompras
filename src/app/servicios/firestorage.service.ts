import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { resolve } from 'dns';
import { promise } from 'protractor';
import { Subscriber } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(public storage: AngularFireStorage) { }

uploadImage(file: any, path: string, nombre: string): Promise<string>{

  // eslint-disable-next-line @typescript-eslint/no-shadow
  return new Promise(resolve=>{
    const filePath = path + '/' + nombre;
    const ref = this.storage.ref(filePath);
    const task = ref.put(file);
    task.snapshotChanges().pipe(
      finalize(() => {
       ref.getDownloadURL().subscribe(res=>{
          const downloadURL=res;
          resolve(downloadURL);
          return;
       });
      })
   )
  .subscribe();
  });
}
}
