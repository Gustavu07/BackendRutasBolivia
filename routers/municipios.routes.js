const express = require("express");
const municipalityController = require("../controller/municipio.controller.js");

const router = express.Router();

router.get("/", municipalityController.listMunicipalities);
router.get("/:id", municipalityController.getMunicipalityById);
router.post("/", municipalityController.createMunicipality);
router.put("/:id", municipalityController.updateMunicipality);
router.delete("/:id", municipalityController.deleteMunicipality);

module.exports = router;
