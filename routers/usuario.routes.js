const express = require("express");
const usuarioController = require("../controller/usuario.controller.js");
const { authMiddleware, checkRole } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Rutas públicas
router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);

// Rutas protegidas
router.get("/", authMiddleware, checkRole(["admin"]), usuarioController.getUsers);
router.get("/:id", authMiddleware, usuarioController.getUserById);
router.put("/:id", authMiddleware, checkRole(["admin"]), usuarioController.updateUser);
router.patch("/:id/password", authMiddleware, checkRole(["admin"]), usuarioController.changePassword);
router.delete("/:id", authMiddleware, checkRole(["admin"]), usuarioController.deleteUser);


module.exports = router;
