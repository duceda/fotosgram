import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  tempImages: string[] = [];
  post = {
    mensaje: '',
    coords: null,
    posicion: false,
  };
  cargandoGeo: boolean = false;

  constructor(
    private postsSrv: PostsService,
    private route: Router,
    private geolocation: Geolocation,
    private camera: Camera
  ) {}

  async crearPost() {
    const creado = await this.postsSrv.crearPost(this.post);

    this.post = { mensaje: '', coords: null, posicion: false };

    this.tempImages = [];

    if (creado) {
      this.route.navigateByUrl('/main/tabs/tab1');
    }
  }

  getGeo() {
    if (!this.post.posicion) {
      this.post.coords = null;
    } else {
      this.cargandoGeo = true;

      this.geolocation
        .getCurrentPosition()
        .then((resp) => {
          const coords = `${resp.coords.latitude},${resp.coords.longitude}`;
          console.log('GeoLocation: ', coords);
          this.post.coords = coords;
          this.cargandoGeo = false;
        })
        .catch((error) => {
          console.log('Error getting location', error);
          this.cargandoGeo = false;
        });
    }
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.procesarImagen(options);
  }

  searchInGallery() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };

    this.procesarImagen(options);
  }

  procesarImagen(options: CameraOptions) {
    this.camera.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        const img = window.Ionic.WebView.convertFileSrc(imageData);
        console.log(img);

        this.postsSrv.subirImagen(imageData);
        console.log(imageData);
        this.tempImages.push(img);
      },
      (err) => {
        // Handle error
      }
    );
  }
}
