import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
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
      message: "Get akuns data success",
      newAkunsArray,
      getAkunKasBank,
      getKontak,
    });
  } catch (error) {
    res.status(400).json({ message: "Get akuns data failed", error });
    console.log(error);
  }
};
