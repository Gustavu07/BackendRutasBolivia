// utils/response.utils.js

function sendError500(error, res) {
    if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }
    res.status(500).json({ error: error.message });
}

module.exports = { sendError500 };
