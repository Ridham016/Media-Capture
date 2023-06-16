import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  constructor(
    private plt:Platform,
    private ap:AndroidPermissions,
    private dia:Diagnostic,
  ) {}
  permissions = [
    this.ap.PERMISSION.CAMERA,
    this.ap.PERMISSION.READ_MEDIA_AUDIO,
    this.ap.PERMISSION.READ_MEDIA_VIDEO,
    this.ap.PERMISSION.READ_MEDIA_IMAGES,
    this.ap.PERMISSION.RECORD_AUDIO,
    this.ap.PERMISSION.ACCESS_FINE_LOCATION,
    this.ap.PERMISSION.ACCESS_COARSE_LOCATION,
  ];
  i=0;
   ngOnInit() {
    this.plt.ready().then(() => {
      this.checkPermission();
    });
  }
  checkPermission(){
    console.log(this.i)
    this.ap.requestPermissions(this.permissions)
        .then((res) => {
          console.log(res)
          // Permission granted or already granted
          if (res.hasPermission === true) {
            // Permission denied with the "Never ask again" option
            console.log('Permissions granted');
            this.i=0;
          }
          else if (res.hasPermission === false) {
            // Permission denied with the "Never ask again" option
            if(this.i===1){
              this.showSettingsRedirect();
              this.i=0;
            }
            else if(this.i<2){
              this.i++;
              this.checkPermission();
            }

          }
        });
  }
  showSettingsRedirect() {
    console.log('showSettingsRedirect');
    this.dia.switchToSettings()
    .then(() => {
      console.log('Redirected to app settings');
      this.i=0;
    })
    .catch((err) => {
      console.log('Error opening app settings:', err);
    });
  }

}
