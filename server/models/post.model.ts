import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { Usuario } from './usuario.model';

const postSchema = new Schema({
  created: { type: Date },
  mensaje: { type: String },
  imgs: [{ type: String }],
  coords: {
    type: String,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'Debe existir una referencia a un usuario'],
  },
});

// Para grabar el created antes de la inserción en base de datos
postSchema.pre<IPost>('save', function (next) {
  this.created = new Date();
  next();
});

interface IPost extends Document {
  created: Date;
  mensaje: string;
  imgs: string[];
  coords: string;
  usuario: string;
}

export const Post = model<IPost>('Post', postSchema);
