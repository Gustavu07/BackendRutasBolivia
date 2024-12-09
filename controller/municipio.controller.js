const db = require("../models");
const Municipality = db.municipality;
const { sendError500 } = require("../utils/response.utils");

exports.listMunicipalities = async (req, res) => {
    try {
        const municipalities = await Municipality.findAll();
        res.json(municipalities);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.getMunicipalityById = async (req, res) => {
    const id = req.params.id;
    try {
        const municipality = await Municipality.findByPk(id);
        if (!municipality) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }
        res.json(municipality);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.createMunicipality = async (req, res) => {
    const { name, location } = req.body;

    try {
        const newMunicipality = await Municipality.create({ name, location });
        res.status(201).json(newMunicipality);
    } catch (error) {
        sendError500(error, res);
    }
};

exports.updateMunicipality = async (req, res) => {
    const id = req.params.id;
    const { name, location } = req.body;

    try {
        const municipality = await Municipality.findByPk(id);
        if (!municipality) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }

        await municipality.update({ name, location });
        res.json({ msg: 'Municipio actualizado correctamente', municipality });
    } catch (error) {
        sendError500(error, res);
    }
};

exports.deleteMunicipality = async (req, res) => {
    const id = req.params.id;

    try {
        const municipality = await Municipality.findByPk(id);
        if (!municipality) {
            return res.status(404).json({ msg: 'Municipio no encontrado' });
        }

        await municipality.destroy();
        res.json({ msg: 'Municipio eliminado correctamente' });
    } catch (error) {
        sendError500(error, res);
    }
};
