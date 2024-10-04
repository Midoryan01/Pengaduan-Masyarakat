import Tanggapan from "../models/TanggapanModel.js";
import Pengaduan from "../models/PengaduanModel.js";
import Petugas from "../models/PetugasModel.js";
import db from "../config/Database.js"; // Mengimpor instance Sequelize


// Mendapatkan semua tanggapan
export const getAllTanggapan = async (req, res) => {
  try {
    const tanggapan = await Tanggapan.findAll({
      include: [
        { model: Pengaduan, attributes: ['nama'] },
        { model: Petugas, as: 'petugas', attributes: ['nama'] }  // Pastikan 'as' sesuai dengan alias yang benar
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
  const t = await db.transaction();
  try {
    const { id_pengaduan, id_petugas, tanggal, tanggapan, tindak_lanjut, keterangan } = req.body;

    // Cek apakah pengaduan sudah ada
    const pengaduan = await Pengaduan.findByPk(id_pengaduan, { transaction: t });
    if (!pengaduan) {
      await t.rollback();
      return res.status(404).json({ message: "Pengaduan tidak ditemukan" });
    }

    // Cek apakah pengaduan sudah memiliki tanggapan
    const existingTanggapan = await Tanggapan.findOne({
      where: { id_pengaduan },
      transaction: t
    });
    if (existingTanggapan) {
      await t.rollback();
      return res.status(400).json({ message: "Pengaduan ini sudah memiliki tanggapan" });
    }

    // Cek apakah petugas ada
    const petugas = await Petugas.findByPk(id_petugas, { transaction: t });
    if (!petugas) {
      await t.rollback();
      return res.status(404).json({ message: "Petugas tidak ditemukan" });
    }

    // Buat tanggapan baru
    const newTanggapan = await Tanggapan.create({
      id_pengaduan,
      id_petugas,
      tanggal,
      tanggapan,
      tindak_lanjut,
      keterangan
    }, { transaction: t });

    // Update status pengaduan menjadi 'Selesai'
    await pengaduan.update({ status: 'Selesai' }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: "Tanggapan berhasil dibuat dan status pengaduan diperbarui",
      tanggapan: newTanggapan
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Terjadi kesalahan saat membuat tanggapan", error: error.message });
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
