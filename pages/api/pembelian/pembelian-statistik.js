import prisma from "../../../libs/prisma";
import moment from "moment";

export default async (req, res) => {
  try {
    const getAllPembelian = await prisma.headerPembelian.findMany();

    const tagihanBelumDiBayar = getAllPembelian.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const tagihanBelumDiBayarNew = tagihanBelumDiBayar.toLocaleString();
    const currentDate = moment().format("YYYY/MM/DD");

    const tagihanJatuhTempoArray = [];

    getAllPembelian?.map((i, index) => {
      if (i.tgl_jatuh_tempo < currentDate) {
        tagihanJatuhTempoArray.push(i);
      }
    });

    const tagihanJatuhTempo = tagihanJatuhTempoArray.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const tagihanJatuhTempoNew = tagihanJatuhTempo.toLocaleString();

    const startOfMonth = moment().startOf("month").format("YYYY/MM/DD");
    const endOfMonth = moment().endOf("month").format("YYYY/MM/DD");

    const tagihanBulanIniArray = [];
    getAllPembelian?.map((i, index) => {
      if (i.tgl_transaksi >= startOfMonth && i.tgl_transaksi <= endOfMonth) {
        tagihanBulanIniArray.push(i);
      }
    });

    const tagihanBulanIni = tagihanBulanIniArray.reduce((a, b) => (a = a + b.sisa_tagihan), 0);
    const tagihanBulanIniNew = tagihanBulanIni.toLocaleString();

    res.status(201).json({
      message: "Get pembelian statistik success",
      tagihanBelumDiBayarNew,
      tagihanJatuhTempoNew,
      tagihanBulanIniNew,
    });
  } catch (error) {
    res.status(400).json({ message: "Get pembelian statistik failed", error });
    console.log(error);
  }
};
