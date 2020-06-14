import { NgModule } from '@angular/core';
// import { environment } from '../environments/environment';
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { IonicSelectableModule } from 'ionic-selectable';
import { NgCalendarModule } from 'ionic2-calendar';
// import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
// import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserProfileService } from './services/user-profile.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  
  imports: [
    IonicSelectableModule,
    NgCalendarModule,
    AngularFirestoreModule.enablePersistence(),
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    GooglePlus,
    UserProfileService,
    //AndroidPermissions,
    Geolocation,
    //NativeGeocoder,
    // LocationAccuracy,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
