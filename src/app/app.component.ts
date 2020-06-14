import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserProfileService } from './services/user-profile.service';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public afAuth: AngularFireAuth,
    public router: Router,
    private userService: UserProfileService
  ) {

    this.afAuth.authState.subscribe(user => {
      // if (this.afAuth.auth.currentUser) {
      if (!user) {
        this.router.navigate(["/login"], { replaceUrl: true });
      } else {
        this.userService.getUserProfile(this.afAuth.auth.currentUser.email);
        this.router.navigate(["/profile"], { replaceUrl: true });

    }
  });

    this.initializeApp();
  }


  ngOnInit() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
    });
  }
}
