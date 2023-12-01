const { Router } = require("express");
const { login, getAuthStatus, agregarUsuario, borrarUsuario, editarConstraseñaUsuario, noticias, actualizarCampoNoticiasParaTodos, ocultarCampoNoticiasParaTodos } = require("../controllers/usersControllers");
const auth = require("../middlewares/auth");
const validateFields = require("../middlewares/validateFields");
const { check } = require("express-validator");

const router = Router();

router.get("/authStatus", auth, getAuthStatus);
router.post(
  "/login",
  [
    check("nombreUsuario").not().isEmpty().isLength({ max: 15 }),
    check("contraseña").isLength({ min: 6, max: 30 }),
    validateFields,
  ],
  login
);
router.put(
  "/editPassword/users", auth, editarConstraseñaUsuario
)
// router.put("/noticias/:id", auth, noticias);
// router.get("/noticias/reset", auth, verifyRole, actualizarCampoNoticiasParaTodos);
// router.get("/noticias/ocultar", auth, verifyRole, ocultarCampoNoticiasParaTodos);

router.post("/alta",
  [
    check("userName", "El usuario no cumple los requisitos").not().isEmpty().isLength({ min: 4, max: 20 }),
    check("email", "Formato de email invalido").not().isEmpty().isEmail(),
    check("password", "La contraseña no cumple los requisitos").not().isEmpty(),
  ],
  agregarUsuario
);

router.delete(
  "/",
  [auth,
    check("id").not().isEmpty().isMongoId(),
    validateFields,
  ],
  borrarUsuario
);

module.exports = router;