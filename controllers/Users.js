import Users from "../models/ModelUser.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mengecek || mengambil User
export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

// Menambahkan User
export const Register = async (req, res) => {
    const { username, email, password, confPass, role } = req.body;
    if (password !== confPass)
        return res
            .status(400)
            .json({ msg: `Password dan Confirm Password tidak cocok` });
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {   
        await Users.create({
            username: username,
            email: email,
            password: hashPassword,
            confPass: hashPassword,
            role : role,
        });
        res.json({ msg: 'Register Berhasil' })
    } catch (error) {
        console.log(error);

    }
};

// Masuk sebagai Suatu user
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email,
            }
        });

        // Bila email user tidak ada
        if (!user) {
            return res.status(404).json({ msg: "User Tidak ditemukan" });
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(400).json({ msg: 'Password salah' })

            
        const userId = user.id;
        const name = user.username;
        const role = user.role;

        const accessToken = jwt.sign({ userId, name, role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '90s'
        });
        const refreshToken = jwt.sign({ userId, name, role }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update(
            { refreshToken: refreshToken },
            {
            where: {
                id: userId,
            },
        }
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({ msg: "Terjadi Kesalahan" });
    }
};