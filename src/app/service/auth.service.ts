import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth) { }
  
  signIn(payload: any) {
    return this.auth.signInWithEmailAndPassword(payload.email, payload.password);
  }
}
