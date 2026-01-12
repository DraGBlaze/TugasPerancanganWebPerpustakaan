import Users from "../models/ModelUser.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { where } from "sequelize";

// Mengecek || mengambil User
export const getUsers = async (req, res) => {
    try {
        let users

        if (req.role === "staff" || req.role === "admin") {
             users = await Users.findAll();
        }
        else {
            return res.status(400).json({ msg: "Akses Ditolak"})
        }

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

// Menambahkan User
export const Register = async (req, res) => {
    const { username, email, password, confPass, role } = req.body;

    const part = email.split('@')

    if (part.length !== 2 || part[1] !== "gmail.com") {
        return res.status(400).json({msg : "Harus pake akun gmail @gmail.com"})
    }

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
            expiresIn: '15s'
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

export const roleStaff = async (req, res) => {
    try {
        if (req.role !== "admin"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }

        const user = await Users.findByPk(req.params.id)
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan "})
        }

        if (user.role !== "pengunjung") {
            return res.status(400).json({ msg: "User bukan pengunjung"})
        }

        await user.update({
            role : "staff",
        });

        res.json({ msg: "Staff Berhasil Ditambahkan"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};

export const UpdateUser = async (req, res) => {
    try {
        const { username, email, password, confPass, role } = req.body;

        const user = await Users.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }

        // user biasa hanya boleh update dirinya sendiri
        if (req.role !== "admin" && req.userId !== user.id) {
            return res.status(403).json({ msg: "Akses ditolak" });
        }

        let updateData = {
            username,
            email
        };

        // jika ganti password
        if (password) {
            if (password !== confPass) {
                return res.status(400).json({ msg: "Password tidak cocok" });
            }
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(password, salt);
        }

        // hanya admin boleh ubah role
        if (req.role === "admin" && role) {
            updateData.role = role;
        }

        await user.update(updateData);

        res.json({ msg: "User berhasil diperbarui" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (req.role !== "admin"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }


        const user = await Users.findByPk(req.params.id)
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan "})
        }

        if (req.userId === user.id) {
            return res.status(400).json({ msg: "Tidak bisa menghapus akun sendiri"})
        }

        await user.destroy({
            where: {
                id : req.params.id
            }
        });
        
        await user.destroy();

        res.json({ msg: "User Berhasil dihapus"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};

export const Logout = async (req, res) => {
    
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.sendStatus(204);
        }

        const user = await Users.findOne({
            where: { refreshToken }
        });

        if (!user) {
            return res.sendStatus(403);
        }

        if(!user) return res.sendStatus(204);
        const userId = user.id;
        await Users.update({refreshToken: null}, {
            where: {
                id : userId
            }
        });

        res.clearCookie('refreshToken');
        return res.sendStatus(200);
        
    } 