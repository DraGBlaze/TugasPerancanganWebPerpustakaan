import Books from "../models/ModelBook.js";

export const getBooksPublic = async (req, res) => {
    try {
        const book = await Books.findAll({attributes: ["judul_buku", "penerbit", "pengarang", "tahun_terbit"]});
        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

// Mengecek buku atau mengambil buku
export const getBooks = async (req, res) => {
    try {
        let books;

        if (req.role === "pengunjung")
            books = await Books.findAll({attributes: {exclude: ['id', 'stok', "createdAt", "updatedAt"]}})
        else if (req.role === "staff" || req.role === "admin")
            books = await Books.findAll();
        else
            books = await Books.findAll({attributes: ["judul_buku", "penerbit", "pengarang", "tahun_terbit"]});

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Internal Server Error` });
    }
};

// Menambahkan buku 
export const postBooks = async (req, res) => {
    const { judul_buku, kode_buku, pengarang, penerbit, tahun_terbit, kategori, rak, stok } = req.body;
    try {
        await Books.create({
            judul_buku: judul_buku,
            kode_buku: kode_buku,
            pengarang: pengarang,
            penerbit: penerbit,
            tahun_terbit: tahun_terbit,
            kategori: kategori,
            rak : rak,
            stok: stok
        });
        res.json({ smg: 'Buku Berhasil Ditambahkanh' })
    } catch (error) {
        console.log(error);
    }
};

export const updateBook = async (req, res) => {
    try {
        if (req.role === "pengunjung"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }

        const {judul_buku, pengarang, penerbit, tahun_terbit, kategori, rak, stok} = req.body

        let updateData = {};

        if (req.role ===  "admin") {
            updateData = {judul_buku, pengarang, penerbit, tahun_terbit, kategori, rak, stok}
        }
        
        if (req.role ===  "staf") {
            updateData = {kategori, rak, stok}
        }

        const book = await Books.findByPk(req.params.id)
        if (!book) {
            return res.status(404).json({ msg: "Buku tidak ditemukan "})
        }


        await book.update(updateData);

        res.json({ msg: "Buku Berhasil diedit"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};


export const deleteBook = async (req, res) => {
    try {
        if (req.role === "pengunjung"){
            return res.status(403).json({ msg: "Akses Ditolak"})
        }

        const book = await Books.findByPk(req.params.id)
        if (!book) {
            return res.status(404).json({ msg: "Buku tidak ditemukan "})
        }

        await book.destroy({
            where: {
                id : req.params.id
            }
        });
        
        await book.destroy();

        res.json({ msg: "Buku Berhasil dihapus"})

    } catch (error) {
        console.error();
        res.status(500).json({ msg: "Internal Server Error"})
    }
};
