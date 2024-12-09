const db = require("../models");
const path = require("path");
const Incident = db.incidente;
const { sendError500 } = require("../utils/response.utils");

exports.listIncidents = async (req, res) => {
    try {
        const incidents = await Incident.findAll();
        res.json(incidents);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.getIncidentById = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await Incident.findByPk(id);
        if (!incident) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }
        res.json(incident);
    } catch (error) {
        sendError500(error, res);
    }
};


exports.getIncidentsByRouteId = async (req, res) => {
    const { routeId } = req.params;

    try {
        const incidents = await Incident.findAll({
            where: { routeId },
            attributes: ["id", "description", "type", "location", "routeId", "createdAt", "updatedAt"],
        });

        if (!incidents.length) {
            return res.status(404).json({ msg: "No se encontraron incidencias para esta carretera." });
        }

        res.status(200).json(incidents);
    } catch (error) {
        console.error("Error al obtener incidencias por ID de carretera:", error);
        res.status(500).json({ message: "Error al obtener incidencias.", error });
    }
};

exports.createIncident = async (req, res) => {
    const { description, type, location, routeId } = req.body;

    try {
        const newIncident = await Incident.create({ description, type, location, routeId });
        res.status(201).json(newIncident);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.updateIncident = async (req, res) => {
    const id = req.params.id;
    const { description, type, location } = req.body;

    try {
        const incident = await Incident.findByPk(id);
        if (!incident) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }

        await incident.update({ description, type, location });
        res.json({ msg: 'Incidente actualizado correctamente', incident });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.deleteIncident = async (req, res) => {
    const id = req.params.id;

    try {
        const incident = await Incident.findByPk(id);
        if (!incident) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }

        await incident.destroy();
        res.json({ msg: 'Incidente eliminado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.uploadImage = async (req, res) => {
    const id = req.params.id;

    try {
        const incident = await Incident.findByPk(id);
        if (!incident) {
            return res.status(404).json({ msg: 'Incidente no encontrado' });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen' });
        }

        const file = req.files.image;
        const fileName = `incident_${id}_${Date.now()}.jpg`;
        const uploadPath = path.join(__dirname, "../public/incidentes", fileName);

        file.mv(uploadPath, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al mover el archivo', details: err.message });
            }

            incident.imageUrl = `/uploads/incidents/${fileName}`;
            await incident.save();

            res.json({ msg: 'Imagen subida exitosamente', incident });
        });
    } catch (error) {
        sendError500(error, res);
    }
};

