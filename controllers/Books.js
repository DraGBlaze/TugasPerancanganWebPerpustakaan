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