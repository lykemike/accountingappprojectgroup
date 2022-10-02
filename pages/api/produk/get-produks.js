import prisma from "../../../libs/prisma";

export default async (req, res) => {
  try {
    const getKategoriProduk = await prisma.kategoriProduk.findMany();
    const getAkunPenjualan = await prisma.akun.findMany({
      where: {
        kategoriId: {
          in: [13],
        },
      },
    });

    const getAllProduks = await prisma.produk.findMany({
      include: {
        kategori: {
          select: {
            nama: true,
          },
        },
        akun: {
          select: {
            kode_akun: true,
            nama_akun: true,
          },
        },
      },
    });

    const newProduksArray = [];
    getAllProduks.map((i) => {
      newProduksArray.push({
        id: i.id,
        file: i.file_attachment,
        nama: i.nama,
        deskripsi: i.deskripsi,
        harga: "Rp. " + i.harga.toLocaleString(),
        kategori: i.kategori.nama,
        akun: i.akun.kode_akun + " - " + i.akun.nama_akun,
      });
    });

    res.status(201).json({ message: "Get all produks success", getKategoriProduk, getAkunPenjualan, newProduksArray });
  } catch (error) {
    res.status(400).json({ message: "Get all produks failed", error });
    console.log(error);
  }
};
