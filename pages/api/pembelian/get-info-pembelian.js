import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getKontak = await prisma.kontak.findMany({
      include: {
        KontakDetail: {
          where: {
            kontak_type_id: 2,
          },
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
        akun_hutang_id: i.akun_hutang_id,
      });
    });

    const getPajaks = await prisma.pajak.findMany({
      include: {
        pajak_masukan: true,
      },
    });

    let newPajaksArray = [];
    getPajaks.map((i) => {
      newPajaksArray.push({
        id: i.id,
        nama: i.nama,
        persen: i.presentase_aktif,
        akun_masukan: i.pajak_masukan_id,
      });
    });

    const getSyaratPembayaran = await prisma.syaratPembayaran.findMany();

    const getAkunPembelian = await prisma.akun.findMany({
      where: {
        kategoriId: 5,
      },
    });

    const newAkunBeliArray = [];
    getAkunPembelian.map((i) => {
      newAkunBeliArray.push({
        id: i.id,
        akun: i.kode_akun + " - " + i.nama_akun,
        akun_id: i.id,
        kategori_id: i.kategoriId,
      });
    });

    const getAkunDiskon = await prisma.akun.findMany({
      where: {
        kategoriId: 15,
      },
    });

    const newAkunDiskonArray = [];
    getAkunDiskon.map((i) => {
      newAkunDiskonArray.push({
        id: i.id,
        akun: i.kode_akun + " - " + i.nama_akun,
        akun_id: i.id,
        kategori_id: i.kategoriId,
      });
    });

    res.status(201).json({
      message: "Get all info pembelian success",
      newKontaksArray,
      newPajaksArray,
      getSyaratPembayaran,
      newAkunBeliArray,
      newAkunDiskonArray,
    });
  } catch (error) {
    res.status(400).json({ message: "Get all info pembelian failed", error });
    console.log(error);
  }
};
