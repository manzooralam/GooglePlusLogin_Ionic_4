import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Subject } from 'rxjs';
import { async } from '@angular/core/testing';
@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  userProfile = new Subject<any>();
  constructor(private Afs: AngularFirestore,
    private user: AngularFireAuth) {
    // this.userEmail = this.user.auth.currentUser.email;
  }
  async getUserProfile(email) {
    await this.Afs.collection('Employees').doc(email).get().toPromise().then(async doc => {
      if (doc.exists) {
        this.userProfile.next(doc.data())
      } else {
        this.userProfile.next(false)
      }
    })
  }
}
