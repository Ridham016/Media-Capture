import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Component, OnInit } from '@angular/core';
import { MediaCapture,MediaFile, CaptureError  } from '@awesome-cordova-plugins/media-capture/ngx';
import { Platform } from '@ionic/angular';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import{FileOpener} from '@awesome-cordova-plugins/file-opener/ngx'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  videopath!:string;
  audiopath!:string;
  imagepath!:string;
  mediaObject!: MediaObject;
  videoStatus=false;
  imageStatus=false;
  audioStatus=false;
  blob!: any;
  i=0;
  constructor(
    private mediaCapture: MediaCapture,
    private plt:Platform,
    private ap:AndroidPermissions,
    private http:HTTP,
    private dia:Diagnostic,
    private file: File,
    private fileOpener: FileOpener
    ) {

   }
    permissions = [
    this.ap.PERMISSION.CAMERA,
    this.ap.PERMISSION.READ_EXTERNAL_STORAGE,
    this.ap.PERMISSION.WRITE_EXTERNAL_STORAGE,
    this.ap.PERMISSION.READ_MEDIA_AUDIO,
    this.ap.PERMISSION.READ_MEDIA_VIDEO,
    this.ap.PERMISSION.READ_MEDIA_IMAGE,
    this.ap.PERMISSION.RECORD_AUDIO,
    this.ap.PERMISSION.	ACCESS_FINE_LOCATION,
  ];
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

          }
          else if (res.hasPermission === false) {
            // Permission denied with the "Never ask again" option
            if(this.i===1){
              this.showSettingsRedirect();
            }
            else if(this.i<1){
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

  captureVideo() {
    this.mediaCapture.captureVideo().then(
      (mediaFiles:any) => {
        console.log(mediaFiles);
        if (mediaFiles) {
          this.convertMediaFileToBlob(mediaFiles[0])
          this.videopath = mediaFiles[0].fullPath;
          this.videoStatus = true;
          console.log('Video path:', this.videopath);
        } else {
          console.log('No video captured');
        }
      },
      (error: CaptureError) => {
        console.log('Error capturing video:', error);
      }
    );
  }
  captureAudio() {
    const options = {
      limit: 1, // Limit to capturing one audio file
      duration: 10 // Set the maximum duration of the audio capture in seconds
    };
    this.mediaCapture.captureAudio(options).then(
      (mediaFiles:any) => {
        console.log(mediaFiles);
        if (mediaFiles) {
          this.convertMediaFileToBlob(mediaFiles[0])
          this.audiopath = mediaFiles[0].fullPath;
          this.audioStatus = true;
          console.log('Audio path:', this.audiopath);
        } else {
          console.log('No video captured');
        }
      },
      (error: CaptureError) => {
        console.log('Error capturing video:', error);
      }
    );
  }
  captureImage() {
    this.mediaCapture.captureImage().then(
      (mediaFiles:any) => {
        console.log(mediaFiles);
        if (mediaFiles) {
          this.convertMediaFileToBlob(mediaFiles[0])
          this.imagepath = mediaFiles[0].fullPath;
          this.imageStatus = true;
          console.log('Image path:', this.imagepath);
        } else {
          console.log('No video captured');
        }
      },
      (error: CaptureError) => {
        console.log('Error capturing video:', error);
      }
    );
  }

  playVideo() {

    this.openMediaFile(this.videopath);
    // if (this.videopath && this.videoStatus) {
    //   this.videoPlayer.play(this.videopath).then(() => {
    //     console.log('Video played successfully');
    //   }).catch(err => {
    //     this.videoPlayer.close();
    //     console.log('Error playing video:', err);
    //   });
    // } else {
    //   console.log('No video to play');
    // }
  }
  openMediaFile(fileUrl: string) {
    this.fileOpener.open(fileUrl, this.getFileMimeType(fileUrl))
      .then(() => console.log('File opened successfully'))
      .catch(err => console.error('Error opening file', err));
  }

  getFileMimeType(fileUrl: string): string {
    const extension = this.getFileExtension(fileUrl);
    let mimeType = '';

    // Define the MIME type based on the file extension
    switch (extension) {
      case 'mp4':
        mimeType = 'video/mp4';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'mp3':
        mimeType = 'audio/mpeg';
        break;
      case 'wav':
        mimeType = 'audio/wav';
        break;
      case 'm4a':
        mimeType = 'audio/mp4';
        break;
      // Add more cases for other file types as needed
      default:
        mimeType = 'application/octet-stream';
    }

    return mimeType;
  }
  getFileExtension(fileUrl: string): string {
    const segments = fileUrl.split('.');
    return segments[segments.length - 1].toLowerCase();
  }

  playAudio(){
    this.openMediaFile(this.audiopath);
    // const audioFile = ' file:///storage/emulated/0/Dowmload/file_example_WAV_1MG.wav'; // Specify the path to your audio file

    // this.audiopath=audioFile
      // const audioUrl = this.audiopath;
      // this.mediaObject = this.media.create(this.audiopath);
      // this.mediaObject.play();

  }
 playImage(){
    // try {
    //  this.photoViewer.show(this.imagepath,"load");
    // } catch (error) {
    //   console.log('Error viewing image:', error);
    // }
    this.openMediaFile(this.imagepath);
  }

  convertMediaFileToBlob(mediaFile: MediaFile): void {

    this.file.resolveLocalFilesystemUrl(mediaFile.fullPath).then((fileEntry:any) => {
      fileEntry.file((file:any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
          // Use the blob as needed
          const formData = new FormData();
          formData.append('file',this.blob, mediaFile.name);

          this.http.setHeader('Access-Control-Allow-Origin','https://a816-175-100-133-59.ngrok-free.app/api/','');
          this.http.setDataSerializer('multipart');
          this.http.post('https://a816-175-100-133-59.ngrok-free.app/api/Upload/UploadFile', formData,{})
            .then((response) => {
              console.log(response);
            })
        };
        reader.readAsArrayBuffer(file);
      });
    });
  }

}
