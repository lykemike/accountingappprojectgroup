import prisma from "../../../libs/prisma";
import moment from "moment";

export default async (req, res) => {
  try {
    const getPembelian = await prisma.headerPembelian.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        kontak: true,
        PengirimanBayaran: true,
      },
    });

    const newPembelianArray = [];
    getPembelian.map((i) => {
      if (i.tgl_jatuh_tempo < moment().format("YYYY/MM/DD") && i.sisa_tagihan > 0) {
        newPembelianArray.push({
          key: i.id,
          id: i.id,
          nomor: `Purchase Invoice Invoice #${i.id}`,
          no_ref_penagihan: i.no_ref_penagihan,
          pelanggan: i.kontak.nama_perusahaan,
          tgl_transaksi: moment(i.tgl_transaksi).format("DD MMMM, YYYY"),
          tgl_jatuh_tempo: moment(i.tgl_jatuh_tempo).format("DD MMMM, YYYY"),
          status: "Jatuh Tempo",
          sisa_tagihan: `Rp. ${i.sisa_tagihan.toLocaleString()}`,
          PengirimanBayaran: i.PengirimanBayaran,
        });
      } else if ((i.tgl_jatuh_tempo > moment().format("YYYY/MM/DD") && i.sisa_tagihan > 0) || i.sisa_tagihan == 0) {
        newPembelianArray.push({
          key: i.id,
          id: i.id,
          nomor: `Purchase Invoice Invoice #${i.id}`,
          no_ref_penagihan: i.no_ref_penagihan,
          pelanggan: i.kontak.nama_perusahaan,
          tgl_transaksi: moment(i.tgl_transaksi).format("DD MMMM, YYYY"),
          tgl_jatuh_tempo: moment(i.tgl_jatuh_tempo).format("DD MMMM, YYYY"),
          status: i.status,
          sisa_tagihan: `Rp. ${i.sisa_tagihan.toLocaleString()}`,
          PengirimanBayaran: i.PengirimanBayaran,
        });
      }
    });

    res.status(201).json({ message: "Get all pembelian success", newPembelianArray });
  } catch (error) {
    res.status(400).json({ message: "Get all pembelian failed", error });
    console.log(error);
  }
};
