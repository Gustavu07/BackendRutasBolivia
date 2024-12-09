module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        rol: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [["admin", "verificador"]],
            },
        },
    });
    return Usuario;
};
