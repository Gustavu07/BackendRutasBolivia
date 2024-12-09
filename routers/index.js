module.exports = app => {
    app.use('/usuarios', require('./usuario.routes'));
    app.use('/rutas', require('./rutas.routes'));
    app.use('/municipios', require('./municipios.routes'));
    app.use('/incidentes', require('./incidente.routes'));
};