const db = require("../models");
const path = require("path");
const fs = require("fs");
const { sendError500 } = require("../utils/response.utils");
const Route = db.solicitudIncidentes;

exports.listSolicitud = async (req, res) => {
    try {
        const solicitudes = await db.solicitudIncidentes.findAll();

        const solicitudesConImagen = solicitudes.map((solicitud) => {
            return {
                ...solicitud.toJSON(),
                imagenUrl: `/public/imagenes/solicitudIncidente/${solicitud.id}.jpg`,
            };
        });

        res.json(solicitudesConImagen);
    } catch (error) {
        res.status(500).json({
            msg: error.message || "Error al obtener las solicitudes",
        });
    }
};


exports.getSolicitudById = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
exports.createSolicitud = async (req, res) => {
    const { detalle } = req.body;

    if (!detalle) {
        return res.status(400).json({ msg: 'El campo detalle es obligatorio' });
    }

    try {
        const solicitudCreada = await db.solicitudIncidentes.create({ detalle });
        res.status(201).json({ id: solicitudCreada.id });
    } catch (error) {
        sendError500(error, res);
    }
};


exports.updateSolicitudPatch = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        const {detalle } = req.body;

        solicitud.detalle = req.body.detalle || solicitud.detalle;

        await solicitud.save();
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
exports.updateSolicitudPut = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        const requiredFields = ['detalle'];
        if (!isRequestValid(requiredFields, req.body, res)) {
            return;
        }
        const {detalle } = req.body;


        solicitud.detalle = req.body.detalle;
        await solicitud.save();

        res.json(solicitud);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
exports.deleteSolicitud = async (req, res) => {
    const id = req.params.id;
    try {
        const solicitud = await getSolicitudOr404(id, res);
        if (!solicitud) {
            return;
        }
        await solicitud.destroy();
        res.json({
            msg: 'solicitud eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}
async function getSolicitudOr404(id, res) {
    const solicitud = await db.solicitudIncidentes.findByPk(id);
    if (!solicitud) {
        res.status(404).json({
            msg: ' Solicitud de solicitud no encontrado'
        });
        return;
    }
    return solicitud;
}

exports.subirImagenBloqueo = async function (req, res) {
    const id = req.params.id;
    console.log("---"+id)
    if (!req.files?.imagen) {
        return res.status(400).json({ message: 'Debe seleccionar una imagen' });
    }

    const imagen = req.files.imagen;
    const imagenDir = path.join(__dirname, '/../public/imagenes/solicitudIncidente');

    if (!fs.existsSync(imagenDir)) {
        fs.mkdirSync(imagenDir, { recursive: true });
    }

    const filePath = path.join(imagenDir, `${id}.jpg`);

    imagen.mv(filePath, async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error al subir la imagen' });
        }

        const pathRelativo = `/public/imagenes/solicitudIncidente/${id}.jpg`;

        res.json({ message: 'Imagen subida exitosamente', ruta: pathRelativo });
    });
};