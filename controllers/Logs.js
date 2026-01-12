import Logs from "../models/ModelLog.js";
import Books from "../models/ModelBook.js";

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
        let logs;

        if (req.role === "pengunjung"){
            logs = await Logs.findAll({
            where: {
                user_id: req.userId
            }
        });
        }
        else if (req.role === "staf" || req.role === "admin") {
            logs =  await Logs.findAll();
        }

        else {
            return res.status(400).json({ msg: "Akses Ditolak"})
        }
        
        
        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

export const postLogs = async (req, res) => {
    try {

        const { kode_buku } = req.body;

        const pinjamanAktif = await Logs.findOne({
            where: {
                user_id: req.userId,
                status: ["pending", "dipinjam"]
            }
        });

        if (pinjamanAktif) {
            return res.status(400).json({
                msg: "Anda masih memiliki buku yang belum dikembalikan"
            });
        }

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

export const confirmBorrow = async (req, res) => {
    try {
        if (req.role !== "staff" && req.role !== "admin"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }

        const log = await Logs.findByPk(req.params.id)
        if (!log) {
            return res.status(404).json({ msg: "Log tidak ditemukan "})
        }

        if (log.status !== "pending") {
            return res.status(400).json({ msg: "Log tidak ditemukan dalam pending"})
        }

        const book = await Books.findByPk(log.book_id)
        if (!book) {
            return res.status(404).json({ msg: "Buku tidak ditemukan "})
        }

        if (book.stok <= 0) {
            return res.status(400).json({ msg: "Stok buku habis"})
        }

        await log.update({
            status : "dipinjam",
            diproses_oleh : req.userId
        });
        
        await book.update({
            stok : book.stok - 1 
        });

        res.json({ msg: "Buku Berhasil Dipinjam"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};

export const returnBorrow = async (req, res) => {
    try {
        if (req.role !== "staff" && req.role !== "admin"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }

        const log = await Logs.findByPk(req.params.id)
        if (!log) {
            return res.status(404).json({ msg: "Log tidak ditemukan "})
        }

        if (log.status !== "dipinjam") {
            return res.status(400).json({ msg: "Log tidak distatus dipinjam"})
        }

        const book = await Books.findByPk(log.book_id)
        if (!book) {
            return res.status(404).json({ msg: "Buku tidak ditemukan "})
        }

        await log.update({
            status : "dikembalikan",
            diproses_oleh : req.userId
        });
        
        await book.update({
            stok : book.stok + 1 
        });

        res.json({ msg: "Buku Berhasil Dikembalikan"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};

export const deleteLog = async (req, res) => {
    try {
        if (req.role !== "admin"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }


        const logs = await Logs.findByPk(req.params.id)
        if (!logs) {
            return res.status(404).json({ msg: "Log tidak ditemukan "})
        }

        
        await logs.destroy();

        res.json({ msg: "Log Berhasil dihapus"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};