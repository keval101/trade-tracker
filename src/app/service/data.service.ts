import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private firestore: AngularFirestore) {}

  // --------------------------------------- Trade API ---------------------------------------
  getTrades(): Observable<any> {
    return this.firestore
      .collection('trades')
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
    return this.firestore.collection('trades').add(payload);
  }

  updateTrade(tradeId: string, payload: any) {
    return this.firestore
      .collection('trades')
      .doc(tradeId)
      .set(payload, { merge: true });
  }

  deleteTrade(tradeId: string) {
    return this.firestore.collection('trades').doc(tradeId).delete();
  }

  // --------------------------------------- Add Fund API ---------------------------------------
  getAddFunds(): Observable<any> {
    return this.firestore
      .collection('add-funds')
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
    return this.firestore.collection('addFunds').add(payload);
  }

  updateFund(fundId: any, payload: any) {
    return this.firestore
      .collection('add-funds')
      .doc(fundId)
      .set(payload, { merge: true });
  }

  // --------------------------------------- Add Withdrawal Fund API ---------------------------------------
  getWithdrawalFunds(): Observable<any> {
    return this.firestore
      .collection('withdrawal-funds')
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
    return this.firestore.collection('withdrawal-funds').add(payload);
  }

  updateWithdrawalFund(fundId: any, payload: any) {
    return this.firestore
      .collection('withdrawal-funds')
      .doc(fundId)
      .set(payload, { merge: true });
  }

  // --------------------------------------- Sheet API ---------------------------------------
  getSheet(): Observable<any> {
    return this.firestore
      .collection('sheet')
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
    return this.firestore.collection('sheet').add(payload);
  }

  updateSheet(sheetId: string, payload) {
    return this.firestore.collection('sheet').doc(sheetId).set(payload, {merge: true});
  }
}
