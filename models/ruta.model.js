module.exports = (sequelize, Sequelize) => {
    const Route = sequelize.define("route", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        origin: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        destination: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [["bloqueada", "libre"]],
            },
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        coordinates: {
            type: Sequelize.GEOMETRY("LINESTRING"),
            allowNull: true,
            validate: {
                isValidLineString(value) {
                    if (!value || !value.coordinates || value.type !== "LineString") {
                        throw new Error("Las coordenadas deben ser un LINESTRING válido.");
                    }
                },
            },
        },
        updatedBy: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "usuarios",
                key: "id",
            },
        },
    });
    return Route;
};
