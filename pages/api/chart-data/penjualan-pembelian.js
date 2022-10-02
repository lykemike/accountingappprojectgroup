import prisma from "../../../libs/prisma";
import moment from "moment";

export default async (req, res) => {
  try {
    const currentDate = moment().format("YYYY/MM/DD");
    const getAllPenjualan = await prisma.headerPenjualan.findMany();

    let penjualanJatuhTempo = [];
    let penjualanLunas = [];
    let totalJatuhTempoPenjualan = 0;
    let totalJatuhTempoPembelian = 0;

    getAllPenjualan?.map((i, index) => {
      if (i.tgl_kontrak_expired <= currentDate && i.sisa_tagihan > 0) {
        penjualanJatuhTempo.push(i);
        totalJatuhTempoPenjualan += 1;
      }
    });

    const penjualanJatuhTempoTotal = penjualanJatuhTempo.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const penjualanBelumBayarTotal = getAllPenjualan.reduce((a, b) => (a = a + b.sisa_tagihan), 0);

    getAllPenjualan?.map((i) => {
      if (i.sisa_tagihan == 0) {
        penjualanLunas.push(i);
      }
    });

    const penjualanLunasTotal = penjualanLunas.reduce((a, b) => (a = a + b.total), 0);
    const allPenjualan = [penjualanLunasTotal, penjualanJatuhTempoTotal, penjualanBelumBayarTotal];

    const getAllPembelian = await prisma.headerPembelian.findMany();
    let pembelianJatuhTempo = [];

    getAllPembelian?.map((i, index) => {
      if (i.tgl_jatuh_tempo <= currentDate && i.sisa_tagihan > 0) {
        pembelianJatuhTempo.push(i);
        totalJatuhTempoPembelian += 1;
      }
    });

    const pembelianJatuhTempoTotal = pembelianJatuhTempo.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const pembelianBelumBayarTotal = getAllPembelian.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const allPembelian = [pembelianJatuhTempoTotal, pembelianBelumBayarTotal];

    res.status(201).json({
      message: "Get penjualan statistik success",
      allPenjualan,
      allPembelian,
      totalJatuhTempoPenjualan,
      totalJatuhTempoPembelian,
    });
  } catch (error) {
    res.status(400).json({ message: "Get penjualan statistik failed", error });
    console.log(error);
  }
};
