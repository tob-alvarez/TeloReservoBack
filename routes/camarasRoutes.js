const { Router } = require("express");
const { agregarCamara, getCamara, actualizarCamara, borrarCamara } = require("../controllers/camarasControllers");
const verifyRole = require("../middlewares/verifyRole");
const auth = require("../middlewares/auth");
const { check } = require("express-validator");
const validateFields = require("../middlewares/validateFields");
const router = Router();

router.post("/alta", [auth,verifyRole,
    check("nombre", "el nombre ingresado no es correcto").not().isEmpty().isString().isLength({ max: 7 }),
    check("ubicacion", "el valor ingresado no es correcto").not().isEmpty().isString().isLength({ min: 8, max: 50 }),
    check("tipoDeCamara", "el valor ingresado no es correcto").not().isEmpty().isString().isIn(["camara", "domo"]),
    validateFields
], agregarCamara);

router.get("/listar/:nombre?",auth, getCamara);
router.put("/actualizarCamara/:id",auth,verifyRole, actualizarCamara);
router.delete(
    "/",
    [ auth,verifyRole,
      check("id").not().isEmpty().isMongoId(),
      validateFields,
    ],
    borrarCamara
  );

module.exports = router;