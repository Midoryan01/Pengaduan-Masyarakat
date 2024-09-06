import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Pengaduan = db.define(
  "pengaduan",
  {
    id_pengaduan: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    alamat: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    agama: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    keperluan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    telp_email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    umur: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    bukti: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Proses", "Selesai"),
      defaultValue: "Proses",
    },
  },
  {
    tableName: "pengaduan",
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Uncomment the line below if you need to sync the model
// await Pengaduan.sync();
export default Pengaduan;
