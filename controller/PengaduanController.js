import Pengaduan from "../models/PengaduanModel.js";

// Mendapatkan semua pengaduan
export const getAllPengaduan = async (req, res) => {
  try {
    const pengaduan = await Pengaduan.findAll();
    res.status(200).json(pengaduan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan pengaduan berdasarkan ID
export const getPengaduanById = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);
    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan" });
    }
    res.status(200).json(pengaduan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat pengaduan baru
export const createPengaduan = async (req, res) => {
  try {
    const { nama, alamat, nik, agama, keperluan, telp_email, umur, bukti } = req.body;

    // Validasi input
    if (!nama || !alamat || !nik || !agama || !keperluan || !telp_email || !umur) {
      return res.status(400).json({ message: "Semua field harus diisi." });
    }

    const newPengaduan = await Pengaduan.create({
      nama,
      alamat,
      nik,
      agama,
      keperluan,
      telp_email,
      umur,
      bukti,
      status: "Proses", // Set status default ke "Proses"
    });

    // Menampilkan pesan sukses
    res.status(201).json({
      message: "Pengaduan berhasil dibuat.",
      pengaduan: newPengaduan
    });
  } catch (error) {
    // Menampilkan pesan error
    res.status(500).json({
      message: "Gagal membuat pengaduan.",
      error: error.message
    });
  }
};


// Memperbarui pengaduan
export const updatePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, alamat, nik, agama, keperluan, telp_email, umur, bukti, status } = req.body;
    
    // Temukan pengaduan berdasarkan ID
    const pengaduan = await Pengaduan.findByPk(id);

    // Jika pengaduan tidak ditemukan, tampilkan pesan error
    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan" });
    }

    // Perbarui field hanya jika ada di req.body
    if (nama !== undefined) pengaduan.nama = nama;
    if (alamat !== undefined) pengaduan.alamat = alamat;
    if (nik !== undefined) pengaduan.nik = nik;
    if (agama !== undefined) pengaduan.agama = agama;
    if (keperluan !== undefined) pengaduan.keperluan = keperluan;
    if (telp_email !== undefined) pengaduan.telp_email = telp_email;
    if (umur !== undefined) pengaduan.umur = umur;
    if (bukti !== undefined) pengaduan.bukti = bukti;
    if (status !== undefined) pengaduan.status = status;

    // Simpan perubahan ke database
    await pengaduan.save();

    // Tampilkan pesan sukses
    res.status(200).json({
      message: "Pengaduan berhasil diperbarui",
      pengaduan
    });
  } catch (error) {
    // Tampilkan pesan error jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal memperbarui pengaduan.",
      error: error.message
    });
  }
};


// Menghapus pengaduan
export const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan" });
    }

    await pengaduan.destroy();
    res.status(200).json({ message: "Pengaduan dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
