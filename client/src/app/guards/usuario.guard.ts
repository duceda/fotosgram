import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioGuard implements CanLoad {
  constructor(private usuarioSrv: UsuarioService) {}

  canLoad() {
    return this.usuarioSrv.validaToken();
  }
}
