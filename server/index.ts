import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import Server from './classes/server';
import POST_ROUTES from './routes/post';
import USER_ROUTES from './routes/usuario';
import cors from 'cors';

const server = new Server();

// Body-parser
// Definimos un middleware para antes de pasar por una petición concreta que parsee el objeto
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// Definimos otros middleware para cuando subamos archivos en al app
server.app.use(fileUpload());

// Configurar CORS
server.app.use(cors({ origin: true, credentials: true }));

// Rutas de mi app
server.app.use('/user', USER_ROUTES);
server.app.use('/posts', POST_ROUTES);

// Conectar DB
// {  useNewUrlParser: true,  useCreateIndex: true} esta configuración es para poder trabajar
// con los índices
mongoose.connect(
  'mongodb://localhost:27017/fotosgram',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('DATABASE ONLINE');
  }
);

// Levantar express
server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
