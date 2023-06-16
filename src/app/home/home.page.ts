import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { Component} from '@angular/core';
import { MediaCapture,MediaFile, CaptureError  } from '@awesome-cordova-plugins/media-capture/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import{FileOpener} from '@awesome-cordova-plugins/file-opener/ngx'
import{Geolocation } from '@awesome-cordova-plugins/geolocation/ngx'
import * as wm from 'watermarkjs';
import * as blobUtil from 'blob-util';
import { LoadingController, Platform } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  videopath!:string;
  audiopath!:string;
  imagepath!:string;
  imagepathcopy!:string;
  videoStatus=false;
  imageStatus=false;
  imagecopyStatus=false;
  audioStatus=false;
  blob!: any;
  longitude:any
  latitude:any
  constructor(
    private mediaCapture: MediaCapture,
    private file: File,
    private fileOpener: FileOpener,
    private Geo:Geolocation,
    private http:HTTP,
    private plt:Platform,
    private loadingController:LoadingController
    ) {

   }

  captureVideo() {
    this.mediaCapture.captureVideo().then(
      (mediaFiles:any) => {
        console.log(mediaFiles);
        if (mediaFiles) {
          // this.convertMediaFileToBlob(mediaFiles[0])
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
          // this.convertMediaFileToBlob(mediaFiles[0])
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
          this.imagepath=mediaFiles[0].fullPath;
          this.imageStatus = true;
          this.convertMediaFileToBlob(mediaFiles[0])
        }
       else {
          console.log('No video captured');
        }
      },
      (error: CaptureError) => {
        console.log('Error capturing IMAGE:', error);
      }
    );
  }

  playVideo() {
    this.openMediaFile(this.videopath);
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
  }
 playImage(){
    this.openMediaFile(this.imagepath);
  }

  convertMediaFileToBlob(mediaFile: MediaFile): void {
    this.imagecopyStatus=true
    this.showLoader();
    this.file.resolveLocalFilesystemUrl(mediaFile.fullPath).then((fileEntry:any) => {
      fileEntry.file((file:any) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          this.blob = new Blob([reader.result as ArrayBuffer], { type: file.type });
          // Use the blob as needed
          const formData = new FormData();
          formData.append('file',this.blob, mediaFile.name);
          console.log('LL before wm',this.latitude,this.longitude);
         await wm([this.blob]).image(wm.text.lowerLeft(this.latitude+'  '+this.longitude, '72px Arial', '#F5A905', 0.8)).then((img: any) => {
            console.log(img.src);
         if(img.src){
            const base64Image = img.src;
            const url = base64Image;

            fetch(url)
              .then(response => response.blob())
              .then(async blobcopy => {
                console.log('fetch blob',blobcopy);
                const fileName = 'image.png'; // Specify the desired file name and extension
                const directory = this.plt.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory; // Choose the appropriate directory based on the platform
                const filePath = directory + fileName;
                this.imagepathcopy=filePath;
                console.log(this.imagepathcopy)
                console.log('blobcopy',blobcopy);
                await this.file.writeFile(directory, fileName, blobcopy, { replace: true }).then((lol) => {
                  if(lol){
                    this.hideLoader();
                    alert('Image saved successfully!');
                  }
                }).catch(err => {
                console.error('Error saving image:', err);
                });
              })
              .catch(error => {
                console.error('Error converting Base64 to Blob:', error);
              });

          }

          })
          .catch((error: any) => {
            console.log(error);
          });
          console.log('location added',this.imagepath)
          // this.http.setHeader('Access-Control-Allow-Origin','https://a816-175-100-133-59.ngrok-free.app/api/','');
          // this.http.setDataSerializer('multipart');
          // this.http.post('https://a816-175-100-133-59.ngrok-free.app/api/Upload/UploadFile', formData,{})
          //   .then((response) => {
          //     console.log(response);
          //   })
        };
        reader.readAsArrayBuffer(file);
      });
    });
  }
  playImagecopy(){
    this.openMediaFile(this.imagepathcopy);
  }

async getloc()
 {
      await this.Geo.getCurrentPosition().then((pos) =>{
            console.log(pos);
            this.latitude=pos.coords.latitude;
            this.longitude=pos.coords.longitude;
            alert(this.latitude+' '+this.longitude);
          }).catch(error=>{
            console.log(error);
          });
 }

 async showLoader() {
  const loading = await this.loadingController.create({
    message: 'loading....',
    translucent:true,
    duration:10
  });
  await loading.present();

}
async hideLoader() {
  const loading = await this.loadingController.getTop();
  if (loading) {
    await loading.dismiss();
  }
}

}
