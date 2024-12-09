const db = require("../models");
const Usuario = db.usuario;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "clave-secreta";

exports.register = async (req, res) => {
    try {
        const { email, password, rol } = req.body;

        if (!email || !password || !rol) {
            return res.status(400).json({ message: "Todos los campos son obligatorios: email, password y rol." });
        }

        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "El email ya está en uso." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Usuario.create({ email, password: hashedPassword, rol });

        res.status(201).json({ message: "Usuario registrado exitosamente.", user: newUser });
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).json({ message: "Error al registrar el usuario.", error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son obligatorios." });
        }

        const user = await Usuario.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Inicio de sesión exitoso.",
            token,
            user: { id: user.id, email: user.email, rol: user.rol },
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión.", error });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "La nueva contraseña es obligatoria." });
        }

        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });

        res.status(200).json({ message: "Contraseña actualizada exitosamente." });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña.", error });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, rol } = req.body;
        if (!email || !password || !rol) {
            return res.status(400).json({ message: "Todos los campos son obligatorios: email, password y rol." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
 
        const newUser = await Usuario.create({ email, password: hashedPassword, rol });
        res.status(201).json(newUser);
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "El email ya está en uso." });
        }
        res.status(500).json({ message: "Error al crear el usuario.", error });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios.", error });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario.", error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, rol } = req.body;
        if (!email && !password && !rol) {
            return res.status(400).json({ message: "Se requiere al menos un campo para actualizar: email, password o rol." });
        }
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        const updateData = { email, rol };
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }
        await user.update(updateData);
        res.status(200).json({ message: "Usuario actualizado exitosamente.", user });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario.", error });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: "La nueva contraseña es obligatoria." });
        }
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        res.status(200).json({ message: "Contraseña actualizada exitosamente." });
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña.", error });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        await user.destroy();
        res.status(200).json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario.", error });
    }
};
