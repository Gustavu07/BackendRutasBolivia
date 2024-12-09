const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: "mysql",
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
db.ruta = require("./ruta.model.js")(sequelize, Sequelize);
db.incidente = require("./Incidentes.model.js")(sequelize, Sequelize);
db.municipality = require("./municipios.model.js")(sequelize, Sequelize);


db.usuario.hasMany(db.ruta, { foreignKey: 'updatedBy', as: 'updatedRoutes' });
db.ruta.belongsTo(db.usuario, { foreignKey: 'updatedBy', as: 'updatedByUser' });

db.ruta.belongsTo(db.municipality, { foreignKey: 'originMunicipalityId', as: 'originMunicipality' });
db.ruta.belongsTo(db.municipality, { foreignKey: 'destinationMunicipalityId', as: 'destinationMunicipality' });

db.incidente.belongsTo(db.usuario, { foreignKey: 'reportedBy', as: 'reporter' });
db.incidente.belongsTo(db.ruta, { foreignKey: 'routeId', as: 'relatedRoute' });

module.exports = db;
