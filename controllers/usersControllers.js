const User = require("../models/User");
const CustomError = require("../utils/customError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const editarConstraseñaUsuario = async (req, res) => {
  try {
    const { confirmPassword, confirmPasswordRepeat, userId, password } = req.body;

    const user = await User.findById(userId);
    if (!user) throw new CustomError("Usuario no encontrado", 404);
    const passOk = await bcrypt.compare(password, user.contraseña);
    if (passOk) {
      if (confirmPassword === confirmPasswordRepeat) {
        const salt = await bcrypt.genSalt(10);
        const passwordEncrypted = await bcrypt.hash(confirmPassword, salt);
        await User.findByIdAndUpdate(user._id, { contraseña: passwordEncrypted })
      } else throw new CustomError("Las contraseñas no coinciden", 400)
      res.status(200).json({ mensaje: "Contraseña modificada con exito" })
    } else throw new CustomError("Contraseña incorrecta", 400)
  } catch (error) {
    res.status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
}

const getAuthStatus = async (req, res) => {
  try {
    const id = req.id;

    const user = await User.findById(id);
    if (!user) throw new CustomError("Autenticación fallida", 401);
    res.status(200).json({ user });
  } catch (error) {
    res.status(error.code || 500).json({
      message:
        error.message || "Ups! Hubo un problema, por favor intenta más tarde",
    });
  }
};

const login = async (req, res) => {
  try {
    const { nombreUsuario, contraseña } = req.body;
    if (!nombreUsuario || !contraseña)
      throw new CustomError("Usuario y contraseña son requeridas", 400);
    const user = await User.findOne({ nombreUsuario });
    if (!user) throw new CustomError("Usuario no encontrado", 404);
    const passOk = await bcrypt.compare(contraseña, user.contraseña);
    if (!passOk) throw new CustomError("Contraseña incorrecta", 400);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "8h",
    });
    res
      .status(200)
      .json({ message: "Ingreso correcto", ok: true, user, token });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
};

const agregarUsuario = async (req, res) => {
  try {
    // console.log(req.body);

    const { userName, email, password, repeatPassword } = req.body;

    if (password !== repeatPassword)
      throw new CustomError("Las contraseñas no coinciden", 400);
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypted = await bcrypt.hash(password, salt);
    const user = new User({
      nombreUsuario: userName,
      email,
      contraseña: passwordEncrypted,
    });
    await user.save();
    res.status(200).json({ message: "Usuario creado con exito" });
  } catch (error) {
    console.log(req.body);
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :(" });
  }
}

const borrarUsuario = async (req, res) => {
  try {
    const { id } = req.body;
    const userRemove = {
      estado: false
    }
    const usuarioEliminado = await User.findByIdAndUpdate(id, userRemove, { new: true })
    if (!usuarioEliminado) throw new CustomError("usuario no encontrado", 404)
    res.status(200).json({ message: "Usuario eliminado con éxito" })
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
}

const noticias = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = req.body;

    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true, runValidators: true });
    if (!user) throw new CustomError("usuario no encontrado", 404)
    res.status(200).json({ message: "usuario modificado con exito", user });

  } catch (error) {
    res
      .status(error.code || 500)
      .json({ message: error.message || "algo explotó :|" });
  }
}

const actualizarCampoNoticiasParaTodos = async (req, res) => {
  try {

    await User.updateMany({}, { $set: { noticias: true } });

    res.status(200).json({ message: 'Campo actualizado con éxito en todos los usuarios' });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message || 'Algo explotó :|' });
  }
};
const ocultarCampoNoticiasParaTodos = async (req, res) => {
  try {

    await User.updateMany({}, { $set: { noticias: false } });

    res.status(200).json({ message: 'Campo actualizado con éxito en todos los usuarios' });
  } catch (error) {
    res.status(error.code || 500).json({ message: error.message || 'Algo explotó :|' });
  }
};

module.exports = {
  login,
  getAuthStatus,
  editarConstraseñaUsuario,
  agregarUsuario,
  borrarUsuario,
  noticias,
  actualizarCampoNoticiasParaTodos,
  ocultarCampoNoticiasParaTodos
};
