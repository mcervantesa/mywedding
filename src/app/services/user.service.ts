import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { doc } from 'firebase/firestore';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private itemsCollection: AngularFirestoreCollection<User>;
  constructor(private afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection('users');
  }

  getUser(id: string) {
    return this.itemsCollection.doc(id).get().pipe(
      map( (user: any) => {
        // console.log(user.data());
        return user.data();
      })
    )
  }

}
