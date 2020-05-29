import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';
import { UiserviceService } from 'src/app/services/uiservice.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewInit {
  @ViewChild('slidePrincipal') slides: IonSlides;

  loginUser = {
    email: 'daniuceda_86@test.com',
    password: '123456',
  };

  registerUser: Usuario = {
    email: 'test1@test.com',
    password: '123',
    nombre: 'Test1',
    avatar: 'av-1.png',
  };

  constructor(
    private usuarioSrv: UsuarioService,
    private navCtrl: NavController,
    private uiSrv: UiserviceService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    console.log(this.slides);
    this.slides.lockSwipes(true);
  }

  async login(fLogin: NgForm) {
    if (fLogin.invalid) {
      return;
    }

    const valido = await this.usuarioSrv.login(
      this.loginUser.email,
      this.loginUser.password
    );

    if (valido) {
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    } else {
      this.uiSrv.mostrarAlerta('Usuario y contraseña incorrectos');
    }
  }

  async registro(fRegistro: NgForm) {
    if (fRegistro.invalid) {
      return;
    }

    const valido = await this.usuarioSrv.registro(this.registerUser);

    if (valido) {
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    } else {
      this.uiSrv.mostrarAlerta('El correo electrónico ya existe.');
    }
  }

  mostrarRegistro() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  mostrarLogin() {
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true);
  }
}
