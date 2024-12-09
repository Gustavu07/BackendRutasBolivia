module.exports = app => {
    app.use('/usuarios', require('./usuario.routes'));
    app.use('/rutas', require('./rutas.routes'));
    app.use('/municipios', require('./municipios.routes'));
    app.use('/incidentes', require('./incidente.routes'));
    app.use('/solicitudIncidente', require('./solicitudIncidente.routes.js'));
};