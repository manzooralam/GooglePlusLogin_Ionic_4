import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserProfileService } from 'src/app/services/user-profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user$: Observable<any>;
  validUser: boolean;

  constructor(private afAuth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private platform: Platform,
    private router: Router,
    private afs: AngularFirestore,
    public loadingController: LoadingController,
    private prfService :UserProfileService
  ) {
  }

  async presentLoading(loading) { // needed for loading module
    return await loading.present();
  }


  ngOnInit() {


  }

  googleLogin() { //Checks if user is using phone or web
    // console.log(this.platform.platforms());
    // if (this.platform.is('cordova') && !(this.platform.is("tablet") && this.platform.is('mobile') && this.platform.is('hybrid') )) {

    if (this.platform.is('cordova'))
      this.nativeGoogleLogin();

    else
      this.webGoogleLogin(); // googleLogin() should have only this fun call when deployed on web

  }

  async nativeGoogleLogin(): Promise<void> { // for phone-google login

    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    this.presentLoading(loading);
    try {

      const user = await this.googlePlus.login({
        'scopes': '', // optional - space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': environment.googleWebClientId, // optional - clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true, // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      })


      this.validUser = this.validateEmail(user.email);

      if (this.validUser) {
        const firebaseUser = await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken));
     await  this.updateUserData(firebaseUser);
        const loading = await this.loadingController.create({
          message: 'Please wait...',
        });

     await  this.presentLoading(loading);
        this.router.navigate(["/profile"], { replaceUrl: true });
        loading.dismiss();
      }

      else {
        this.googlePlus.logout();
        alert('Use Google Plus accounts only!');
      }
    } catch (err) {
      if (err == 7) {
        alert('Please connect to the Internet!');
      }
      else
        return;
    }
  }

  validateEmail(googleUserEmail) { //Regular Expression to validate email belonging to ThinkTac/ISPF
    var email = googleUserEmail;
    //   regexp = new RegExp('^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(thinktac.com|ispf.ngo)$'),
    //   test: boolean = regexp.test(email);
    // return test;
    return true
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      // provider.setCustomParameters({ hd: 'thinktac.com' });
      provider.setCustomParameters({ hd: 'gmail.com' });

      const authUser = await this.afAuth.auth.signInWithPopup(provider);
      const userDetails = {
        uid: authUser.user.uid,
        displayName: authUser.user.displayName,
        email: authUser.user.email,
        photoURL: authUser.user.photoURL,
      }

   await this.updateUserData(userDetails);
      this.router.navigate(["/profile"], { replaceUrl: true });


    } catch (err) {
      console.log('Error: ' + err)
    }
  }

  private async updateUserData(firebaseUser) { //Writing user auth data from firebase to firestore collection
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`Employees/${firebaseUser.email}`);
   
    const firstTimeUser = {
      Uid: firebaseUser.uid,
      PhotoURL: firebaseUser.photoURL,
      EmailID: firebaseUser.email,
      Name: firebaseUser.displayName,
    }
      await userRef.set(firstTimeUser, { merge: true }).then(()=>{
        this.prfService.getUserProfile(firstTimeUser.EmailID);
      })
   
  }
}