import { Sequelize } from 'sequelize';

// Mengkoneksikan Ke Database perpustakaan
const db = new Sequelize('perpustakaan', 'root', '', {
    host: `localhost` ,
    dialect: 'mysql' ,
});

export default db;