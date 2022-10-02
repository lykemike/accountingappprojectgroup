import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getKategoriKontak = await prisma.kategoriKontak.findMany();

    const kategoriOptions = [];
    getKategoriKontak?.map((i) => {
      kategoriOptions.push({
        label: i.nama,
        value: "" + i.id,
      });
    });

    const getAkunPiutang = await prisma.akun.findMany({
      where: {
        kategoriId: 1,
      },
    });
    const getAkunHutang = await prisma.akun.findMany({
      where: {
        kategoriId: 8,
      },
    });
    const getGelar = await prisma.gelar.findMany();
    const getSyaratPembayaran = await prisma.syaratPembayaran.findMany();

    const getKontaks = await prisma.kontakDetail.findMany({
      include: {
        kontak: true,
      },
    });

    let getAllClients = [];
    let getAllSuppliers = [];
    let getAllPrinciples = [];
    let getAllKaryawan = [];
    let getAllLainnya = [];

    getKontaks?.map((i) => {
      if (i.kontak_type_id === 1) {
        getAllClients.push({
          ...i.kontak,
        });
      } else if (i.kontak_type_id === 2) {
        getAllSuppliers.push({
          ...i.kontak,
        });
      } else if (i.kontak_type_id === 3) {
        getAllPrinciples.push({
          ...i.kontak,
        });
      } else if (i.kontak_type_id === 4) {
        getAllKaryawan.push({
          ...i.kontak,
        });
      } else if (i.kontak_type_id === 5) {
        getAllLainnya.push({
          ...i.kontak,
        });
      }
    });

    res.status(201).json({
      message: "Get required kontak data success",
      kategoriOptions,
      getAkunPiutang,
      getAkunHutang,
      getGelar,
      getSyaratPembayaran,
      getAllClients,
      getAllSuppliers,
      getAllPrinciples,
      getAllKaryawan,
      getAllLainnya,
    });
  } catch (error) {
    res.status(400).json({ message: "Get required kontak data failed", error });
    console.log(error);
  }
};
