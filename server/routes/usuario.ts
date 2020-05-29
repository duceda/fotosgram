import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autentication';
import { Usuario } from '../models/usuario.model';

const USER_ROUTES = Router();

USER_ROUTES.get('/prueba', (req: Request, res: Response) => {
  res.json({ ok: true, mensaje: 'Usuario service funciona bien' });
});

// CREAR USUARIO
USER_ROUTES.post('/create', (req: Request, res: Response) => {
  // Con este objeto definimos los únicos datos que sacaremos de la request,
  // si se mandan más parámetros no se utilizan
  const user = {
    nombre: req.body.nombre,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    avatar: req.body.avatar,
  };

  Usuario.create(user)
    .then((userDB) => {
      const tokenUser = Token.getJwtToken({
        _id: userDB._id,
        name: userDB.name,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({ ok: true, token: tokenUser });
    })
    .catch((err) => {
      res.json({ ok: false, err });
    });
});

// LOGIN
USER_ROUTES.post('/login', (req: Request, res: Response) => {
  const body = req.body;

  Usuario.findOne({ email: body.email }, (err, userDB) => {
    if (err) throw err;

    if (!userDB) {
      return res.json({
        ok: false,
        message: 'Usuario/contraseña no son correctos',
      });
    }

    if (userDB.compararPassword(body.password)) {
      const tokenUser = Token.getJwtToken({
        _id: userDB._id,
        name: userDB.name,
        email: userDB.email,
        avatar: userDB.avatar,
      });

      res.json({ ok: true, token: tokenUser });
    } else {
      return res.json({
        ok: false,
        message: 'Usuario/contraseña no son correctos',
      });
    }
  });
});

// ACTUALIZAR USUARIO
// Le añadimos el middleware verificaToken
USER_ROUTES.post('/update', [verificaToken], (req: any, res: Response) => {
  const user = {
    nombre: req.body.nombre || req.usuario.nombre,
    email: req.body.email || req.usuario.email,
    avatar: req.body.avatar || req.usuario.avatar,
  };

  Usuario.findOneAndUpdate(
    req.usuario._id,
    user,
    { new: true },
    (err, userUpdated) => {
      if (err) throw err;

      if (!userUpdated) {
        return res.json({
          ok: false,
          message: 'No existe un usuario con ese id',
        });
      }

      const tokenUser = Token.getJwtToken({
        _id: userUpdated._id,
        name: userUpdated.name,
        email: userUpdated.email,
        avatar: userUpdated.avatar,
      });

      res.json({ ok: true, token: tokenUser });
    }
  );
});

USER_ROUTES.get('/', [verificaToken], (req: any, res: Response) => {
  const usuario = req.usuario;

  res.json({ ok: true, usuario });
});

export default USER_ROUTES;
