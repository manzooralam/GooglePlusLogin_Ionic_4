import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/services/user-profile.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
 userDetails ={}
  constructor(private prfService: UserProfileService, public afAuth: AngularFireAuth,
    private router: Router,    private googlePlus: GooglePlus    ) { }

  ngOnInit() {
      this.prfService.userProfile.subscribe(prf=>{
        this.userDetails = prf
      })
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']).then(() => {
        this.googlePlus.logout();
      });
    });
  }
}
