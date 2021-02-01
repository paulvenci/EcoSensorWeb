const { Router } = require('express');
const router = Router();

const usuario = require("../controllers/usuario.js");
router.get("/", usuario.findAll);
router.get("/:id", usuario.findOne);
router.get("/rut/:rut", usuario.findRut);
router.get("/empresa/:empresa_rut", usuario.findStore);
router.get("/nombreUsuario/:nombre_usuario", usuario.findNombreUsuario);

router.post("/", usuario.create);
router.put("/:id", usuario.update);
router.delete("/:id", usuario.delete);

module.exports = router;