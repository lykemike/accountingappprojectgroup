import prisma from "../../../libs/prisma";
import moment from "moment";

export default async (req, res) => {
  try {
    const getAllPenjualan = await prisma.headerPenjualan.findMany();

    const tagihanBelumDiBayar = getAllPenjualan.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const tagihanBelumDiBayarNew = tagihanBelumDiBayar.toLocaleString();
    const currentDate = moment().format("YYYY/MM/DD");

    const tagihanJatuhTempoArray = [];

    getAllPenjualan?.map((i, index) => {
      if (i.tgl_kontrak_expired <= currentDate && i.sisa_tagihan > 0) {
        tagihanJatuhTempoArray.push(i);
      }
    });

    const tagihanJatuhTempo = tagihanJatuhTempoArray.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const tagihanJatuhTempoNew = tagihanJatuhTempo.toLocaleString();

    const tagihanLunasArray = [];
    getAllPenjualan?.map((i) => {
      if (i.sisa_tagihan == 0) {
        tagihanLunasArray.push(i);
      }
    });

    const tagihanLunas = tagihanLunasArray.reduce((a, b) => (a = a + b.total), 0);
    const tagihanLunasNew = tagihanLunas.toLocaleString();

    const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
    const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");

    const tagihanBulanIniArray = [];
    getAllPenjualan?.map((i, index) => {
      if (i.tgl_kontrak_mulai >= startOfMonth && i.tgl_kontrak_mulai <= endOfMonth) {
        tagihanBulanIniArray.push(i);
      }
    });

    const tagihanBulanIni = tagihanBulanIniArray.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const tagihanBulanIniNew = tagihanBulanIni.toLocaleString();

    res.status(201).json({
      message: "Get penjualan statistik success",
      tagihanBelumDiBayarNew,
      tagihanJatuhTempoNew,
      tagihanLunasNew,
      tagihanBulanIniNew,
    });
  } catch (error) {
    res.status(400).json({ message: "Get penjualan statistik failed", error });
    console.log(error);
  }
};
