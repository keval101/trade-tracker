import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private fireStore: AngularFirestore) { }
  
  signIn(payload: any) {
    return this.auth.signInWithEmailAndPassword(payload.email, payload.password);
  }

  signup(email: string, password: string): Promise<any> {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  storeUserData(uid: string, payload: any) {
    this.fireStore.collection('users').doc(uid).set(payload);
  }

  signOut() {
    return this.auth.signOut();
  }

  // Add method to get the current user token
  getCurrentUserToken() {
    return this.auth.currentUser.then(user => {
      if (user) {
        return user.getIdToken();
      } else {
        return null;
      }
    });
  }

  getCurrentUser() {
    return this.auth.authState;
  }

  // --------------------------------------- Sheet API ---------------------------------------
  getCurrentUserDetail() {
    const userId = localStorage.getItem('userId');
    return this.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this.fireStore.doc<any>(`users/${userId}`).valueChanges();
        } else {
          return null;
        }
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth.authState.pipe(
      map(user => user !== null)
    );
  }
}
