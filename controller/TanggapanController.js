import Tanggapan from "../models/TanggapanModel.js";
import Pengaduan from "../models/PengaduanModel.js";
import Petugas from "../models/PetugasModel.js";

// Mendapatkan semua tanggapan
export const getAllTanggapan = async (req, res) => {
  try {
    const tanggapan = await Tanggapan.findAll({
      include: [
        { model: Pengaduan, attributes: ['nama'] },
        { model: Petugas, attributes: ['nama'] }
      ]
    });
    res.status(200).json(tanggapan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan tanggapan berdasarkan ID
export const getTanggapanById = async (req, res) => {
  try {
    const { id } = req.params;
    const tanggapan = await Tanggapan.findByPk(id, {
      include: [
        { model: Pengaduan, attributes: ['nama'] },
        { model: Petugas, attributes: ['nama'] }
      ]
    });
    if (!tanggapan) {
      return res.status(404).json({ message: "Tanggapan tidak ditemukan" });
    }
    res.status(200).json(tanggapan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat tanggapan baru
export const createTanggapan = async (req, res) => {
  try {
    const { id_pengaduan, id_petugas, tanggal, tanggapan, tindak_lanjut, keterangan } = req.body;
    const newTanggapan = await Tanggapan.create({
      id_pengaduan,
      id_petugas,
      tanggal,
      tanggapan,
      tindak_lanjut,
      keterangan
    });
    res.status(201).json(newTanggapan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Memperbarui tanggapan
export const updateTanggapan = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_pengaduan, id_petugas, tanggal, tanggapan, tindak_lanjut, keterangan } = req.body;
    const tanggapanExist = await Tanggapan.findByPk(id);

    if (!tanggapanExist) {
      return res.status(404).json({ message: "Tanggapan tidak ditemukan" });
    }

    tanggapanExist.id_pengaduan = id_pengaduan || tanggapanExist.id_pengaduan;
    tanggapanExist.id_petugas = id_petugas || tanggapanExist.id_petugas;
    tanggapanExist.tanggal = tanggal || tanggapanExist.tanggal;
    tanggapanExist.tanggapan = tanggapan || tanggapanExist.tanggapan;
    tanggapanExist.tindak_lanjut = tindak_lanjut || tanggapanExist.tindak_lanjut;
    tanggapanExist.keterangan = keterangan || tanggapanExist.keterangan;

    await tanggapanExist.save();
    res.status(200).json({ message: "Tanggapan diperbarui", tanggapan: tanggapanExist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus tanggapan
export const deleteTanggapan = async (req, res) => {
  try {
    const { id } = req.params;
    const tanggapan = await Tanggapan.findByPk(id);

    if (!tanggapan) {
      return res.status(404).json({ message: "Tanggapan tidak ditemukan" });
    }

    await tanggapan.destroy();
    res.status(200).json({ message: "Tanggapan dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
