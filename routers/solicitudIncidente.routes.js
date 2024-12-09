const express = require("express");
const solicitudController = require("../controller/solicitudIncidente.controller");

const router = express.Router();
    router.get('/', solicitudController.listSolicitud);
    router.get('/:id', solicitudController.getSolicitudById);
    router.post('/', solicitudController.createSolicitud);
    router.put('/:id', solicitudController.updateSolicitudPut);
    router.patch('/:id', solicitudController.updateSolicitudPatch);
    router.delete('/:id', solicitudController.deleteSolicitud);
    router.post("/:id/imagen",solicitudController.subirImagenBloqueo);

    module.exports = router;