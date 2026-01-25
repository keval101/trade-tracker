import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { map, switchMap, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage) { }
  
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

  // Update user profile data in Firestore
  updateUserProfile(userId: string, payload: any): Promise<void> {
    return this.fireStore.collection('users').doc(userId).update(payload);
  }

  // Update email in Firebase Auth
  updateEmail(newEmail: string): Promise<void> {
    return this.auth.currentUser.then(user => {
      if (user) {
        return user.updateEmail(newEmail);
      } else {
        throw new Error('No user logged in');
      }
    });
  }

  // Upload profile picture to Firebase Storage
  uploadProfilePicture(file: File, userId: string): Observable<string> {
    const filePath = `profile-pictures/${userId}/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            observer.next(url);
            observer.complete();
          }, error => {
            observer.error(error);
          });
        })
      ).subscribe();
    });
  }

  // Delete old profile picture from Storage
  deleteProfilePicture(imageUrl: string): Promise<void> {
    if (imageUrl && imageUrl.includes('firebasestorage.googleapis.com')) {
      return this.storage.storage.refFromURL(imageUrl).delete();
    }
    return Promise.resolve();
  }
}
