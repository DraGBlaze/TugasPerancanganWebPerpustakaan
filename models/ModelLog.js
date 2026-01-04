import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Logs = db.define(
    'logs',
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            
        },
        status: {
            type: DataTypes.ENUM("dipinjam", "dikembalikan", "pending"),
            allowNull: false,
        },
        diproses_oleh: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
    },
    {
        freezeTableName: true,
    }
);

export default Logs;