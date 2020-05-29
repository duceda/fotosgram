import { Response, Router } from 'express';
import { verificaToken } from '../middlewares/autentication';
import { Post } from '../models/post.model';
import { IFileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const POST_ROUTES = Router();
const FILESYSTEM = new FileSystem();

POST_ROUTES.post('/prueba', [verificaToken], (req: any, res: Response) => {
  res.json({ ok: true, mensaje: 'Post service funciona bien' });
});

// OBTENER POSTS PAGINADOS
POST_ROUTES.get('/', async (req: any, res: Response) => {
  let pagina = Number(req.query.pagina) || 1;
  let skip = pagina - 1;
  skip = skip * 10;

  // Obtenemos todos los post ordenados por id de forma descendente y solo los últimos 10
  const posts = await Post.find()
    .sort({ _id: -1 })
    .limit(10)
    .populate('usuario', ['-password'])
    .skip(skip)
    .exec();

  res.json({ ok: true, pagina, posts });
});

// CREAR POSTS
POST_ROUTES.post('/create', [verificaToken], (req: any, res: Response) => {
  const body = req.body;
  body.usuario = req.usuario._id;

  const images = FILESYSTEM.imagenesTempToPost(req.usuario._id);
  body.imgs = images;

  Post.create(body)
    .then(async (postDB) => {
      // Para poblar el objeto de usuario al completo dentro de la response
      // '-password' es para no enviar la contraseña dentro del objeto usuario
      await postDB.populate('usuario', '-password').execPopulate();
      res.json({ ok: true, postDB });
    })
    .catch((err) => {
      res.json(err);
    });
});

// SERVICIO PARA SUBIR ARCHIVOS
POST_ROUTES.post(
  '/upload',
  [verificaToken],
  async (req: any, res: Response) => {
    if (!req.files) {
      return res
        .status(400)
        .json({ ok: false, message: 'No se subió ningún archivo' });
    }

    console.log;
    const file: IFileUpload = req.files.image;

    if (!file) {
      return res
        .status(400)
        .json({ ok: false, message: 'No se subió ningún archivo - image' });
    }

    if (!file.mimetype.includes('image')) {
      return res
        .status(400)
        .json({ ok: false, message: 'Solo se pueden subir imágenes' });
    }

    await FILESYSTEM.guardarImagenTemp(file, req.usuario._id);

    return res.status(200).json({ ok: true, file: file.mimetype });
  }
);

POST_ROUTES.get('/imagen/:userId/:img', (req: any, res: Response) => {
  const userId = req.params.userId;
  const img = req.params.img;

  const pathPhoto = FILESYSTEM.getPhotoUrl(userId, img);

  res.sendFile(pathPhoto);
});

export default POST_ROUTES;
