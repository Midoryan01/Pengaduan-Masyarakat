import Petugas from "../models/PetugasModel.js";
import bcrypt from "bcrypt";

// Mendapatkan semua petugas
export const getAllPetugas = async (req, res) => {
  try {
    const petugas = await Petugas.findAll();
    res.status(200).json(petugas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan petugas berdasarkan ID
export const getPetugasById = async (req, res) => {
  try {
    const { id } = req.params;
    const petugas = await Petugas.findByPk(id);
    if (!petugas) {
      return res.status(404).json({ message: "Petugas tidak ditemukan" });
    }
    res.status(200).json(petugas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat petugas baru
export const createPetugas = async (req, res) => {
  try {
    const { nama, jabatan, username, password } = req.body;

    // Hashing password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPetugas = await Petugas.create({
      nama,
      jabatan,
      username,
      password: hashedPassword,
    });

    res.status(201).json(newPetugas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui data petugas
export const updatePetugas = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jabatan, username, password } = req.body;
    const petugas = await Petugas.findByPk(id);

    if (!petugas) {
      return res.status(404).json({ message: "Petugas tidak ditemukan" });
    }

    petugas.nama = nama || petugas.nama;
    petugas.jabatan = jabatan || petugas.jabatan;
    petugas.username = username || petugas.username;

    // Update password jika diberikan
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      petugas.password = hashedPassword;
    }

    await petugas.save();
    res.status(200).json({ message: "Petugas diperbarui", petugas });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus petugas
export const deletePetugas = async (req, res) => {
  try {
    const { id } = req.params;
    const petugas = await Petugas.findByPk(id);

    if (!petugas) {
      return res.status(404).json({ message: "Petugas tidak ditemukan" });
    }

    await petugas.destroy();
    res.status(200).json({ message: "Petugas dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
