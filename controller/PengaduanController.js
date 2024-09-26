import Pengaduan from "../models/PengaduanModel.js";
import upload from "../middlewares/upload.js";
import fs from "fs";
import path from "path";
import multer from 'multer'; 

// Fungsi helper untuk validasi input
// const validateInput = ({ nik, umur, telp_email }) => {
//   const nikPattern = /^\d{16}$/;
//   const umurPattern = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
//   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phonePattern = /^\d{10,15}$/;

//   // Mengizinkan input "-" atau kosong untuk NIK, umur, dan telp_email
//   if (nik !== '-' && nik !== '' && !nikPattern.test(nik)) {
//     return { valid: false, message: "NIK harus terdiri dari 16 digit angka atau tanda '-' jika tidak ada." };
//   }

//   if (umur !== '-' && umur !== '' && !umurPattern.test(umur)) {
//     return { valid: false, message: "Umur harus antara 1-120 atau tanda '-' jika tidak ada." };
//   }

//   if (telp_email !== '-' && telp_email !== '' && !emailPattern.test(telp_email) && !phonePattern.test(telp_email)) {
//     return { valid: false, message: "Telp/Email harus valid atau tanda '-' jika tidak ada." };
//   }

//   return { valid: true };
// };



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
  const uploadMiddleware = upload.single('bukti');

  uploadMiddleware(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: "Error saat mengunggah file: " + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { nama, alamat, nik, agama, keperluan, telp_email, umur } = req.body;

      

      // Jika file tidak ada, tetap lanjutkan tanpa menyimpan file bukti
      const fileName = req.file ? req.file.filename : null;

      // Ubah nilai '-' menjadi null sebelum menyimpan ke database
      const newPengaduan = await Pengaduan.create({
        nama,
        alamat,
        nik, // Ubah '-' menjadi null
        agama,
        keperluan,
        telp_email, // Ubah '-' menjadi null
        umur, // Ubah '-' menjadi null
        bukti: fileName,  // bukti bisa null jika tidak ada
        status: "Proses"
      });

      return res.status(201).json({
        message: "Pengaduan berhasil dibuat.",
        pengaduan: {
          ...newPengaduan.toJSON(),
          buktiUrl: fileName ? `http://localhost:5000/images/${fileName}` : null  // Jika ada bukti, buat URL, jika tidak ada biarkan null
        }
      });
    } catch (error) {
      console.error(`[POST Create] Error: ${error.message}`);
      // Hapus file jika ada kesalahan dan file terunggah
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ message: "Terjadi kesalahan saat membuat pengaduan." });
    }
  });
};




// Controller: Memperbarui pengaduan
export const updatePengaduan = async (req, res) => {
  const uploadMiddleware = upload.single('bukti');

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error saat mengunggah file: " + err.message });
    }

    try {
      const { id } = req.params;
      const fieldsToUpdate = req.body;

      const pengaduan = await Pengaduan.findByPk(id);
      if (!pengaduan) {
        return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
      }

      const validation = validateInput({
        nik: fieldsToUpdate.nik || pengaduan.nik,
        umur: fieldsToUpdate.umur || pengaduan.umur,
        telp_email: fieldsToUpdate.telp_email || pengaduan.telp_email,
      });
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      if (req.file) {
        if (pengaduan.bukti) {
          const oldFilePath = path.join('public/images', pengaduan.bukti);
          fs.unlink(oldFilePath, (err) => {
            if (err) console.error("Error menghapus file lama:", err);
          });
        }
        fieldsToUpdate.bukti = req.file.filename;
      }

      await pengaduan.update(fieldsToUpdate);
      
      const updatedPengaduan = await Pengaduan.findByPk(id);
      return res.status(200).json({
        message: "Pengaduan berhasil diperbarui.",
        pengaduan: {
          ...updatedPengaduan.toJSON(),
          buktiUrl: updatedPengaduan.bukti ? `http://localhost:5000/images/${updatedPengaduan.bukti}` : null
        }
      });
    } catch (error) {
      console.error(`[PUT Update] Error: ${error.message}`);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ message: "Terjadi kesalahan saat memperbarui pengaduan." });
    }
  });
};

// Controller: Menghapus pengaduan
export const deletePengaduan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengaduan = await Pengaduan.findByPk(id);

    if (!pengaduan) {
      return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
    }

    if (pengaduan.bukti) {
      const filePath = path.join('public/images', pengaduan.bukti);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error menghapus file:", err);
      });
    }

    await pengaduan.destroy();
    return res.status(200).json({ message: "Pengaduan berhasil dihapus." });
  } catch (error) {
    console.error(`[DELETE] Error: ${error.message}`);
    return res.status(500).json({ message: "Terjadi kesalahan saat menghapus pengaduan." });
  }
};