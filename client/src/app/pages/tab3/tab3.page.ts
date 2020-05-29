import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/interfaces';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { UiserviceService } from 'src/app/services/uiservice.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  usuario: Usuario = {};

  constructor(
    private usuarioSrv: UsuarioService,
    private uiSrv: UiserviceService,
    private postsSrv: PostsService
  ) {}

  ngOnInit() {
    this.usuario = this.usuarioSrv.getUsuario();
  }

  async actualizar(formActualizar: NgForm) {
    if (formActualizar.invalid) {
      return;
    }

    const actualizado = await this.usuarioSrv.actualizarUsuario(this.usuario);

    if (actualizado) {
      this.uiSrv.mostrarToast('Usuario actualizado correctamente');
    } else {
      this.uiSrv.mostrarToast('El usuario no se ha actualizado correctamente');
    }
  }

  logout() {
    this.usuarioSrv.logout();
    this.postsSrv.paginaPost = 0;
  }
}
