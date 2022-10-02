import prisma from "../../../libs/prisma";
import moment from "moment";

export default async (req, res) => {
  try {
    const getPenjualan = await prisma.headerPenjualan.findMany({
      orderBy: {
        id: "asc",
      },
      include: {
        kontak: true,
        PenerimaanPembayaran: true,
      },
    });

    const newPenjualanArray = [];
    getPenjualan.map((i) => {
      if (i.tgl_kontrak_expired < moment().format("YYYY/MM/DD") && i.sisa_tagihan > 0) {
        newPenjualanArray.push({
          key: i.id,
          id: i.id,
          tipe_perusahaan: i.tipe_perusahaan,
          nomor: `Sales Invoice #${i.id}`,
          custom_invoice: i.custom_invoice,
          pelanggan: i.kontak.nama_perusahaan,
          tgl_kontrak_mulai: moment(i.tgl_kontrak_mulai).format("DD MMMM, YYYY"),
          tgl_kontrak_habis: moment(i.tgl_kontrak_expired).format("DD MMMM, YYYY"),
          status: "Jatuh Tempo",
          sisa_tagihan: `Rp. ${i.sisa_tagihan.toLocaleString()}`,
          PenerimaanPembayaran: i.PenerimaanPembayaran,
        });
      } else if ((i.tgl_kontrak_expired > moment().format("YYYY/MM/DD") && i.sisa_tagihan > 0) || i.sisa_tagihan == 0) {
        newPenjualanArray.push({
          key: i.id,
          id: i.id,
          tipe_perusahaan: i.tipe_perusahaan,
          nomor: `Sales Invoice #${i.id}`,
          custom_invoice: i.custom_invoice,
          pelanggan: i.kontak.nama_perusahaan,
          tgl_kontrak_mulai: moment(i.tgl_kontrak_mulai).format("DD MMMM, YYYY"),
          tgl_kontrak_habis: moment(i.tgl_kontrak_expired).format("DD MMMM, YYYY"),
          status: i.status,
          sisa_tagihan: `Rp. ${i.sisa_tagihan.toLocaleString()}`,
          PenerimaanPembayaran: i.PenerimaanPembayaran,
        });
      }
    });

    res.status(201).json({ message: "Get all penjualan success", getPenjualan, newPenjualanArray });
  } catch (error) {
    res.status(400).json({ message: "Get all penjualan failed", error });
    console.log(error);
  }
};
