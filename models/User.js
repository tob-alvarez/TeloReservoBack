const { Schema, model } = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const ReporteSchema = new Schema(
  {
    nombreUsuario: {
      type: String,
      // unique: true,
      trim: true,
      lowercase: true,
      minLength: [4, "Debe tener al menos 4 caracteres"],
      maxLength: [20, "Debe tener como máximo 20 caracteres"],
      required: [true, "El nombre de usuario es requerido"],
    },
    email: {
      type: String,
      // unique: true,
      trim: true,
      lowercase: true,
      required: [true, "El email es requerido"],
    },
    estado: {
      //borrado logico
      type: Boolean,
      default: true,
    },
    tipoDeUsuario: {
      type: String,
      enum: [
        "admin",
        "consumidor",
        "administración",
      ],
      trim: true,
      default: 'consumidor',
      required: [false, "El tipo de usuario es requerido"],
    },
    contraseña: {
      type: String,
      trim: true,
      required: [true, "La contraseña es obligatoria"],
    },
    noticias: {
      type: Boolean,
      default: true
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

ReporteSchema.plugin(mongooseUniqueValidator, {
  message: '{PATH} debe ser único'
})


module.exports = model('User', ReporteSchema);