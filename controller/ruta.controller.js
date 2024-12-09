const db = require("../models");
const { sendError500 } = require("../utils/response.utils");
const Route = db.ruta;

exports.listRoutes = async (req, res) => {
    try {
        const routes = await Route.findAll({
            attributes: ["id", "name", "origin", "destination", "status", "reason", "coordinates"],
        });
        res.json(routes);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.getRouteById = async (req, res) => {
    const id = req.params.id;
    try {
        const route = await Route.findByPk(id, {
            attributes: ["id", "name", "origin", "destination", "status", "reason", "coordinates"],
        });
        if (!route) {
            return res.status(404).json({ msg: "Ruta no encontrada" });
        }
        res.json(route);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.highlightRoute = async (req, res) => {
    const id = req.params.id;

    try {
        const route = await Route.findByPk(id, {
            attributes: ["id", "name", "origin", "destination", "status", "reason", "coordinates"],
            include: [
                {
                    model: db.municipality,
                    as: "originMunicipality",
                    attributes: ["id", "name", "location"],
                },
                {
                    model: db.municipality,
                    as: "destinationMunicipality",
                    attributes: ["id", "name", "location"],
                },
            ],
        });

        if (!route) {
            return res.status(404).json({ msg: "Ruta no encontrada" });
        }

        res.status(200).json(route);
    } catch (error) {
        console.error("Error al resaltar la carretera:", error);
        res.status(500).json({ msg: "Error al resaltar la carretera.", error });
    }
};

exports.filterRoutesByStatus = async (req, res) => {
    const { status } = req.query;

    try {
        const routes = await Route.findAll({
            where: { status },
            attributes: ["id", "name", "origin", "destination", "status", "reason", "coordinates"],
        });

        if (!routes.length) {
            return res.status(404).json({ msg: "No se encontraron rutas con el estado especificado." });
        }

        res.json(routes);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.createRoute = async (req, res) => {
    const { name, origin, destination, status, reason, coordinates } = req.body;

    try {
        const newRoute = await Route.create({
            name,
            origin,
            destination,
            status,
            reason,
            coordinates,
        });
        res.status(201).json(newRoute);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.updateRoute = async (req, res) => {
    const id = req.params.id;
    const { name, origin, destination, status, reason, coordinates } = req.body;

    try {
        const route = await Route.findByPk(id);
        if (!route) {
            return res.status(404).json({ msg: "Ruta no encontrada" });
        }

        await route.update({
            name,
            origin,
            destination,
            status,
            reason,
            coordinates,
        });

        res.json({ msg: "Ruta actualizada correctamente", route });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.updateRouteCoordinates = async (req, res) => {
    const id = req.params.id;
    const { coordinates } = req.body;

    if (!Array.isArray(coordinates) || coordinates.length < 2) {
        return res.status(400).json({
            msg: "Las coordenadas deben ser un array válido con al menos dos puntos.",
        });
    }

    try {
        const route = await Route.findByPk(id);

        if (!route) {
            return res.status(404).json({ msg: "Ruta no encontrada" });
        }

        await route.update({
            coordinates: { type: "LineString", coordinates }, // Actualiza el campo coordinates
        });

        res.status(200).json({ msg: "Coordenadas actualizadas correctamente", route });
    } catch (error) {
        console.error("Error al actualizar las coordenadas:", error);
        res.status(500).json({ msg: "Error al actualizar las coordenadas", error });
    }
};

exports.deleteRoute = async (req, res) => {
    const id = req.params.id;

    try {
        const route = await Route.findByPk(id);
        if (!route) {
            return res.status(404).json({ msg: "Ruta no encontrada" });
        }

        await route.destroy();
        res.json({ msg: "Ruta eliminada correctamente" });
    } catch (error) {
        sendError500(error, res);
    }
};
