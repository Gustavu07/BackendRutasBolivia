module.exports = (sequelize, Sequelize) => {
    const Municipality = sequelize.define("municipality", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        location: {
            type: Sequelize.GEOMETRY("POINT"),
            allowNull: true,
            validate: {
                isValidPoint(value) {
                    if (!value || value.type !== "Point" || !Array.isArray(value.coordinates)) {
                        throw new Error("La ubicación debe ser un POINT válido.");
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
    return Municipality;
};
