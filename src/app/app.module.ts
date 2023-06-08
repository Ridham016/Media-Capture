import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MediaCapture} from '@awesome-cordova-plugins/media-capture/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import{VideoPlayer} from '@awesome-cordova-plugins/video-player/ngx';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },FileOpener,HTTP,File,FileTransfer,Media,MediaCapture,AndroidPermissions,Diagnostic,VideoPlayer,PhotoViewer],
  bootstrap: [AppComponent],
})
export class AppModule {}
