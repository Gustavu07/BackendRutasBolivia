const express = require("express");
const routeController = require("../controller/ruta.controller.js");

const router = express.Router();

router.get("/", routeController.listRoutes);
router.get("/:id", routeController.getRouteById);
router.get("/:id/highlight", routeController.highlightRoute);
router.get("/status/filter", routeController.filterRoutesByStatus);
router.post("/", routeController.createRoute);
router.put("/:id", routeController.updateRoute);
router.patch("/:id/coordinates", routeController.updateRouteCoordinates);
router.delete("/:id", routeController.deleteRoute);

module.exports = router;
