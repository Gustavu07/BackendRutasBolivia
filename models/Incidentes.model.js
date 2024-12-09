module.exports = (sequelize, Sequelize) => {
    const Incident = sequelize.define("incident", {
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [
                    [
                        "Transitable con desvíos y/o horarios de circulación",
                        "No transitable por conflictos sociales",
                        "Restricción vehicular",
                        "No transitable tráfico cerrado",
                        "Restricción vehicular, especial",
                    ],
                ],
            },
        },
        location: {
            type: Sequelize.GEOMETRY("POINT"),
            allowNull: false,
        },
        routeId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "routes",
                key: "id",
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
    return Incident;
};
