import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/interfaces';
import { NavController } from '@ionic/angular';

const URL = environment.url;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  token: string = null;
  private usuario: Usuario = {};

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private navCtrl: NavController
  ) {}

  login(email: string, password: string) {
    const data = { email, password };

    return new Promise((resolve) => {
      this.http.post(`${URL}/user/login`, data).subscribe(async (res: any) => {
        if (res.ok) {
          await this.guardarToken(res.token);
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  logout() {
    this.token = null;
    this.usuario = null;
    this.storage.clear();
    this.navCtrl.navigateRoot('/login', { animated: true });
  }

  async guardarToken(token: string) {
    this.token = token;
    await this.storage.set('token', token);
    await this.validaToken();
  }

  async cargarToken() {
    this.token = (await this.storage.get('token')) || null;
  }

  registro(usuario: Usuario) {
    return new Promise((resolve) => {
      this.http.post(`${URL}/user/create`, usuario).subscribe(async (res: any) => {
        console.log(res);

        if (res.ok) {
          await this.guardarToken(res.token);
          resolve(true);
        } else {
          this.token = null;
          this.storage.clear();
          resolve(false);
        }
      });
    });
  }

  async validaToken(): Promise<boolean> {
    await this.cargarToken();

    if (!this.token) {
      this.navCtrl.navigateRoot('/login');
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      const headers = new HttpHeaders({
        'x-token': this.token,
      });

      this.http.get(`${URL}/user/`, { headers }).subscribe((res: any) => {
        if (res.ok) {
          this.usuario = res.usuario;
          resolve(true);
        } else {
          this.navCtrl.navigateRoot('/login');
          resolve(false);
        }
      });
    });
  }

  getUsuario() {
    if (!this.usuario._id) {
      this.validaToken();
    }

    // Copiamos el objeto para perder la referencia al mismo
    return { ...this.usuario };
  }

  actualizarUsuario(userToUpdate: Usuario) {
    const headers = new HttpHeaders({
      'x-token': this.token,
    });

    return new Promise<boolean>((resolve) => {
      this.http
        .post(`${URL}/user/update`, userToUpdate, { headers })
        .subscribe((res: any) => {
          if (res.ok) {
            this.guardarToken(res.token);
            resolve(true);
          } else {
            console.log(res.mensaje);
            resolve(false);
          }
        });
    });
  }
}
