import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { IRespuestaPosts, Post } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  paginaPost: number = 0;
  nuevoPost = new EventEmitter<Post>();

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private fileTransfer: FileTransfer
  ) {}

  getPosts(pull: boolean = false) {
    if (pull) {
      this.paginaPost = 0;
    }

    this.paginaPost++;
    return this.http.get<IRespuestaPosts>(
      `${URL}/posts/?pagina=${this.paginaPost}`
    );
  }

  crearPost(post) {
    const headers = new HttpHeaders({
      'x-token': this.usuarioService.token,
    });

    return new Promise((resolve) => {
      this.http
        .post(`${URL}/posts/create`, post, { headers })
        .subscribe((res: any) => {
          console.log(res);

          if (res.ok) {
            this.nuevoPost.emit(res.post);
            resolve(true);
          }
        });
    });
  }

  subirImagen(imagen: string) {
    const options: FileUploadOptions = {
      fileKey: 'image',
      headers: { 'x-token': this.usuarioService.token },
    };

    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer
      .upload(imagen, `${URL}/posts/upload`, options)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log('Error subiendo archivo: ', err);
      });
  }
}
