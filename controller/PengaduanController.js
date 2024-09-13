import Pengaduan from "../models/PengaduanModel.js";
import path from "path";

// Fungsi helper untuk validasi input
const validateInput = ({ nik, umur, telp_email }) => {
  const nikPattern = /^\d{16}$/;
  const umurPattern = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^\d{10,15}$/;

  if (!nikPattern.test(nik)) {
    return { valid: false, message: "NIK harus terdiri dari 16 digit angka." };
  }

  if (!umurPattern.test(umur)) {
    return { valid: false, message: "Umur harus antara 1-120." };
  }

  if (!emailPattern.test(telp_email) && !phonePattern.test(telp_email)) {
    return { valid: false, message: "Telp/Email harus valid." };
  }

  return { valid: true };
};

// Controller: Mendapatkan semua pengaduan
export const getAllPengaduan = async (req, res) => {
  try {
    const pengaduan = await Pengaduan.findAll();
    return res.status(200).json(pengaduan);
  } catch (error) {
    console.error(`[GET All] Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller: Mendapatkan pengaduan berdasarkan ID
export const getPengaduanById = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }

    return res.status(200).json(pengaduan);
  } catch (error) {
    console.error(`[GET By ID] Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller: Membuat pengaduan baru
export const createPengaduan = async (req, res) => {
  try {
    const { nama, alamat, nik, agama, keperluan, telp_email, umur } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File bukti harus diunggah." });
    }

    const validation = validateInput({ nik, umur, telp_email });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}${ext}`;

    const newPengaduan = await Pengaduan.create({
      nama,
      alamat,
      nik,
      agama,
      keperluan,
      telp_email,
      umur,
      bukti: fileName,
    });

    return res.status(201).json({
      message: "Pengaduan berhasil dibuat.",
      pengaduan: newPengaduan,
    });
  } catch (error) {
    console.error(`[POST Create] Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller: Memperbarui pengaduan
export const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldsToUpdate = req.body;

    const pengaduan = await Pengaduan.findByPk(id);
    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }

    const validation = validateInput({
      nik: fieldsToUpdate.nik,
      umur: fieldsToUpdate.umur,
      telp_email: fieldsToUpdate.telp_email,
    });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    await pengaduan.update(fieldsToUpdate);
    return res.status(200).json({
      message: "Pengaduan berhasil diperbarui.",
      pengaduan,
    });
  } catch (error) {
    console.error(`[PUT Update] Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Controller: Menghapus pengaduan
export const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }

    await pengaduan.destroy();
    return res.status(200).json({ message: "Pengaduan berhasil dihapus." });
  } catch (error) {
    console.error(`[DELETE] Error: ${error.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};
