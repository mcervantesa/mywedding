import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UsersService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userToken: string;
  userData: any; // Save logged in user data
  roleAs: string = "";

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private userService: UsersService, //Service for get User
 
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {

      if (user) {

        console.log("Se verifica el estado");
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user')!);
       
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  // Sign in with email/password
  SignIn(usu: User) {
    return this.afAuth
      .signInWithEmailAndPassword(usu.email, usu.password!)
      .then((result: any) => {

        this.afAuth.authState.subscribe((user) => {
          if (user) {
            //obtiene el usuario y store de base de datos 
            this.userService.getUser(user.uid).subscribe(ru => {
              localStorage.setItem('user1', JSON.stringify(ru));
              localStorage.setItem('ROLE', ru.role);
            
            });
            
            
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }


  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
     
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('user1');
      localStorage.removeItem('store');
      this.router.navigate(['login']);
    });
  }

 

  isAuthenticate():boolean{
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null) ? true : false;
  }

 

  getRole(){
      this.roleAs = localStorage.getItem('ROLE')!;
      return this.roleAs;
  }


}
