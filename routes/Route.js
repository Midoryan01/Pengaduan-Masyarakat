import express from 'express';
import { getAllPengaduan, createPengaduan, getPengaduanById, updatePengaduan, deletePengaduan } from '../controller/PengaduanController.js';
import { createPetugas, deletePetugas, getAllPetugas, updatePetugas } from '../controller/PetugasController.js';
import { createTanggapan, deleteTanggapan, getAllTanggapan, getTanggapanById, updateTanggapan } from '../controller/TanggapanController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

router.get('/pengaduan', getAllPengaduan)
router.get('/pengaduan/:id', getPengaduanById)
router.post('/pengaduan', upload.single('bukti'), createPengaduan);
router.patch('/pengaduan/:id', updatePengaduan);
router.delete('/pengaduan/:id', deletePengaduan);

router.get('/petugas', getAllPetugas)
router.get('/petugas/:id', getPengaduanById)
router.post('/petugas', createPetugas)
router.patch('/petugas/:id', updatePetugas);
router.delete('/petugas/:id', deletePetugas);

router.get('/tanggapan', getAllTanggapan)
router.get('/tanggapan/:id', getTanggapanById)
router.post('/tanggapan', createTanggapan)
router.patch('/tanggapan/:id', updateTanggapan);
router.delete('/tanggapan/:id', deleteTanggapan);

export default router;
