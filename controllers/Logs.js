import Logs from "../models/ModelLog.js";
import Books from "../models/ModelBook.js";
import { where } from "sequelize";

export const getLogs = async (req, res) => {
    try {
        const log = await Logs.findAll();
        res.json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};


export const getLogsMe = async (req, res) => {
    try {       
        const log = await Logs.findAll({
            where: {
                user_id: req.userId
            }
        });
        res.json(log);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

export const postLogs = async (req, res) => {
    try {

        const { kode_buku } = req.body;

        const book = await Books.findOne({
            where: { kode_buku }
        });

        if (!book) {
            return res.status(404).json({ msg: "Buku tidak ditemukan"});
        }

        if (book.stok <= 0) {
            return res.status(400).json({ msg: "Stok buku habis" })
        }

        await Logs.create({
            user_id: req.userId,
            book_id: book.id,
            status: "pending",
            diproses_oleh: null,
        });
        res.json({ msg: 'Permintaan Peminjaman dikirim, menunggu konfirmasi staff' })
    } catch (error) {
        console.log(error);
    }
};