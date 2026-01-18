import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define(
    'users',
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'staff', 'pengunjung'),
            allowNull: true,
            defaultValue: "pengunjung"
        },
        refreshToken: {
            type: DataTypes.TEXT
        },
    },
    {
        freezeTableName: true,
    }
);

export default Users;