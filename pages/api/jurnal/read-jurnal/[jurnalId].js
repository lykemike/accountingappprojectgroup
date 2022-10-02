import prisma from "../../../../libs/prisma";

export default async (req, res) => {
  try {
    const { jurnalId } = req.query;

    const headerJurnal = await prisma.headerJurnal.findFirst({
      where: {
        id: +jurnalId,
      },
      include: {
        DetailJurnal: true,
        akun: true,
      },
    });

    const newHeaderJurnalArray = [];
    newHeaderJurnalArray.push({
      id: headerJurnal.id,
      akun: headerJurnal.akun.nama_akun,
      total_debit: `Rp. ${headerJurnal.total_debit.toLocaleString()}`,
      total_kredit: `Rp. ${headerJurnal.total_kredit.toLocaleString()}`,
    });

    const detailJurnal = await prisma.detailJurnal.findMany({
      where: {
        header_jurnal_id: +jurnalId,
      },
      include: {
        header_jurnal: true,
        akun: true,
      },
    });

    const newDetailJurnalArrays = [];
    detailJurnal.map((i) => {
      newDetailJurnalArrays.push({
        id: i.id,
        tgl_transaksi: i.tgl_transaksi,
        darikepada: i.darikepada,
        kode_akun: i.akun.kode_akun,
        nama_akun: i.akun.nama_akun,
        deskripsi: i.deskripsi,
        debit: `Rp. ${i.debit.toLocaleString()}`,
        kredit: `Rp. ${i.kredit.toLocaleString()}`,
      });
    });

    const getAkuns = await prisma.akun.findMany({
      orderBy: {
        kode_akun: "asc",
      },
      include: {
        kategori_akun: true,
      },
    });

    let newAkunsArray = [];
    getAkuns.map((i) => {
      newAkunsArray.push({
        key: i.id,
        akun: i.kode_akun + " - " + i.nama_akun,
        akun_id: i.id,
        kategori_id: i.kategori_akun.id,
      });
    });

    const getAkunKasBank = await prisma.akun.findMany({
      where: {
        kategoriId: 3,
      },
    });

    const getKontak = await prisma.kontakDetail.findMany({
      where: {
        kontak_type_id: 1,
      },
      include: {
        kontak: true,
      },
    });

    res.status(201).json({
      message: "Find current jurnal success",
      newHeaderJurnalArray,
      newDetailJurnalArrays,
      headerJurnal,
      newAkunsArray,
      getAkunKasBank,
      getKontak,
    });
  } catch (error) {
    res.status(400).json({ message: "Find current jurnal failed", error });
    console.log(error);
  }
};
