import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { penjualanId } = req.query;
    const getHeaderPenjualan = await prisma.headerPenjualan.findFirst({
      where: {
        id: +penjualanId,
      },
      include: {
        pajak: true,
        kontak: true,
        DetailPenjualan: {
          include: {
            produk: true,
          },
        },
        PenerimaanPembayaran: true,
        JurnalPenerimaanPembayaran: true,
        syarat_pembayaran: true,
      },
    });

    const getAkunSetor = await prisma.akun.findMany({
      where: {
        kategoriId: 3,
      },
    });

    const getPajak = await prisma.pajak.findMany({
      include: {
        pajak_masukan: true,
      },
    });

    const getKontak = await prisma.kontak.findMany({
      include: {
        KontakDetail: {
          where: { kontak_type_id: 1 },
        },
        syarat_pembayaran: true,
      },
    });

    let newKontaksArray = [];
    getKontak.map((i) => {
      newKontaksArray.push({
        id: i.id,
        nama_perusahaan: i.nama_perusahaan,
        email: i.email,
        alamat_perusahaan: i.alamat_perusahaan,
        syarat_pembayaran_id: i.syarat_pembayaran_id,
        syarat_pembayaran_nama: i.syarat_pembayaran.nama,
        nomor_npwp: i.nomor_npwp,
      });
    });

    const getSyaratPembayaran = await prisma.syaratPembayaran.findMany();
    const getProduks = await prisma.produk.findMany();

    let newProduksArray = [];
    getProduks.map((i) => {
      newProduksArray.push({
        id: i.id,
        nama: i.nama,
        deskripsi: i.deskripsi,
        harga: i.harga,
      });
    });

    const getPajaks = await prisma.pajak.findMany({
      include: {
        pajak_keluaran: true,
      },
    });

    let newPajaksArray = [];
    getPajaks.map((i) => {
      newPajaksArray.push({
        id: i.id,
        nama: i.nama,
        persen: i.presentase_aktif,
        akun_keluaran: i.pajak_keluaran_id,
        akun_masukan: i.pajak_masukan_id,
      });
    });

    res.status(201).json({
      message: "Find current penjualan success",
      getHeaderPenjualan,
      getAkunSetor,
      getPajak,

      newKontaksArray,
      getSyaratPembayaran,
      newProduksArray,
      newPajaksArray,
    });
  } catch (error) {
    res.status(400).json({ message: "Find current penjualan failed", error });
    console.log(error);
  }
};
