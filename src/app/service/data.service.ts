import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private firestore: AngularFirestore) {}
  api: string;

  // --------------------------------------- Trade API ---------------------------------------
  getTrades(): Observable<any> {
    this.setUserId();

    return this.firestore
      .collection(`${this.api}/trades`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  addTrade(payload: any) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/trades`).add(payload);
  }

  updateTrade(tradeId: string, payload: any) {
    this.setUserId();
    return this.firestore
      .collection(`${this.api}/trades`)
      .doc(tradeId)
      .set(payload, { merge: true });
  }

  deleteTrade(tradeId: string) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/trades`).doc(tradeId).delete();
  }

  // --------------------------------------- Add Fund API ---------------------------------------
  getAddFunds(): Observable<any> {
    this.setUserId();
    return this.firestore
      .collection(`${this.api}/add-funds`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  addFund(payload: any) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/add-funds`).add(payload);
  }

  updateFund(fundId: any, payload: any) {
    this.setUserId();
    return this.firestore
      .collection(`${this.api}/add-funds`)
      .doc(fundId)
      .set(payload, { merge: true });
  }

  deleteFund(fundId: string, type: string) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/${type}`).doc(fundId).delete();
  }

  // --------------------------------------- Add Withdrawal Fund API ---------------------------------------
  getWithdrawalFunds(): Observable<any> {
    this.setUserId();
    return this.firestore
      .collection(`${this.api}/withdrawal-funds`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  addWithdrawalFund(payload: any) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/withdrawal-funds`).add(payload);
  }

  updateWithdrawalFund(fundId: any, payload: any) {
    this.setUserId();
    return this.firestore
      .collection(`${this.api}/withdrawal-funds`)
      .doc(fundId)
      .set(payload, { merge: true });
  }

  // --------------------------------------- Sheet API ---------------------------------------
  getSheet(): Observable<any> {
    this.setUserId();

    return this.firestore
      .collection(`${this.api}/sheet`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  addSheet(payload) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/sheet`).add(payload);
  }

  updateSheet(sheetId: string, payload) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/sheet`).doc(sheetId).set(payload, {merge: true});
  }

  deleteSheet(sheetId: string) {
    this.setUserId();
    return this.firestore.collection(`${this.api}/sheet`).doc(sheetId).delete();
  }

  setUserId() {
    const userId = localStorage.getItem('userId');
    this.api = `users/${userId}`
  }

}
