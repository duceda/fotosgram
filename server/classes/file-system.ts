import { IFileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
  constructor() {}

  guardarImagenTemp(file: IFileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      // Crear carpetas
      const pathUser = this.crearCarpetaUsuario(userId);

      // Nombre Archivo
      const nombreArchivo = this.generarNombre(file.name);

      console.log(`${pathUser}/${nombreArchivo}`);

      // Mover archivo del temp a nuestra carpeta
      file.mv(`${pathUser}/${nombreArchivo}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private generarNombre(nombreFile: string): string {
    const nombreArr = nombreFile.split('.');
    const extension = nombreArr[nombreArr.length - 1];
    const idUnico = uniqid();

    return `${idUnico}.${extension}`;
  }

  private crearCarpetaUsuario(userId: string): string {
    // nodeJS nos devuelve el directorio donde estamos __dirname
    const pathUser = path.resolve(__dirname, '../uploads', userId);
    const pathUserTemp = pathUser + '/temp';
    const existe = fs.existsSync(pathUser);

    if (!existe) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }

    return pathUserTemp;
  }

  public imagenesTempToPost(userId: string) {
    const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
    const pathPosts = path.resolve(__dirname, '../uploads', userId, 'posts');

    if (!fs.existsSync(pathTemp)) {
      return [];
    }

    if (!fs.existsSync(pathPosts)) {
      fs.mkdirSync(pathPosts);
    }

    const imagesTemp = this.obtenerImagenesEnTemp(userId);

    imagesTemp.forEach((imagen) => {
      fs.renameSync(`${pathTemp}/${imagen}`, `${pathPosts}/${imagen}`);
    });

    return imagesTemp;
  }

  private obtenerImagenesEnTemp(userId: string) {
    const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
    return fs.readdirSync(pathTemp) || [];
  }

  public getPhotoUrl(userId: string, img: string): string {
    const pathPhoto = path.resolve(
      __dirname,
      '../uploads',
      userId,
      'posts',
      img
    );

    const existe = fs.existsSync(pathPhoto);

    if (!existe) {
      const defaultImg = path.resolve(__dirname, '../assets/400x250.jpg');
      return defaultImg;
    }

    return pathPhoto;
  }
}
