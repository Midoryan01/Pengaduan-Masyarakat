import Pengaduan from "../models/PengaduanModel.js";
import path from "path";

// Mendapatkan semua pengaduan
export const getAllPengaduan = async (req, res) => {
  try {
    const pengaduan = await Pengaduan.findAll();
    res.status(200).json(pengaduan);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
    console.error(`[GET All] Error: ${error.message}`);
  }
};

// Mendapatkan pengaduan berdasarkan ID
export const getPengaduanById = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);
    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }
    res.status(200).json(pengaduan);
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
    console.error(`[GET By ID] Error: ${error.message}`);
  }
};

// Fungsi validasi input
const validateInput = ({ nik, umur, telp_email }) => {
  // Validasi NIK
  if (nik.length !== 16 || !/^\d+$/.test(nik)) {
    return { valid: false, message: "NIK harus berupa 16 digit angka." };
  }

  // Validasi Umur
  const umurInt = parseInt(umur, 10);
  if (isNaN(umurInt) || umurInt <= 0 || umurInt > 120) {
    return { valid: false, message: "Umur tidak valid." };
  }

  // Pola untuk memvalidasi email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Pola untuk memvalidasi nomor telepon (contoh: 10-15 digit, hanya angka)
  const phonePattern = /^\d{10,15}$/;

  // Memeriksa apakah input adalah email
  if (emailPattern.test(telp_email)) {
    return { valid: true, type: 'email' };
  }

  // Memeriksa apakah input adalah nomor telepon
  if (phonePattern.test(telp_email)) {
    return { valid: true, type: 'phone' };
  }

  // Jika tidak valid
  return { valid: false, message: "Input tidak valid. Harus berupa email atau nomor telepon." };
};


// Controller untuk membuat pengaduan
export const createPengaduan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diunggah." });
    }

    const { nama, alamat, nik, agama, keperluan, telp_email, umur } = req.body;
    const file = req.file;
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}${ext}`;

    const validation = validateInput({ nik, umur, telp_email });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    await Pengaduan.create({
      nama,
      bukti: fileName,
      alamat,
      nik,
      agama,
      keperluan,
      telp_email,
      umur,
    });

    res.status(201).json({ message: "Pengaduan berhasil dibuat." });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server." });
    console.error(`[POST Create] Error: ${error.message}`);
  }
};

// Memperbarui pengaduan
export const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nama,
      alamat,
      nik,
      agama,
      keperluan,
      telp_email,
      umur,
      bukti,
      status,
    } = req.body;

    const pengaduan = await Pengaduan.findByPk(id);
    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }

    // Membuat objek untuk field yang diubah
    const fieldsToUpdate = {};
    if (nama) fieldsToUpdate.nama = nama;
    if (alamat) fieldsToUpdate.alamat = alamat;
    if (nik) fieldsToUpdate.nik = nik;
    if (agama) fieldsToUpdate.agama = agama;
    if (keperluan) fieldsToUpdate.keperluan = keperluan;
    if (telp_email) fieldsToUpdate.telp_email = telp_email;
    if (umur) fieldsToUpdate.umur = umur;
    if (bukti) fieldsToUpdate.bukti = bukti;
    if (status) fieldsToUpdate.status = status;

    // Hanya update field yang diubah
    await pengaduan.update(fieldsToUpdate);

    res.status(200).json({
      message: "Pengaduan berhasil diperbarui.",
      pengaduan,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui pengaduan." });
    console.error(`[PUT Update] Error: ${error.message}`);
  }
};


// Menghapus pengaduan
export const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }

    await pengaduan.destroy();
    res.status(200).json({ message: "Pengaduan berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pengaduan." });
    console.error(`[DELETE] Error: ${error.message}`);
  }
};
