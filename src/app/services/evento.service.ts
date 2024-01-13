import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection,  } from '@angular/fire/compat/firestore';
import { Timestamp, collection, serverTimestamp } from 'firebase/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private itemsCollection: AngularFirestoreCollection<any>;
  constructor(public afs: AngularFirestore) {
    
   }

   getInvitadoCodigo(codigo : string){
    this.itemsCollection = this.afs.collection('invitados');
    this.itemsCollection = this.afs.collection<any>('invitados',ref => ref.where('codigo','==',codigo));
    return this.itemsCollection.valueChanges({idField: 'id'});
  }

  getAll() {
    this.itemsCollection = this.afs.collection<any>('invitados',ref => ref.orderBy('fecha','desc'));
    return this.itemsCollection.valueChanges({idField: 'id'});
  }

  update(data : any): Promise<void>{
    return this.itemsCollection.doc(data.id).update(data);
  }

  create(data : any): any {
    data.codigo = this.getBarCode(data.familia.toString().trim());
    data.mensaje = '',
    data.confirmar = false;
    data.integrantes = [];
    data.fecha = new Date();
    for(let item of data.invitados){
      data.integrantes.push({nombre : item, confirmar : false})
    }
    return this.itemsCollection.add({ ...data });
  }

  delete(id: string): Promise<void> {
    return this.itemsCollection.doc(id).delete();
  }

  private getBarCode(charactersL : string){
    charactersL = charactersL.replaceAll(' ','');

    let result = ''
    //  const charactersL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const charactersN = '0123456789';
      result += charactersL.charAt(Math.floor(Math.random() * charactersL.length));
      result += charactersL.charAt(Math.floor(Math.random() * charactersL.length));
      result += charactersL.charAt(Math.floor(Math.random() * charactersL.length));
      for (let i = 0; i < 3; i++ ) {
        result += charactersN.charAt(Math.floor(Math.random() * charactersN.length));
     }
     return result;

  }
}
