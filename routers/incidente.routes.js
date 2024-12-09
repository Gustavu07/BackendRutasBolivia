const express = require("express");
const incidentController = require("../controller/incidentes.controller.js");

const router = express.Router();

router.get("/", incidentController.listIncidents);
router.get("/:id", incidentController.getIncidentById);
router.get("/ruta/:routeId", incidentController.getIncidentsByRouteId);
router.post("/", incidentController.createIncident);
router.put("/:id", incidentController.updateIncident);
router.delete("/:id", incidentController.deleteIncident);
router.patch("/:id/image", incidentController.uploadImage);

module.exports = router;
