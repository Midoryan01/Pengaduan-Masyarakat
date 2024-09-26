import { Sequelize, DataTypes } from "sequelize"; // Pastikan DataTypes diimpor
import db from "../config/Database.js";
import Pengaduan from "./PengaduanModel.js";
import Petugas from "./PetugasModel.js";

const Tanggapan = db.define('Tanggapan', {
    id_tanggapan: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_pengaduan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pengaduan, // Menggunakan model yang diimport
            key: 'id_pengaduan'
        }
    },
    id_petugas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Petugas, // Menggunakan model yang diimport
            key: 'id_petugas'
        }
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tanggapan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tindak_lanjut: {
        type: DataTypes.STRING(250),
        allowNull: true
    },
    keterangan: {
        type: DataTypes.STRING(250),
        allowNull: true
    }
}, {
    tableName: 'tanggapan',
    timestamps: false
});

Tanggapan.belongsTo(Pengaduan, { foreignKey: 'id_pengaduan' });
Tanggapan.belongsTo(Petugas, { foreignKey: 'id_petugas' });
Pengaduan.hasMany(Tanggapan, { foreignKey: 'id_pengaduan' });
Petugas.hasMany(Tanggapan, { foreignKey: 'id_petugas' });

// Uncomment the line below if you need to sync the model
// await Tanggapan.sync();

export default Tanggapan;