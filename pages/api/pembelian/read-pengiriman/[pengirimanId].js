import moment from "moment";
import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { pengirimanId } = req.query;

    const pengirimanPembayaran = await prisma.pengirimanBayaran.findFirst({
      where: {
        id: +pengirimanId,
      },
      include: {
        akun: true,
        cara_pembayaran: true,
        header_pembelian: {
          include: {
            kontak: true,
          },
        },
      },
    });

    const newPengirimanArray = [];
    newPengirimanArray.push({
      id: pengirimanPembayaran.id,
      header_pembelian_id: pengirimanPembayaran.header_pembelian_id,
      invoice: "Purchase Invoice #" + pengirimanPembayaran.header_pembelian.id,
      nama_supplier: pengirimanPembayaran.header_pembelian.kontak.nama_perusahaan,
      bayar_dari: pengirimanPembayaran.akun.kode_akun + " - " + pengirimanPembayaran.akun.nama_akun,
      tgl_pembayaran: moment(pengirimanPembayaran.tgl_pembayaran).format("DD MMMM, YYYY"),
      deskripsi: pengirimanPembayaran.deskripsi,
      cara_pembayaran: pengirimanPembayaran.cara_pembayaran.nama,
      no_transaksi: "Pengiriman Pembayaran #" + pengirimanPembayaran.id,
      no_ref: pengirimanPembayaran.header_pembelian.no_ref_penagihan,
      deskripsi: pengirimanPembayaran.deskripsi,
      tgl_jatuh_tempo: pengirimanPembayaran.header_pembelian.tgl_jatuh_tempo,
      sisa_tagihan: pengirimanPembayaran.header_pembelian.sisa_tagihan,
      jumlah: pengirimanPembayaran.jumlah,
      pengirimanPembayaran: pengirimanPembayaran.jumlah,
    });

    const getAkunBayarDari = await prisma.akun.findMany({
      where: {
        kategoriId: 3,
      },
    });

    const getCaraPembayaran = await prisma.caraPembayaran.findMany();

    res.status(201).json({
      message: "Find current penerimaan success",
      pengirimanPembayaran,
      newPengirimanArray,
      getAkunBayarDari,
      getCaraPembayaran,
    });
  } catch (error) {
    res.status(400).json({ message: "Find current penerimaan failed", error });
    console.log(error);
  }
};
