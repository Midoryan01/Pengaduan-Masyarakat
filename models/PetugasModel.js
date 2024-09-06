import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Petugas = db.define(
  "Petugas",
  {
    id_petugas: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    jabatan: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    tableName: "petugas",
    timestamps: false,
  }
);

// Uncomment the line below if you need to sync the model
// await Petugas.sync();

export default Petugas;
