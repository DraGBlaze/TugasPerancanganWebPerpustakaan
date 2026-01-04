import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Books = db.define(
    'books',
    {
        judul_buku: {
            type: DataTypes.STRING,
            allowNull: false
        },
        kode_buku: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        pengarang: {
            type: DataTypes.STRING,
            allowNull: false
        },
        penerbit: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tahun_terbit: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min:1000,
                max: 2026
            },
        },
        kategori: {
            type: DataTypes.ENUM('romance', 'horror', 'fantasy', 'comedy', 'Drama', 'Mystery', 'Thriller', 'Adventure', 'Science-Fiction', 'Histori'),
            allowNull: false
        },
        rak: {
            type: DataTypes.STRING,
            allowNull: false
        },
        stok: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
    }
);

export default Books;